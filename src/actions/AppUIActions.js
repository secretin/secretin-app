import alt from 'utils/alt';
import secretin, { Errors } from 'utils/secretin';

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
      'appReady'
    );
  }

  createUser({ username, password, confirmPassword }) {
    if (password !== confirmPassword) {
      return setTimeout(() => this.createUserFailure({
        error: { confirmPassword: 'Passwords mismatch' },
      }), 100);
    }
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
    return { username };
  }

  loginUser({ username, password, token }) {
    secretin
      .loginUser(username, password, token)
      .then(currentUser => (
        this.loginUserSuccess({
          currentUser,
          metadata: currentUser.metadatas,
        })
      ))
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
        }
        throw error;
      });
    return { username };
  }

  shortLogin({ shortpass }) {
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
    return true;
  }

  disableShortLogin() {
    secretin.deactivateShortLogin();
  }
}

export default alt.createActions(AppUIActions);
