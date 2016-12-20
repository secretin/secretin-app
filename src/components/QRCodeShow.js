import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line
import Secretin from 'secretin';
import QRCode from 'qrcode.react';
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
    isVerified: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  };

  static defaultProps = {
    shown: false,
    isVerified: false,
    errors: new Immutable.Map(),
  };

  static getStores() {
    return [
      OptionsStore,
    ];
  }

  static getPropsFromStores() {
    return {
      isVerified: OptionsStore.getState().get('totpIsVerified'),
      errors: OptionsStore.getState().get('errors'),
      shown: OptionsStore.getState().get('showQRCode'),
    };
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      seed: Secretin.Utils.generateSeed(),
      token: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.shown) {
      this.setState({
        seed: Secretin.Utils.generateSeed(),
        token: ''
      });
    }
  }

  handleChange(e) {
    this.setState({
      token: e.value,
    });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={OptionsActions.hideQRCode}
      >
        <Modal.Header>
          <Icon id="gear" size="small" />
          <span className="text" title="Register TOTP">
            Register TOTP
          </span>
        </Modal.Header>

        <Modal.Body>
          <div style={{ textAlign: 'center' }}>
            <QRCode size={256} value={`otpauth://totp/Secret-in.me?secret=${this.state.seed.b32}`} />
            {
              this.props.isVerified ?
                <Button
                  type="button"
                  buttonStyle="primary"
                  onClick={() => {
                    OptionsActions.activateTotp({ seed: this.state.seed });
                  }}
                >
                  Activate
                </Button>
              :
                <div>
                  <Input
                    label="TOTP token"
                    name="token"
                    value={this.state.token}
                    type="text"
                    onChange={this.handleChange}
                    readOnly={this.props.isVerified}
                    error={this.props.errors.get('totp')}
                  />
                  <Button
                    type="button"
                    buttonStyle="default"
                    onClick={() => {
                      OptionsActions.verifyTotp({ seed: this.state.seed, token: this.state.token });
                    }}
                  >
                    Verify
                  </Button>
                </div>
            }
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideQRCode}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(QRCodeShow);
