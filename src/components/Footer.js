import React, { Component } from 'react';
import Secretin from 'secretin';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

const LOCAL_STORAGE_ACKNOWLEDGE_VERSION_KEY = 'Secret-in:acknowledgedVersion';
const DEFAULT_DEVELOP_COMMITISH = 'develop';

class Footer extends Component {
  constructor(props) {
    super(props);
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
      showNews: acknowledgedVersion ? false : true,
    };
    console.log(this.state);
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
    this.setState({
      news: [],
      acknowledgeVersion: this.state.commit,
      showNews: false,
    });
  }

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
        });
    }
  }

  render() {
    const shortCommit = this.state.commit ? this.state.commit.substr(0, 7) : '';
    const secretinAppVersion = this.state.commit ? (
      <span className="secretin-version">
        <Modal
          show={this.state.showNews}
          onClose={
            this.state.acknowledgedVersion === null ? false : this.hideNews
          }
        >
          {this.state.acknowledgedVersion === null ? (
            <>
              <Modal.Header title="Welcome to Secret-in.me" />
              <Modal.Body>
                <div>
                  <p>
                    <a
                      href="https://my.secret-in.me"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Secret-in.me
                    </a>{' '}
                    is a team-oriented{' '}
                    <a
                      href="https://github.com/secretin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      open source
                    </a>{' '}
                    password manager with a focus on transparency, usability and
                    security.
                  </p>
                  <p>
                    If it&apos;s your first time here, you can create a user and
                    start saving your secrets.
                  </p>
                  <p>
                    Be careful, all your secrets will be protected by the
                    password you pick. There is <b>no way</b> to retrieve your
                    secrets if you forget your password !
                  </p>
                  <p>
                    This secret manager is freely provided with{' '}
                    <span role="img" aria-label="red-heart-emoji">
                      ❤️
                    </span>{' '}
                    by{' '}
                    <a
                      href="https://bug.builders"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Bug Builders.
                    </a>
                  </p>
                  <p>
                    If you enjoy it, please consider {' '}
                    <a
                      href="https://donorbox.org/secret-in-me/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>donating !</b>
                    </a>{' '}
                  </p>
                  <p>
                    It&apos;ll help us support hosting costs (~50$ per
                    month).
                  </p>
                </div>
              </Modal.Body>
            </>
          ) : (
            <>
              <Modal.Header title="What's new ?" />
              <Modal.Body>
                {this.state.news.map(change => (
                  <div key={change.version}>
                    <h2>{change.title}</h2>
                    <p>{change.description}</p>
                  </div>
                ))}
              </Modal.Body>
            </>
          )}

          <Modal.Footer>
            {this.state.acknowledgedVersion !== null && (
              <Button
                type="reset"
                buttonStyle="default"
                onClick={this.hideNews}
              >
                Close
              </Button>
            )}
            <Button type="submit" onClick={this.acknowledgeVersion}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
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
    ) : (
      <span className="secretin-version">
        <span className="secretin-version-text">secretin-app dev</span>
      </span>
    );
    return (
      <div className="footer">
        {secretinAppVersion}
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
