import alt from 'utils/alt';
import secretin, { Errors } from 'utils/secretin';

const {
  UsernameAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
  NeedTOTPTokenError,
  OfflineError,
} = Errors;

class AppUIActions {
  constructor() {
    this.generateActions(
      'createUserSuccess',
      'createUserFailure',
      'loginUserSuccess',
      'loginUserFailure',
      'appReady',
      'online'
    );
  }

  createUser({ username, password, confirmPassword }) {
    return (dispatch) => {
      dispatch();
      if (password !== confirmPassword) {
        setTimeout(() => this.createUserFailure({
          error: { confirmPassword: 'Passwords mismatch' },
        }), 100);
      } else {
        secretin
          .newUser(username, password)
          .then(currentUser => this.createUserSuccess({ currentUser }))
          .catch((error) => {
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
    return (dispatch) => {
      dispatch();
      secretin.loginUser(username, password, token)
        .then((currentUser) => {
          this.loginUserSuccess({
            currentUser,
            metadata: currentUser.metadatas,
          });
          if (typeof window.process !== 'undefined') {
            // Electron
            return secretin.getDb();
          }
          return Promise.resolve();
        })
        .catch((error) => {
          if (error instanceof UserNotFoundError) {
            return this.loginUserFailure({
              error: { username: 'User not found' },
            });
          } else if (error instanceof InvalidPasswordError) {
            if (token) {
              return this.loginUserFailure({
                error: { totp: 'Token', password: 'Invalid password', token: 'or invalid token' },
              });
            }
            return this.loginUserFailure({
              error: { password: 'Invalid password' },
            });
          } else if (error instanceof NeedTOTPTokenError) {
            return this.loginUserFailure({
              error: { totp: 'Token' },
            });
          } else if (error instanceof OfflineError) {
            return this.offline();
          }
          throw error;
        });
    };
  }

  offline() {
    return (dispatch) => {
      dispatch();
      secretin.testOnline()
        .then(() => this.online());
    };
  }

  shortLogin({ shortpass }) {
    return (dispatch) => {
      dispatch();
      secretin
        .shortLogin(shortpass)
        .then((currentUser) => {
          this.loginUserSuccess({
            currentUser,
            metadata: currentUser.metadatas,
          });
        })
        .catch(() => this.loginUserFailure({
          error: { shortlogin: 'Invalid shortpass' },
        }));
    };
  }

  disableShortLogin() {
    return (dispatch) => {
      dispatch();
      secretin.deactivateShortLogin();
    };
  }
}

export default alt.createActions(AppUIActions);
