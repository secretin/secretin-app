import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line
import Secretin from 'secretin';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import AppUIActions from 'actions/AppUIActions';

class QRCodeShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    hide: PropTypes.func,
    error: PropTypes.string,
  };

  static defaultProps = {
    shown: false,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      shortpass: '',
    };
  }

  handleChange(e) {
    this.setState({
      shortpass: e.value,
    });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={this.props.hide}
      >
        <Modal.Header>
          <span className="text" title="Shortpass quick connection">
            Shortpass
          </span>
        </Modal.Header>

        <Modal.Body>
          <div style={{ textAlign: 'center' }}>
            <Input
              label="Shortpass"
              name="shortpass"
              value={this.state.shortpass}
              type="password"
              onChange={this.handleChange}
              error={this.props.error}
            />
            <Button
              type="button"
              buttonStyle="default"
              onClick={() => {
                AppUIActions.shortLogin({ shortpass: this.state.shortpass });
              }}
            >
              Connect
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={this.props.hide}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default QRCodeShow;
