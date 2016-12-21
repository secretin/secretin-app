import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import secretin from 'utils/secretin';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';

const AppUIState = new Record({
  savedUsername: '',
  loading: false,
  connected: false,
  errors: new Immutable.Map(),
  currentUser: null,
});

class AppUIStore {
  constructor() {
    this.bindActions(AppUIActions);

    this.state = new AppUIState({
      savedUsername: secretin.getSavedUsername(),
    });
  }

  onCreateUser() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  onCreateUserSuccess({ currentUser }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: true,
        errors: new Immutable.Map(),
        currentUser,
      })
    );
  }

  onCreateUserFailure({ error }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: false,
        errors: new Immutable.Map(error),
      })
    );
  }

  onLoginUser() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  onLoginUserSuccess({ currentUser }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: true,
        errors: new Immutable.Map(),
        currentUser,
      })
    );
  }

  onLoginUserFailure({ error }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: false,
        errors: new Immutable.Map(error),
      })
    );
  }

  static getCurrentUser() {
    return this.getState().get('currentUser');
  }
}

export default alt.createStore(
  makeImmutable(AppUIStore),
  'AppUIStore'
);
