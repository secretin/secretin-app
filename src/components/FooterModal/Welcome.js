import React, { Component } from 'react';
import Modal from 'components/utilities/Modal';

class Welcome extends Component {
  render() {
    return (
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
              If it&apos;s your first time here, you can create a user and start
              saving your secrets.
            </p>
            <p>
              Be careful, all your secrets will be protected by the password you
              pick. There is <b>no way</b> to retrieve your secrets if you
              forget your password !
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
              If you enjoy it, please consider{' '}
              <a
                href="https://donorbox.org/secret-in-me/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <b>donating !</b>
              </a>{' '}
            </p>
            <p>It&apos;ll help us support hosting costs (~50$ per month).</p>
          </div>
        </Modal.Body>
      </>
    );
  }
}

export default Welcome;
