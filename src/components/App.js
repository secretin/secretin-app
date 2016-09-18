import React, { Component, PropTypes } from 'react';
import Router from 'react-router/BrowserRouter';
import connectToStores from 'alt-utils/lib/connectToStores';

import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

class App extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    error: PropTypes.bool,
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
      loading: state.get('loading'),
      connected: state.get('connected'),
      error: state.get('error'),
      secrets: MetadataStore.getSecretsInFolder(),
    };
  }

  render() {
    return (
      <Router>
        <div className="App">
          {
            this.props.connected ? (
              <Layout />
            ) : (
              <UserConnect
                loading={this.props.loading}
                error={this.props.error}
              />
            )
          }
        </div>
      </Router>
    );
  }
}

export default connectToStores(App);
