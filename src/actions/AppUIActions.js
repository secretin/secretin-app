import alt from 'utils/alt';
import secretin from 'utils/secretin';

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

  createUser({ username, password }) {
    secretin
      .newUser(username, password)
      .then(currentUser => this.createUserSuccess({ currentUser }))
      .catch((error) => {
        if (error.match && error.match(/Username already exists/i)) {
          return this.createUserFailure({
            error: { username: 'User already exists' },
          });
        }
        throw error;
      });
    return { username };
  }

  loginUser({ username, password }) {
    secretin
      .loginUser(username, password)
      .then(currentUser => this.loginUserSuccess({ currentUser }))
      .catch((error) => {
        if (error.match && error.match(/user not found/i)) {
          return this.loginUserFailure({
            error: { username: 'User not found' },
          });
        } else if (error.match && error.match(/password/i)) {
          return this.loginUserFailure({
            error: { password: 'Invalid password' },
          });
        }
        throw error;
      });
    return { username };
  }
}

export default alt.createActions(AppUIActions);
