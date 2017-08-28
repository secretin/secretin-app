import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';

class ChangePasswordShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.string,
    newPass1: PropTypes.string,
    newPass2: PropTypes.string,
  };

  static defaultProps = {
    shown: false,
    loading: false,
    newPass1: '',
    newPass2: '',
    error: '',
  };

  static getStores() {
    return [OptionsStore];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getNewPass();

    return {
      errors: state.get('error'),
      shown: state.get('shown'),
      loading: state.get('loading'),
      newPass1: state.get('newPass1'),
      newPass2: state.get('newPass2'),
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      success: false,
    };
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleChangePassword() {
    OptionsActions.changePassword({
      newPass: this.props.newPass1,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading && !nextProps.loading && nextProps.error === '') {
      this.setState({
        success: true,
      });
      setTimeout(() => {
        this.setState({
          success: false,
        });
      }, 1000);
    }
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={OptionsActions.hideChangePassword}
      >
        <Modal.Header>
          <span className="text">Change master password</span>
        </Modal.Header>

        <Modal.Body>
          <Input
            name="newPass1"
            label="New password"
            value={this.props.newPass1}
            onChange={OptionsActions.changeNewPass1}
            type="password"
            disabled={this.props.loading}
          />
          {this.props.newPass1.length > 0 &&
            <Input
              name="newPass2"
              label="Retype"
              value={this.props.newPass2}
              onChange={OptionsActions.changeNewPass2}
              type="password"
              disabled={this.props.loading}
            />}
          {this.state.success && <div>Success</div>}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={OptionsActions.hideChangePassword}
          >
            Close
          </Button>
          {this.props.newPass1.length > 0 &&
            this.props.newPass1 === this.props.newPass2 &&
            <Button
              type="button"
              buttonStyle="primary"
              onClick={this.handleChangePassword}
              disabled={this.props.loading}
            >
              Change it
            </Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(ChangePasswordShow);
