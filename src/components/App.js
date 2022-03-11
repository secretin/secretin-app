import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import secretin from 'utils/secretin';
import Secretin from 'secretin';

import * as AppUIActions from 'slices/AppUISlice';
import { getSecretsInFolder } from 'selectors/MetadataSelectors';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

class App extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    options: PropTypes.object,
    errors: PropTypes.object,
    status: PropTypes.shape({
      message: PropTypes.string,
      statue: PropTypes.number,
      total: PropTypes.number,
    }),
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.disconnectingEvent = null;

    this.onAppFocus = this.onAppFocus.bind(this);
    this.onAppBlur = this.onAppBlur.bind(this);
    this.handleConnectionChange = this.handleConnectionChange.bind(this);

    window.addEventListener('focus', this.onAppFocus);
    window.addEventListener('blur', this.onAppBlur);
  }

  componentDidMount() {
    secretin.addEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillUnmount() {
    secretin.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleConnectionChange({ connection }) {
    this.props.dispatch(AppUIActions.connectionChange(connection));
  }

  onAppFocus() {
    clearTimeout(this.disconnectingEvent);
  }

  onAppBlur() {
    clearTimeout(this.disconnectingEvent);
    const { connected, options } = this.props;

    if (connected && options) {
      if (options.timeToClose > 0) {
        const delay = options.timeToClose * 60 * 1000;
        this.disconnectingEvent = setTimeout(
          () => this.props.dispatch(AppUIActions.disconnectUser()),
          delay
        );
      }
    }
  }

  render() {
    // eslint-disable-next-line no-undef
    const shortCommit = SECRETIN_APP_COMMIT
      ? // eslint-disable-next-line no-undef
        SECRETIN_APP_COMMIT.substr(0, 7)
      : '';
    // eslint-disable-next-line no-undef
    const secretinAppVersion = SECRETIN_APP_COMMIT ? (
      <span className="secretin-version">
        secretin-app{' '}
        <a
          // eslint-disable-next-line no-undef
          href={`https://github.com/secretin/secretin-app/commit/${SECRETIN_APP_COMMIT}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {shortCommit}
        </a>
      </span>
    ) : (
      <span className="secretin-version">secretin-app dev</span>
    );
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          {this.props.connected ? (
            <Layout />
          ) : (
            <UserConnect
              savedUsername={this.props.savedUsername}
              loading={this.props.loading}
              errors={this.props.errors}
              status={this.props.status}
            />
          )}
          <span className="secretin-version">
            secretin-lib v{Secretin.version}
          </span>
          {secretinAppVersion}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  const { savedUsername, loading, errors, connected, status } = state.AppUI;
  const secrets = getSecretsInFolder(state);
  const { options } = state.Options;
  return {
    savedUsername,
    loading,
    errors,
    connected,
    status,
    secrets,
    options,
  };
};

export default connect(mapStateToProps)(App);
