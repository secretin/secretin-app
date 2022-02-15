import secretin, { Statuses, Errors } from 'utils/secretin';
import { createSlice } from '@reduxjs/toolkit';

const {
  DecryptMetadataStatus,
  EndDecryptMetadataStatus,
  DecryptUserOptionsStatus,
  DecryptMetadataCacheStatus,
} = Statuses;

const {
  UsernameAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
  NeedTOTPTokenError,
} = Errors;

// Helpers because we're often doing these small state updates

const _loading = state => {
  state.loading = true;
};
const _endLoading = state => {
  state.loading = false;
};

export const AppUISlice = createSlice({
  name: 'AppUI',
  initialState: {
    savedUsername: secretin.getSavedUsername(),
    loading: false,
    connected: false,
    online: true,
    errors: {},
    currentUser: null,
    status: null,
    showShortpass: secretin.canITryShortLogin(),
  },
  reducers: {
    loading: _loading,
    endLoading: _endLoading,
    createSecret: _loading,
    createSecretSuccess: _endLoading,
    createSecretFailure: _endLoading,
    connectionChange: (state, action) => {
      state.online = action.payload.connection === 'online';
    },
    disconnectUserSuccess: state => {
      state.savedUsername = secretin.getSavedUsername();
      state.loading = false;
      state.connected = false;
      state.errors = {};
      state.currentUser = null;
    },
    createUserSuccess: (state, action) => {
      state.loading = false;
      state.connected = true;
      state.errors = {};
      state.currentUser = action.payload.currentUser;
    },
    createUserFailure: (state, action) => {
      state.loading = false;
      state.connected = false;
      state.errors = action.payload.error;
      state.status = null;
    },
    disableShortLoginSuccess: _endLoading,
    onLoginUserProgress: (state, action) => {
      const { status } = action.payload;
      if (status) state.status = { ...status };
    },
    loginUserSuccess: (state, action) => {
      const { currentUser } = action.payload;
      state.loading = false;
      state.connected = true;
      state.errors = {};
      state.status = null;
      state.currentUser = currentUser;
    },
    loginUserFailure: (state, action) => {
      const { error } = action.payload;
      state.loading = false;
      state.connected = false;
      state.errors = error;
      state.status = null;
    },
    addSecretToFolderFailure: (state, action) => {
      const { error } = action.payload;
      state.errors = error;
    },
    removeSecretFromCurrentFolderFailure: (state, action) => {
      const { error } = action.payload;
      state.errors = error;
    },
    hideShortpass: state => {
      state.showShortpass = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  loading,
  endLoading,
  createSecret,
  createSecretSuccess,
  createSecretFailure,
  disconnectUserSuccess,
  connectionChange,
  createUserSuccess,
  createUserFailure,
  disableShortLoginSuccess,
  onLoginUserProgress,
  loginUserSuccess,
  loginUserFailure,
  addSecretToFolderFailure,
  removeSecretFromCurrentFolderFailure,
  hideShortpass,
} = AppUISlice.actions;

export const disconnectUser = () => dispatch => {
  secretin.currentUser.disconnect();
  dispatch(disconnectUserSuccess());
};

export const createUser = ({
  username,
  password,
  confirmPassword,
}) => dispatch => {
  dispatch(loading());
  if (password !== confirmPassword) {
    setTimeout(
      () =>
        dispatch(
          createUserFailure({
            error: { confirmPassword: 'Passwords mismatch' },
          })
        ),
      100
    );
  } else {
    secretin
      .newUser(username, password)
      .then(currentUser => dispatch(createUserSuccess({ currentUser })))
      .catch(error => {
        if (error instanceof UsernameAlreadyExistsError) {
          return dispatch(
            createUserFailure({
              error: { username: 'User already exists' },
            })
          );
        }
        throw error;
      });
  }
};

export const loginUser = ({ username, password, token }) => dispatch => {
  dispatch(loading());
  secretin
    .loginUser(
      username,
      password,
      token,
      (...args) => dispatch(loginUserProgress(...args)),
      false
    )
    .then(currentUser =>
      dispatch(
        loginUserSuccess({
          currentUser,
          options: {
            ...currentUser.options,
            totp: currentUser.totp,
            shortLogin: secretin.canITryShortLogin(),
          },
          metadata: currentUser.metadatas,
        })
      )
    )
    .catch(error => {
      if (error instanceof UserNotFoundError) {
        return dispatch(
          loginUserFailure({
            error: { username: 'User not found' },
          })
        );
      } else if (error instanceof InvalidPasswordError) {
        if (token) {
          return dispatch(
            loginUserFailure({
              error: {
                totp: 'Token',
                password: 'Invalid password',
                token: 'or invalid token',
              },
            })
          );
        }
        return dispatch(
          loginUserFailure({
            error: { password: 'Invalid password' },
          })
        );
      } else if (error instanceof NeedTOTPTokenError) {
        return dispatch(
          loginUserFailure({
            error: { totp: 'Token' },
          })
        );
      }
      throw error;
    });
};

export const loginUserProgress = status => dispatch => {
  const currentUser = secretin.currentUser;
  switch (status.constructor) {
    case DecryptMetadataCacheStatus:
    case DecryptMetadataStatus:
    case DecryptUserOptionsStatus:
      return dispatch(onLoginUserProgress({ status }));
    case EndDecryptMetadataStatus:
      dispatch(
        loginUserSuccess({
          currentUser,
          options: {
            ...currentUser.options,
            totp: currentUser.totp,
            shortLogin: secretin.canITryShortLogin(),
          },
          metadata: currentUser.metadatas,
        })
      );
      return dispatch(onLoginUserProgress({ status: null }));
    default:
      return;
  }
};

export const shortLogin = ({ shortpass }) => dispatch => {
  dispatch(loading());
  secretin
    .shortLogin(
      shortpass,
      (...args) => dispatch(loginUserProgress(...args)),
      false
    )
    .then(currentUser => {
      dispatch(
        loginUserSuccess({
          currentUser,
          options: {
            ...currentUser.options,
            totp: currentUser.totp,
            shortLogin: secretin.canITryShortLogin(),
          },
          metadata: currentUser.metadatas,
        })
      );
    })
    .catch(() => {
      dispatch(
        loginUserFailure({
          error: { shortlogin: 'Invalid shortpass' },
        })
      );
      setTimeout(() => {
        dispatch(hideShortpass());
      }, 1000);
    });
};

export const disableShortLogin = () => dispatch => {
  dispatch(loading());
  secretin.deactivateShortLogin();
  dispatch(disableShortLoginSuccess());
  dispatch(hideShortpass());
};

export default AppUISlice.reducer;
