import alt from 'utils/alt';
import secretin, { Statuses, Errors } from 'utils/secretin';

const { DecryptMetadataStatus, DecryptUserOptionsStatus } = Statuses;

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
        .loginUser(username, password, token, this.loginUserProgress)
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
      switch (status.constructor) {
        case DecryptMetadataStatus:
          return dispatch({ status });
        case DecryptUserOptionsStatus:
          return dispatch({
            status,
            currentUser: secretin.currentUser,
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
        .shortLogin(shortpass, this.loginUserProgress)
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
