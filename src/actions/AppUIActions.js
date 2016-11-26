import alt from 'utils/alt';
import secretin from 'utils/secretin';

class AppUIActions {
  constructor() {
    this.generateActions(
      'loginUserSuccess',
      'loginUserFailure',
      'appReady'
    );
  }

  loginUser({ username, password }) {
    secretin
      .loginUser(username, password)
      .then(currentUser => this.loginUserSuccess({ currentUser }))
      .catch(error => this.loginUserFailure({ error }));
    return { username };
  }
}

export default alt.createActions(AppUIActions);
