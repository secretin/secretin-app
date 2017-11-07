import alt from 'utils/alt';
import secretin, { Statuses, Errors } from 'utils/secretin';

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

class AppUIActions {
  constructor() {
    this.generateActions(
      'createUserSuccess',
      'createUserFailure',
      'loginUserSuccess',
      'loginUserFailure',
      'appReady',
      'connectionChange'
    );
  }

  disconnectUser() {
    return dispatch => {
      dispatch();
      secretin.currentUser.disconnect();
    };
  }

  createUser({ username, password, confirmPassword }) {
    return dispatch => {
      dispatch();
      if (password !== confirmPassword) {
        setTimeout(
          () =>
            this.createUserFailure({
              error: { confirmPassword: 'Passwords mismatch' },
            }),
          100
        );
      } else {
        secretin
          .newUser(username, password)
          .then(currentUser => this.createUserSuccess({ currentUser }))
          .catch(error => {
            if (error instanceof UsernameAlreadyExistsError) {
              return this.createUserFailure({
                error: { username: 'User already exists' },
              });
            }
            throw error;
          });
      }
    };
  }

  loginUser({ username, password, token }) {
    return dispatch => {
      dispatch();
      secretin
        .loginUser(username, password, token, this.loginUserProgress, false)
        .then(currentUser =>
          this.loginUserSuccess({
            currentUser,
            options: {
              ...currentUser.options,
              totp: currentUser.totp,
              shortLogin: secretin.canITryShortLogin(),
            },
            metadata: currentUser.metadatas,
          })
        )
        .catch(error => {
          if (error instanceof UserNotFoundError) {
            return this.loginUserFailure({
              error: { username: 'User not found' },
            });
          } else if (error instanceof InvalidPasswordError) {
            if (token) {
              return this.loginUserFailure({
                error: {
                  totp: 'Token',
                  password: 'Invalid password',
                  token: 'or invalid token',
                },
              });
            }
            return this.loginUserFailure({
              error: { password: 'Invalid password' },
            });
          } else if (error instanceof NeedTOTPTokenError) {
            return this.loginUserFailure({
              error: { totp: 'Token' },
            });
          }
          throw error;
        });
    };
  }

  loginUserProgress(status) {
    return dispatch => {
      const currentUser = secretin.currentUser;
      switch (status.constructor) {
        case DecryptMetadataCacheStatus:
          return dispatch({ status });
        case DecryptMetadataStatus:
          return dispatch({ status });
        case DecryptUserOptionsStatus:
          return dispatch({
            status,
            currentUser,
          });
        case EndDecryptMetadataStatus:
          this.loginUserSuccess({
            currentUser,
            options: {
              ...currentUser.options,
              totp: currentUser.totp,
              shortLogin: secretin.canITryShortLogin(),
            },
            metadata: currentUser.metadatas,
          });
          return dispatch({
            status: null,
          });
        default:
          return;
      }
    };
  }

  shortLogin({ shortpass }) {
    return dispatch => {
      dispatch();
      secretin
        .shortLogin(shortpass, this.loginUserProgress, false)
        .then(currentUser => {
          this.loginUserSuccess({
            currentUser,
            options: {
              ...currentUser.options,
              totp: currentUser.totp,
              shortLogin: secretin.canITryShortLogin(),
            },
            metadata: currentUser.metadatas,
          });
        })
        .catch(() =>
          this.loginUserFailure({
            error: { shortlogin: 'Invalid shortpass' },
          })
        );
    };
  }

  disableShortLogin() {
    return dispatch => {
      dispatch();
      secretin.deactivateShortLogin();
    };
  }
}

export default alt.createActions(AppUIActions);
