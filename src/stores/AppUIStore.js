import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';

const AppUIState = new Record({
  loading: false,
  connected: false,
  errors: new Immutable.Map(),
  currentUser: null,
});

class AppUIStore {
  constructor() {
    this.bindActions(AppUIActions);

    this.state = new AppUIState();
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
