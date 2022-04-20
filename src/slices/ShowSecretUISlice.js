import { createSlice } from '@reduxjs/toolkit';
import secretin from 'utils/secretin';
import SecretDataRecord from 'models/SecretDataRecord';
import Secret from 'models/Secret';
import User from 'models/User';
import {
  updateSecretSuccess,
  createSecretUserRightsSuccess,
  updateSecretUserRightsSuccess,
  deleteSecretUserRightsSuccess,
} from 'slices/MetadataSlice';

import { disconnectUserSuccess } from 'slices/AppUISlice';

const getInitialState = () => ({
  secret: null,
  errors: {},
  tab: 'details',
  isUpdating: false,
  historyDepth: 0,
});

const _handleError = (state, action) => {
  const { error } = action.payload;
  state.errors = error;
  state.isUpdating = false;
};

export const ShowSecretUISlice = createSlice({
  name: 'ShowSecretUI',
  initialState: getInitialState(),
  reducers: {
    showModal: (state, action) => {
      const { secret, tab } = action.payload;
      state.secret = secret;
      state.tab = tab || 'details';
      state.errors = {};
    },
    showSecretSuccess: (state, action) => {
      const { secret } = action.payload;
      state.secret = secret;
      state.errors = {};
    },
    hideModal: (state, action) => {
      state.secret = null;
      state.errors = {};
      state.historyDepth = 0;
    },
    changeTab: (state, action) => {
      const { tab } = action.payload;
      state.tab = tab;
    },
    updateSecretStart: (state, action) => {
      state.isUpdating = true;
      state.errors = {};
    },
    historyShowOlder: state => {
      if (state.historyDepth + 1 < state.secret.history.length)
        state.historyDepth += 1;
    },
    historyShowNewer: state => {
      if (state.historyDepth - 1 >= 0) state.historyDepth -= 1;
    },
    updateSecretFailure: _handleError,
    createSecretUserRightsFailure: _handleError,
    updateSecretUserRightsFailure: _handleError,
    deleteSecretUserRightsFailure: _handleError,
  },
  extraReducers: {
    [updateSecretSuccess]: (state, action) => {
      const { metadata, history } = action.payload;
      const secretMetadata = metadata[state.secret.id];
      // The metadata coming back from Secretin has flat user objects indexed by id
      // Recreate the array of User instances
      secretMetadata.users = Object.values(secretMetadata.users).map(rawUser =>
        User.createFromRaw(rawUser)
      );
      state.secret = state.secret.merge(metadata[state.secret.id]);
      state.secret.history = history;
      state.isUpdating = false;
      state.errors = {};
    },
    [createSecretUserRightsSuccess]: (state, action) => {
      const { user, rights } = action.payload;
      state.secret.users.push(user.merge({ rights }));
      state.isUpdating = false;
      state.errors = {};
    },
    [updateSecretUserRightsSuccess]: (state, action) => {
      const { rights, user } = action.payload;
      state.secret.users = state.secret.users.map(_user => {
        if (_user.id === user.id) return _user.merge({ rights });
        return _user;
      });
      state.isUpdating = false;
      state.errors = {};
    },
    [deleteSecretUserRightsSuccess]: (state, action) => {
      const { user } = action.payload;
      state.secret.users = state.secret.users.filter(
        userToFilter => userToFilter.id !== user.id
      );
      state.isUpdating = false;
      state.errors = {};
    },
    [disconnectUserSuccess]: getInitialState,
  },
});

// Action creators are generated for each case reducer function
export const {
  showModal,
  showSecretSuccess,
  hideModal,
  changeTab,
  updateSecretStart,
  updateSecretFailure,
  createSecretUserRightsFailure,
  updateSecretUserRightsFailure,
  deleteSecretUserRightsFailure,
  historyShowOlder,
  historyShowNewer,
} = ShowSecretUISlice.actions;

export const showSecret = ({ secret, tab }) => async dispatch => {
  dispatch(showModal({ secret, tab }));
  if (secret.type === 'folder') {
    dispatch(showSecretSuccess({ secret }));
  } else {
    const data = await secretin.getSecret(secret.id);
    const raw = !data.fields ? { fields: data } : data;
    const secretWithData = Secret.createFromRaw(secret.getRaw());
    secretWithData.data = SecretDataRecord.createFromRaw(raw).getRaw();
    try {
      secretWithData.history = await secretin.getHistory(secret.id);
    } catch (error) {
      console.log(error);
      secretWithData.history = [];
    }
    dispatch(
      showSecretSuccess({
        secret: secretWithData,
      })
    );
  }
};

export default ShowSecretUISlice.reducer;
