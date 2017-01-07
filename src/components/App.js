import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Router from 'react-router/BrowserRouter';
import connectToStores from 'alt-utils/lib/connectToStores';

import AppUIActions from 'actions/AppUIActions';
import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';

import secretin from 'utils/secretin';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

class App extends Component {

  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  }

  static getStores() {
    return [
      AppUIStore,
      MetadataStore,
    ];
  }

  static getPropsFromStores() {
    const state = AppUIStore.getState();
    return {
      savedUsername: state.get('savedUsername'),
      loading: state.get('loading'),
      connected: state.get('connected'),
      errors: state.get('errors'),
      secrets: MetadataStore.getSecretsInFolder(),
    };
  }

  constructor(props) {
    super(props);
    this.disconnectingEvent = null;

    this.cameBack = this.cameBack.bind(this);
    this.left = this.left.bind(this);

    window.addEventListener('focus', this.cameBack);
    window.addEventListener('blur', this.left);
  }

  cameBack() {
    clearTimeout(this.disconnectingEvent);
  }

  left() {
    clearTimeout(this.disconnectingEvent);
    if (secretin.currentUser.options) {
      const delay = secretin.currentUser.options.timeToClose * 60 * 1000;
      if (delay > 0) {
        this.disconnectingEvent = setTimeout(AppUIActions.disconnectUser, delay);
      }
    }
  }


  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          {
            this.props.connected ? (
              <Layout />
            ) : (
              <UserConnect
                savedUsername={this.props.savedUsername}
                loading={this.props.loading}
                errors={this.props.errors}
              />
            )
          }
        </div>
      </Router>
    );
  }
}

export default connectToStores(App);
