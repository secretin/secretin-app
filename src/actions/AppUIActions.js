import alt from 'utils/alt';
import secretin, { Errors } from 'utils/secretin';

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
        if (error instanceof Errors.UsernameAlreadyExistsError) {
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
      .then(currentUser => (
        this.loginUserSuccess({
          currentUser,
          metadata: currentUser.metadatas,
        })
      ))
      .catch((error) => {
        if (error instanceof Errors.UserNotFoundError) {
          return this.loginUserFailure({
            error: { username: 'User not found' },
          });
        } else if (error instanceof Errors.InvalidPasswordError) {
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
