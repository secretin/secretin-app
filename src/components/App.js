import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import Router from 'react-router/BrowserRouter';
import connectToStores from 'alt-utils/lib/connectToStores';
import secretin from 'utils/secretin';

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
  };

  static getStores() {
    return [AppUIStore, OptionsStore, MetadataStore];
  }

  static getPropsFromStores() {
    const state = AppUIStore.getState();
    return {
      options: OptionsStore.getOptions(),
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
              />}
        </div>
      </Router>
    );
  }
}

export default connectToStores(App);
