import { createSlice } from '@reduxjs/toolkit';
import secretin from 'utils/secretin';
import SecretDataRecord from 'models/SecretDataRecord';
import Secret from 'models/Secret';
import { updateSecret, updateSecretSuccess } from 'slices/MetadataSlice';

const getInitialState = () => ({
  secret: null,
  errors: {},
  tab: 'details',
  isUpdating: false,
});

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
    },
    changeTab: (state, action) => {
      const { tab } = action.payload;
      state.tab = tab;
    },
    updateSecretFailure: (state, action) => {
      const { error } = action.payload;
      state.errors = error;
      state.isUpdating = false;
    },
  },
  extraReducers: {
    [updateSecret]: (state, action) => {
      state.isUpdating = true;
      state.errors = {};
    },
    [updateSecretSuccess]: (state, action) => {
      const { metadata } = action.payload;
      state.secret = state.secret.merge(metadata[state.secret.id]);
      state.isUpdating = false;
      state.errors = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  showModal,
  showSecretSuccess,
  hideModal,
  changeTab,
  updateSecretFailure,
} = ShowSecretUISlice.actions;

export const showSecret = ({ secret, tab }) => dispatch => {
  dispatch(showModal({ secret, tab }));
  if (secret.type === 'folder') {
    dispatch(showSecretSuccess({ secret }));
  } else {
    secretin.getSecret(secret.id).then(data => {
      const raw = !data.fields ? { fields: data } : data;
      const secretWithData = Secret.createFromRaw(secret.getRaw());
      secretWithData.data = SecretDataRecord.createFromRaw(raw).getRaw();
      dispatch(
        showSecretSuccess({
          secret: secretWithData,
        })
      );
    });
  }
};

export default ShowSecretUISlice.reducer;
