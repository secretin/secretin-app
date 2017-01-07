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

    this.disconnectingEvent = null;

    window.addEventListener('focus', () => { this.cameBack(); });
    window.addEventListener('blur', () => { this.left(); });
  }

  cameBack() {
    clearTimeout(this.disconnectingEvent);
    return true;
  }

  left() {
    clearTimeout(this.disconnectingEvent);
    if (secretin.currentUser.options) {
      const delay = secretin.currentUser.options.timeToClose * 60 * 1000;
      if (delay > 0) {
        this.disconnectingEvent = setTimeout(this.disconnectUser.bind(this), delay);
      }
    }
    return true;
  }

  onCreateUser() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  disconnectUser() {
    secretin.currentUser.disconnect();
    this.setState(
      this.state.merge({
        savedUsername: secretin.getSavedUsername(),
        loading: false,
        connected: false,
        errors: new Immutable.Map(),
        currentUser: null,
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

  onShortLogin() {
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
