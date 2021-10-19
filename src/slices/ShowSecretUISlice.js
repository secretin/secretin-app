import { createSlice } from '@reduxjs/toolkit';
import secretin from 'utils/secretin';
import SecretDataRecord from 'models/SecretDataRecord';

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
      this.state.secret = secret;
      this.state.tab = tab || 'details';
      this.state.errors = {};
    },
    showSecretSuccess: (state, action) => {
      const { secret } = action.payload;
      this.state.secret = secret;
      this.state.errors = {};
    },
    hideModal: (state, action) => {
      this.state.secret = null;
      this.state.errors = {};
    },
    changeTab: (state, action) => {
      const { tab } = action.payload;
      this.state.tab = tab;
    },
    updateSecret: (state, action) => {
      this.state.isUpdating = true;
      this.state.errors = {};
    },
    updateSecretSuccess: (state, action) => {
      // const { secret } = this.state;
      this.state.isUpdating = false;
      this.state.errors = {};
      // TODO : we're supposed to get the secret from the Metadata slice, but this reducer can't access another slice, so we will have to pass it in the action or something
      // Maybe with a thunk, getState will return the full state ?
      // this.state.secret = secret ?  : null;
      // this.setState(
      //   this.state
      //     .update('secret', secret =>
      //       secret
      //         ? secret.merge(
      //             MetadataStore.getById(this.state.secret.id)
      //               .toMap()
      //               .remove('data')
      //           )
      //         : null
      //     )
      //     .set('isUpdating', false)
      //     .set('errors', new Immutable.Map())
      // );
    },

    updateSecretFailure: (state, action) => {
      const { error } = action.payload;

      this.state.errors = error;
      this.state.isUpdating = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  showModal,
  showSecretSuccess,
  hideModal,
  changeTab,
  updateSecret,
  updateSecretSuccess,
  updateSecretFailure,
} = ShowSecretUISlice.actions;

export const showSecret = ({ secret, tab }) => dispatch => {
  dispatch(showModal({ secret, tab }));
  if (secret.type === 'folder') {
    dispatch(showSecretSuccess({ secret }));
  } else {
    secretin.getSecret(secret.id).then(data => {
      const raw = !data.fields ? { fields: data } : data;
      dispatch(
        showSecretSuccess({
          secret: secret.set('data', SecretDataRecord.createFromRaw(raw)),
        })
      );
    });
  }
};

export default ShowSecretUISlice.reducer;
