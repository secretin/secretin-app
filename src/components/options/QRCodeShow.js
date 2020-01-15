import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Secretin from 'secretin';
import QRCode from 'qrcode.react';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';

import Form from 'components/utilities/Form';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';

class QRCodeShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    shown: false,
    errors: new Immutable.Map(),
    loading: false,
  };

  static getStores() {
    return [OptionsStore];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getState();
    return {
      errors: state.get('errors'),
      shown: state.get('showQRCode'),
      loading: state.get('loading'),
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.shown) {
      return {
        seed: Secretin.Utils.generateSeed(),
        token: '',
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      seed: Secretin.Utils.generateSeed(),
      token: '',
    };
  }

  handleChange(e) {
    const token = e.value.replace(/\s+/g, '').slice(0, 6);

    this.setState({
      token,
    });
  }

  handleSubmit() {
    OptionsActions.activateTotp(this.state);
  }

  render() {
    return (
      <Modal show={this.props.shown} onClose={OptionsActions.hideQRCode}>
        <Modal.Header>
          <span className="text">Activate Two-Factor authentication</span>
        </Modal.Header>

        <Modal.Body>
          <Form className="totp-form" id="totp" onSubmit={this.handleSubmit}>
            <div className="totp-form-qrcode">
              <QRCode
                className="totp-form-qrcode"
                value={`otpauth://totp/Secret-in.me?secret=${this.state.seed.b32}`}
                size={256}
              />
            </div>
            <Input
              name="token"
              inputProps={{
                maxLength: 6,
              }}
              placeholder="6-digit code"
              value={this.state.token}
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              error={this.props.errors.get('totp')}
              autoFocus
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideQRCode}
          >
            Close
          </Button>
          <Button
            type="button"
            buttonStyle="primary"
            onClick={this.handleSubmit}
            disabled={this.props.loading}
          >
            Activate
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(QRCodeShow);
