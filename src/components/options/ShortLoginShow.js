import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line
import Secretin from 'secretin';
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
    loading: PropTypes.bool,
  };

  static defaultProps = {
    shown: false,
    errors: new Immutable.Map(),
    loading: false,
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
      loading: state.get('loading'),
    };
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      shortpass: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.shown) {
      this.setState({
        shortpass: '',
      });
    }
  }

  handleChange({ name, value }) {
    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    OptionsActions.activateShortLogin({
      shortpass: this.state.shortpass,
    });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={OptionsActions.hideShortLogin}
      >
        <Modal.Header>
          <span className="text">
            Trust this device
          </span>
        </Modal.Header>

        <Modal.Body>
          <Form
            className="totp-form"
            id="totp"
            onSubmit={this.handleSubmit}
          >
            <Input
              label="Shortpass"
              name="shortpass"
              value={this.state.shortpass}
              type="password"
              onChange={this.handleChange}
              autoFocus
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideShortLogin}
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
