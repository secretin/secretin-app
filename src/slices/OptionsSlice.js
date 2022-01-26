import { createSlice } from '@reduxjs/toolkit';
import secretin from 'utils/secretin';
import uuid from 'uuid';

const getInitialState = () => ({
  options: {},
  errors: {},
  showQRCode: false,
  showShortLogin: false,
  showRescueCodes: false,
  newPass: {
    shown: false,
    newPass1: '',
    newPass2: '',
    error: '',
    loading: false,
    status: 'initial', // 3 possible states : initial, success, failure
  },
  rescueCodes: [],
  loading: false,
});

export const OptionsSlice = createSlice({
  name: 'Options',
  initialState: getInitialState(),
  reducers: {
    loadOptions: (state, action) => {
      const { options } = action.payload;
      state.options = options;
    },

    _activateTotp: (state, action) => {
      state.loading = true;
    },

    _activateShortLogin: (state, action) => {
      state.loading = true;
    },

    _toggleTotp: (state, action) => {
      state.showQRCode = action.payload;
    },

    _toggleShortLogin: (state, action) => {
      state.showShortLogin = !state.showShortLogin;
    },

    activateTotpFailure: (state, action) => {
      const { error } = action.payload;
      state.errors.totp = error;
      state.loading = false;
    },

    hideQRCode: (state, action) => {
      state.showQRCode = false;
      state.loading = false;
      state.errors = {};
    },

    hideShortLogin: (state, action) => {
      state.showShortLogin = false;
      state.loading = false;
      state.errors = {};
    },

    activateTotpSuccess: (state, action) => {
      state.showQRCode = false;
      state.loading = false;
      state.errors = {};
      state.options.totp = true;
    },

    deactivateTotpSuccess: (state, action) => {
      state.options.totp = false;
    },

    deactivateShortLoginSuccess: (state, action) => {
      const { shortLogin } = action.payload;
      state.options.shortLogin = shortLogin;
    },

    activateShortLoginSuccess: (state, action) => {
      const { shortLogin } = action.payload;
      state.showShortLogin = false;
      state.loading = false;
      state.errors = {};
      state.options.shortLogin = shortLogin;
    },

    changeDelaySuccess: (state, action) => {
      const { timeToClose } = action.payload;
      state.options.timeToClose = timeToClose;
    },

    changeNewPass1: (state, action) => {
      const newPass1 = action.payload;
      state.newPass.newPass1 = newPass1.value;
    },

    changeNewPass2: (state, action) => {
      const newPass2 = action.payload;
      state.newPass.newPass2 = newPass2.value;
    },

    showChangePassword: (state, action) => {
      state.newPass.newPass1 = '';
      state.newPass.newPass2 = '';
      state.newPass.error = '';
      state.newPass.loading = false;
      state.newPass.shown = true;
    },

    hideChangePassword: (state, action) => {
      state.newPass.newPass1 = '';
      state.newPass.newPass2 = '';
      state.newPass.error = '';
      state.newPass.loading = false;
      state.newPass.shown = false;
    },

    _changePassword: (state, action) => {
      state.newPass.loading = true;
      state.newPass.error = '';
    },

    changePasswordSuccess: (state, action) => {
      state.newPass.newPass1 = '';
      state.newPass.newPass2 = '';
      state.newPass.error = '';
      state.newPass.loading = false;
      state.newPass.status = 'success';
    },

    changePasswordFailure: (state, action) => {
      state.newPass.error = 'Password change failed';
      state.newPass.loading = false;
      state.newPass.status = 'failure';
    },

    showRescueCodesSuccess: (state, action) => {
      const { rescueCodes } = action.payload;
      state.rescueCodes = rescueCodes;
      state.showRescueCodes = true;
    },

    hideRescueCodes: (state, action) => {
      state.rescueCodes = [];
      state.showRescueCodes = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  loadOptions,
  _activateTotp,
  _activateShortLogin,
  _toggleTotp,
  _toggleShortLogin,
  activateTotpFailure,
  activateTotpSuccess,
  hideQRCode,
  hideShortLogin,
  deactivateTotpSuccess,
  deactivateShortLoginSuccess,
  activateShortLoginSuccess,
  changeDelaySuccess,
  changeNewPass1,
  changeNewPass2,
  showChangePassword,
  hideChangePassword,
  _changePassword,
  changePasswordSuccess,
  changePasswordFailure,
  showRescueCodesSuccess,
  hideRescueCodes,
} = OptionsSlice.actions;

export const deactivateTotp = () => (dispatch, getState) =>
  secretin
    .deactivateTotp()
    .then(() => dispatch(deactivateTotpSuccess()))
    .catch(() => {
      // dispatch(deactivateTotpFailure());
    });

export const activateTotp = ({ seed, token }) => (dispatch, getState) => {
  dispatch(_activateTotp());
  return secretin.api
    .testTotp(seed.b32, token)
    .then(() => secretin.activateTotp(seed))
    .then(() => dispatch(activateTotpSuccess()))
    .catch(err => {
      if (err === 'Invalid couple') {
        dispatch(activateTotpFailure({ error: 'Synchronisation error' }));
      } else {
        dispatch(activateTotpFailure({ error: 'An error occured' }));
      }
    });
};

export const activateShortLogin = ({ shortpass }) => (dispatch, getState) => {
  dispatch(_activateShortLogin());
  return secretin
    .activateShortLogin(shortpass, uuid.v4())
    .then(() =>
      dispatch(
        activateShortLoginSuccess({
          shortLogin: secretin.canITryShortLogin(),
        })
      )
    )
    .catch(() => {
      // dispatch(activateShortLoginFailure());
    });
};

export const deactivateShortLogin = () => (dispatch, getState) => {
  secretin
    .deactivateShortLogin()
    .then(() =>
      dispatch(
        deactivateShortLoginSuccess({
          shortLogin: secretin.canITryShortLogin(),
        })
      )
    )
    .catch(() => {
      // dispatch(deactivateShortLoginFailure());
    });
};

export const changePassword = ({ newPass }) => (dispatch, getState) => {
  dispatch(_changePassword());
  secretin
    .changePassword(newPass)
    .then(() => {
      dispatch(changePasswordSuccess());
    })
    .catch(() => {
      dispatch(changePasswordFailure());
    });
};

export const toggleTotp = ({ checked }) => (dispatch, getState) => {
  dispatch(_toggleTotp());
  if (checked) {
    return true;
  }
  return dispatch(deactivateTotp());
};

export const showRescueCodes = () => (dispatch, getState) => {
  if (
    !window.confirm(
      'Be careful, this will replace your previously generated codes. Continue?'
    )
  ) {
    return;
  }
  secretin.getRescueCodes().then(rescueCodes => {
    dispatch(showRescueCodesSuccess({ rescueCodes }));
  });
};

export const toggleShortLogin = ({ checked }) => (dispatch, getState) => {
  dispatch(_toggleShortLogin());
  if (checked) {
    return true;
  }
  return dispatch(deactivateShortLogin());
};

export const toggleAutoLogout = ({ checked }) => (dispatch, getState) => {
  const delay = checked ? 30 : 0;
  return dispatch(changeTimeToClose({ timeToClose: delay }));
};

export const changeTimeToClose = ({ timeToClose }) => (dispatch, getState) => {
  secretin
    .editOption('timeToClose', timeToClose)
    .then(() => {
      dispatch(changeDelaySuccess({ timeToClose }));
    })
    .catch(() => {
      // dispatch(changeDelayFailure());
    });
  return true;
};

export default OptionsSlice.reducer;
