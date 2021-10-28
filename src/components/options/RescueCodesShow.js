import React, { Component } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

import * as OptionsActions from 'slices/OptionsSlice';

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

class RescueCodesShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    rescueCodes: PropTypes.array,
    currentUser: PropTypes.object,
    actions: PropTypes.object,
  };

  static defaultProps = {
    shown: false,
    rescueCodes: [],
  };

  constructor(props) {
    super(props);

    this.currentUser = props.currentUser;
  }

  render() {
    const { rescueCodes } = this.props;
    const { username } = this.currentUser;

    return (
      <Modal
        show={this.props.shown}
        onClose={this.props.actions.hideRescueCodes}
      >
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
          <pre>{rescueCodes.join(' ')}</pre>
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
            onClick={this.props.actions.hideRescueCodes}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(OptionsActions, dispatch),
});

const mapStateToProps = state => {
  const { rescueCodes, showRescueCodes } = state.Options;
  const { currentUser } = state.AppUI;
  return {
    rescueCodes,
    shown: showRescueCodes,
    currentUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RescueCodesShow);
