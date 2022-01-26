import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';

import * as OptionsActions from 'slices/OptionsSlice';

class ChangePasswordShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    loading: PropTypes.bool,
    status: PropTypes.oneOf(['initial', 'success', 'failure']),
    error: PropTypes.string,
    newPass1: PropTypes.string,
    newPass2: PropTypes.string,
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    shown: false,
    loading: false,
    newPass1: '',
    newPass2: '',
    error: '',
  };

  constructor(props) {
    super(props);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleChangePassword() {
    this.props.dispatch(
      OptionsActions.changePassword({
        newPass: this.props.newPass1,
      })
    );
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={() => this.props.dispatch(OptionsActions.hideChangePassword())}
      >
        <Modal.Header>
          <span className="text">Change master password</span>
        </Modal.Header>

        {this.props.status !== 'success' ? (
          <Modal.Body>
            <Input
              name="newPass1"
              label="New password"
              value={this.props.newPass1}
              onChange={(...args) =>
                this.props.dispatch(OptionsActions.changeNewPass1(...args))
              }
              type="password"
              disabled={this.props.loading}
            />
            {this.props.newPass1.length > 0 && (
              <span className="options-changepassword">
                <Input
                  name="newPass2"
                  label="Retype"
                  value={this.props.newPass2}
                  onChange={(...args) =>
                    this.props.dispatch(OptionsActions.changeNewPass2(...args))
                  }
                  type="password"
                  disabled={this.props.loading}
                />
              </span>
            )}
            <div className="options-changepassword-infos">
              {this.props.error === '' &&
                this.props.newPass1.length > 0 &&
                this.props.newPass1 !== this.props.newPass2 &&
                'Passwords mismatch'}
              {this.props.error !== '' && this.props.error}
            </div>
          </Modal.Body>
        ) : (
          <Modal.Body>
            <div className="options-changepassword-success">Success</div>
          </Modal.Body>
        )}

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={() =>
              this.props.dispatch(OptionsActions.hideChangePassword())
            }
          >
            Close
          </Button>
          {this.props.newPass1.length > 0 && (
            <Button
              type="button"
              buttonStyle="primary"
              onClick={this.handleChangePassword}
              disabled={this.props.newPass1 !== this.props.newPass2}
            >
              Change it
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  const {
    error,
    shown,
    loading,
    status,
    newPass1,
    newPass2,
  } = state.Options.newPass;
  return {
    error,
    shown,
    loading,
    status,
    newPass1,
    newPass2,
  };
};

export default connect(mapStateToProps)(ChangePasswordShow);
