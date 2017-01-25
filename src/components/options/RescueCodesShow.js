import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line
import Secretin from 'secretin';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';

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
    return [
      OptionsStore,
    ];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getState();
    return {
      rescueCodes: state.get('rescueCodes'),
      shown: state.get('showRescueCodes'),
    };
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={OptionsActions.hideRescueCodes}
      >
        <Modal.Header>
          <span className="text">
            Rescue codes
          </span>
        </Modal.Header>

        <Modal.Body>
          {
            this.props.rescueCodes.map((rescueCode, i) => (
              <span key={i} className="rescue-code">{rescueCode}</span>
            )).toArray()
          }
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
