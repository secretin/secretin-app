import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';
import moment from 'moment';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

import AppUIStore from 'stores/AppUIStore';
import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';

function getFile({ username, rescueCodes }) {
  const codes = rescueCodes.map((code, i) => `${i + 1}. ${code}`).toArray();
  const content = [
    'SAVE YOUR BACKUP CODES',
    'Keep these backup codes somewhere safe but accessible.',
    '',
    ...codes,
    '',
    `* Codes for user ${username}`,
    `* Generated on ${moment().format('MMM Do, YYYY')}`,
    '* You can only use each backup code once.',
    `* Need new codes? Go to ${document.location.href}`,
  ].join('\n');

  return new Blob([content], { type: 'text/plain;charset=utf-8;' });
}

class QRCodeShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    rescueCodes: PropTypes.instanceOf(Immutable.List),
  };

  static defaultProps = {
    shown: false,
    rescueCodes: new Immutable.List(),
  };

  static getStores() {
    return [OptionsStore];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getState();
    return {
      rescueCodes: state.get('rescueCodes'),
      shown: state.get('showRescueCodes'),
    };
  }

  constructor(props) {
    super(props);

    this.currentUser = AppUIStore.getCurrentUser();
  }

  render() {
    const { rescueCodes } = this.props;
    const { username } = this.currentUser;

    return (
      <Modal show={this.props.shown} onClose={OptionsActions.hideRescueCodes}>
        <Modal.Header>
          <span className="text">Rescue codes</span>
        </Modal.Header>

        <Modal.Body>
          <h3>
            You should view and download your recovery codes and keep them safe.
          </h3>
          <p>
            If you lose access to your secure token and your code generator, a
            recovery code is the only way to recover your account.
          </p>
          <pre>
            {rescueCodes.join(' ')}
          </pre>
          <p>
            <a
              href={window.URL.createObjectURL(
                getFile({ username, rescueCodes })
              )}
              download={`Backup-codes-${username}@secretin.txt`}
            >
              Download my codes
            </a>
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideRescueCodes}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(QRCodeShow);
