import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { BrowserRouter as Router } from 'react-router-dom';
import connectToStores from 'alt-utils/lib/connectToStores';
import secretin from 'utils/secretin';
import Secretin from 'secretin';

import AppUIActions from 'actions/AppUIActions';
import AppUIStore from 'stores/AppUIStore';
import OptionsStore from 'stores/OptionsStore';
import MetadataStore from 'stores/MetadataStore';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

class App extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    options: PropTypes.instanceOf(Immutable.Map),
    errors: PropTypes.instanceOf(Immutable.Map),
    status: PropTypes.shape({
      message: PropTypes.string,
      statue: PropTypes.number,
      total: PropTypes.number,
    }),
  };

  static getStores() {
    return [AppUIStore, OptionsStore, MetadataStore];
  }

  static getPropsFromStores() {
    const {
      savedUsername,
      loading,
      errors,
      connected,
      status,
    } = AppUIStore.getState();
    return {
      secrets: MetadataStore.getSecretsInFolder(),
      options: OptionsStore.getOptions(),
      savedUsername,
      loading,
      connected,
      errors,
      status,
    };
  }

  constructor(props) {
    super(props);
    this.disconnectingEvent = null;

    this.onAppFocus = this.onAppFocus.bind(this);
    this.onAppBlur = this.onAppBlur.bind(this);

    window.addEventListener('focus', this.onAppFocus);
    window.addEventListener('blur', this.onAppBlur);
  }

  componentDidMount() {
    secretin.addEventListener(
      'connectionChange',
      AppUIActions.connectionChange
    );
  }

  componentWillUnmount() {
    secretin.removeEventListener(
      'connectionChange',
      AppUIActions.connectionChange
    );
  }

  onAppFocus() {
    clearTimeout(this.disconnectingEvent);
  }

  onAppBlur() {
    clearTimeout(this.disconnectingEvent);
    const { connected, options } = this.props;

    if (connected && options) {
      const delay = options.get('timeToClose') * 60 * 1000;
      if (delay > 0) {
        this.disconnectingEvent = setTimeout(
          AppUIActions.disconnectUser,
          delay
        );
      }
    }
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          {this.props.connected
            ? <Layout />
            : <UserConnect
                savedUsername={this.props.savedUsername}
                loading={this.props.loading}
                errors={this.props.errors}
                status={this.props.status}
              />}
          <span className="secretin-version">
            secretin-lib v{Secretin.version}
          </span>
        </div>
      </Router>
    );
  }
}

export default connectToStores(App);
