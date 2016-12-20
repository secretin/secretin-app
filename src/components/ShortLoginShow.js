import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line
import Secretin from 'secretin';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';

import Icon from 'components/utilities/Icon';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';

class QRCodeShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    shown: false,
    errors: new Immutable.Map(),
  };

  static getStores() {
    return [
      OptionsStore,
    ];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getState();
    return {
      errors: state.get('errors'),
      shown: state.get('showShortLogin'),
    };
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      device: '',
      shortpass: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.shown) {
      this.setState({
        device: '',
        shortpass: '',
      });
    }
  }

  handleChange({ name, value }) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={OptionsActions.hideShortLogin}
      >
        <Modal.Header>
          <Icon id="gear" size="small" />
          <span className="text" title="Trust this device">
            Trust this device
          </span>
        </Modal.Header>

        <Modal.Body>
          <div style={{ textAlign: 'center' }}>
            <Input
              label="Device name"
              name="device"
              value={this.state.device}
              type="text"
              onChange={this.handleChange}
              error={this.props.errors.get('shortlogin')}
            />
            <Input
              label="Shortpass"
              name="shortpass"
              value={this.state.shortpass}
              type="password"
              onChange={this.handleChange}
            />
            <Button
              type="button"
              buttonStyle="primary"
              onClick={() => {
                OptionsActions.activateShortLogin(this.state);
              }}
            >
              Activate
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideShortLogin}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(QRCodeShow);
