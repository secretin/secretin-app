import React, { Component } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import PropTypes from 'prop-types';

import Form from 'components/utilities/Form';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import * as OptionsActions from 'slices/OptionsSlice';

class ShortLoginShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    loading: PropTypes.bool,
    actions: PropTypes.object,
  };

  static defaultProps = {
    shown: false,
    errors: {},
    loading: false,
  };

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.shown) {
      return {
        shortpass: '',
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      shortpass: '',
    };
  }

  handleChange({ name, value }) {
    this.setState({
      [name]: value,
    });
  }

  handleSubmit() {
    this.props.actions.activateShortLogin({
      shortpass: this.state.shortpass,
    });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={this.props.actions.hideShortLogin}
      >
        <Modal.Header>
          <span className="text">Trust this device</span>
        </Modal.Header>

        <Modal.Body>
          <Form className="totp-form" id="totp" onSubmit={this.handleSubmit}>
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
            onClick={this.props.actions.hideShortLogin}
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

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(OptionsActions, dispatch),
});

const mapStateToProps = state => {
  const { errors, showShortLogin, loading } = state.Options;
  return {
    errors,
    shown: showShortLogin,
    loading,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShortLoginShow);
