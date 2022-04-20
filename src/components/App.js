import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import secretin from 'utils/secretin';
import Secretin from 'secretin';

import * as AppUIActions from 'slices/AppUISlice';
import { getSecretsInFolder } from 'selectors/MetadataSelectors';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

import UserConnect from 'components/users/UserConnect';
import Layout from 'components/Layout';

const LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY = 'Secret-in:acknowledgedVersion';
const DEFAULT_DEVELOP_COMMITISH = 'develop';
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
    this.hideNews = this.hideNews.bind(this);
    this.showNews = this.showNews.bind(this);
    this.acknowledgeVersion = this.acknowledgeVersion.bind(this);

    // eslint-disable-next-line no-undef
    const commit = SECRETIN_APP_COMMIT;

    const acknowledgedVersion = window.localStorage.getItem(
      LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY
    );

    this.state = {
      commit,
      acknowledgedVersion,
      news: [],
      showNews: false,
    };

    window.addEventListener('focus', this.onAppFocus);
    window.addEventListener('blur', this.onAppBlur);
  }

  componentDidMount() {
    secretin.addEventListener('connectionChange', this.handleConnectionChange);

    const somethingNew =
      this.state.commit !== DEFAULT_DEVELOP_COMMITISH &&
      this.state.acknowledgedVersion !== null &&
      this.state.acknowledgedVersion !== this.state.commit;
    if (somethingNew) {
      fetch(
        'https://raw.githubusercontent.com/secretin/secretin-website/develop/changelog.json'
      )
        .then(response => {
          return response.json();
        })
        .then(data => {
          const news = [];
          let foundAcknowledgedVersion = false;
          for (const change of data.changelog) {
            if (change.version === this.state.acknowledgedVersion) {
              foundAcknowledgedVersion = true;
              break;
            }
            news.push(change);
          }

          if (foundAcknowledgedVersion) {
            this.setState({ news });
          } else {
            // If we didn't find the acknowledged version, then we didn't updated changelog properly
            // we will just show the last change then
            this.setState({ news: [data.changelog[0]] });
          }
        });
    }
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

  showNews() {
    this.setState({ showNews: true });
  }

  hideNews() {
    this.setState({ showNews: false });
  }

  acknowledgeVersion() {
    window.localStorage.setItem(
      LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY,
      this.state.commit
    );
    this.setState({ news: [] });
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
    console.log(this.state.news);
    const shortCommit = this.state.commit ? this.state.commit.substr(0, 7) : '';
    const secretinAppVersion = this.state.commit ? (
      <span className="secretin-version">
        {this.state.news.length > 0 && (
          <>
            <Modal show={this.state.showNews} onClose={this.hideNews}>
              <Modal.Header title="What's new ?" />
              <Modal.Body>
                {this.state.news.map(change => (
                  <div key={change.version}>
                    <h2>{change.title}</h2>
                    <p>{change.description}</p>
                  </div>
                ))}
              </Modal.Body>

              <Modal.Footer>
                <Button
                  type="reset"
                  buttonStyle="default"
                  onClick={this.hideNews}
                >
                  Close
                </Button>
                <Button type="submit" onClick={this.acknowledgeVersion}>
                  Ok
                </Button>
              </Modal.Footer>
            </Modal>
            <span className="new-in-secretin-version" onClick={this.showNews}>
              •
            </span>
          </>
        )}
        <span className="secretin-version-text">
          secretin-app{' '}
          <a
            href={`https://github.com/secretin/secretin-app/commit/${this.state.commit}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {shortCommit}
          </a>
        </span>
      </span>
    ) : (
      <span className="secretin-version">
        <span className="secretin-version-text">secretin-app dev</span>
      </span>
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
            />
          )}
          <div className="footer">
            {secretinAppVersion}
            <span className="secretin-version">
              <span className="secretin-version-text">
                secretin-lib v{Secretin.version}
              </span>
            </span>
          </div>
        </div>
      </Router>
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
