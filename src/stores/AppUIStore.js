import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import secretin from 'utils/secretin';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';
import MetadataActions from 'actions/MetadataActions';

const AppUIState = new Record({
  savedUsername: '',
  loading: false,
  connected: false,
  online: true,
  errors: new Immutable.Map(),
  currentUser: null,
  status: null,
});

class AppUIStore {
  constructor() {
    this.bindActions(AppUIActions);
    this.bindAction(MetadataActions.CREATE_SECRET, this.loading);
    this.bindAction(MetadataActions.CREATE_SECRET_SUCCESS, this.endLoading);
    this.bindAction(MetadataActions.CREATE_SECRET_FAILURE, this.endLoading);

    this.state = new AppUIState({
      savedUsername: secretin.getSavedUsername(),
    });
  }

  loading() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  endLoading() {
    this.setState(
      this.state.merge({
        loading: false,
      })
    );
  }

  onConnectionChange({ connection }) {
    this.setState(
      this.state.merge({
        online: connection === 'online',
      })
    );
  }

  onCreateUser() {
    this.setState(
      this.state.merge({
        loading: true,
      })
    );
  }

  onDisconnectUser() {
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
        status: null,
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

  onLoginUserProgress({ status, currentUser }) {
    if (currentUser) {
      this.setState(
        this.state.merge({
          status,
          connected: true,
          currentUser,
        })
      );
    } else {
      this.setState(this.state.set('status', status));
    }
  }

  onLoginUserSuccess({ currentUser }) {
    this.setState(
      this.state.merge({
        loading: false,
        connected: true,
        errors: new Immutable.Map(),
        status: null,
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
        status: null,
      })
    );
  }

  static isLoading() {
    return this.getState().get('loading');
  }

  static getCurrentUser() {
    return this.getState().get('currentUser');
  }

  static isOnline() {
    return this.getState().get('online');
  }
}

export default alt.createStore(makeImmutable(AppUIStore), 'AppUIStore');
