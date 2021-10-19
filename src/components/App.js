import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import secretin from 'utils/secretin';
import Secretin from 'secretin';

import * as AppUIActions from 'slices/AppUISlice';

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

  handleConnectionChange() {
    this.props.dispatch(AppUIActions.connectionChange());
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
          this.props.dispatch(AppUIActions.disconnectUser()),
          delay
        );
      }
    }
  }

  render() {
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
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  const { savedUsername, loading, errors, connected, status } = state.AppUI;
  // TODO : implement corresponding selectors
  // const secrets = MetadataStore.getSecretsInFolder();
  // const options = OptionsStore.getOptions();
  return {
    savedUsername,
    loading,
    errors,
    connected,
    status,
    secrets: {},
    options: {},
  };
};

export default connect(mapStateToProps)(App);
