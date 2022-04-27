import React, { Component } from 'react';
import Secretin from 'secretin';
import FooterModal from 'components/FooterModal/index';

const LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY = 'Secret-in:acknowledgedVersion';
const DEFAULT_DEVELOP_COMMITISH = 'develop';

class Footer extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line no-undef
    const commit = SECRETIN_APP_COMMIT;

    const acknowledgedVersion = window.localStorage.getItem(
      LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY
    );

    this.state = {
      commit,
      acknowledgedVersion,
      news: [],
      showModal: acknowledgedVersion ? false : true,
    };
  }

  showNews = () => this.setState({ showModal: true });

  hideNews = () => this.setState({ showModal: false });

  acknowledgeVersion = () => {
    window.localStorage.setItem(
      LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY,
      this.state.commit
    );
    this.setState({
      news: [],
      acknowledgeVersion: this.state.commit,
      showModal: false,
    });
  };

  componentDidMount() {
    if (this.state.acknowledgedVersion === null) {
      return;
    }

    const somethingNew =
      this.state.commit !== DEFAULT_DEVELOP_COMMITISH &&
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
        })
        .catch(() => {
          // Ignore error
        });
    }
  }

  render() {
    const shortCommit = this.state.commit ? this.state.commit.substr(0, 7) : '';
    return (
      <div className="footer">
        <FooterModal
          news={this.state.news}
          acknowledgeVersion={this.acknowledgeVersion}
          acknowledgedVersion={this.state.acknowledgedVersion}
          hideNews={this.hideNews}
          showModal={this.state.showModal}
        />
        <span className="secretin-version">
          {this.state.news.length > 0 && (
            <span className="new-in-secretin-version" onClick={this.showNews}>
              •
            </span>
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
        <span className="secretin-version">
          <span className="secretin-version-text">
            secretin-lib v{Secretin.version}
          </span>
        </span>
        <span className="secretin-version">
          <span className="secretin-version-text">
            <a
              href="https://donorbox.org/secret-in-me/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span role="img" aria-label="red-heart-emoji">
                ❤️
              </span>{' '}
              <b>Donate</b>
              <span role="img" aria-label="red-heart-emoji">
                ❤️
              </span>{' '}
            </a>
          </span>
        </span>
      </div>
    );
  }
}

export default Footer;
