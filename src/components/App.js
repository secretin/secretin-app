import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import secretin from 'utils/secretin';

import * as AppUIActions from 'slices/AppUISlice';
import { getSecretsInFolder } from 'selectors/MetadataSelectors';
import Footer from 'components/Footer';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

import { IntlProvider } from 'react-intl';
import { getStrings, getSupportedBrowserLocale } from '../i18n/strings';

const getLocale = () =>
  localStorage.getItem('defaultLanguage') || getSupportedBrowserLocale();

class App extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    connected: PropTypes.bool,
    options: PropTypes.object,
    errors: PropTypes.object,
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
          () => window.location.reload(),
          delay
        );
      }
    }
  }

  render() {
    return (
      <IntlProvider
        locale={getLocale()}
        defaultLocale={getLocale()}
        messages={getStrings(getLocale())}
      >
        <Router basename={process.env.PUBLIC_URL}>
          <div className="App">
            {this.props.connected ? (
              <Layout />
            ) : (
              <UserConnect
                savedUsername={this.props.savedUsername}
                loading={this.props.loading}
                errors={this.props.errors}
              />
            )}
            <Footer onChangeLanguage={() => this.forceUpdate()} />
          </div>
        </Router>
      </IntlProvider>
    );
  }
}

const mapStateToProps = state => {
  const { savedUsername, loading, errors, connected } = state.AppUI;
  const secrets = getSecretsInFolder(state);
  const { options } = state.Options;
  return {
    savedUsername,
    loading,
    errors,
    connected,
    secrets,
    options,
  };
};

export default connect(mapStateToProps)(App);
