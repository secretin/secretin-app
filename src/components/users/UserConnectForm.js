import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import secretin from 'utils/secretin';

import * as AppUIActions from 'slices/AppUISlice';

import Form from 'components/utilities/Form';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

class UserConnectForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.object,
    isOnline: PropTypes.bool,
    dispatch: PropTypes.func,
    savedUsername: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      signup: false,
      username: props.savedUsername,
      password: '',
      confirmPassword: '',
      showShortpass: secretin.canITryShortLogin(),
    };
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.signup) {
      this.props.dispatch(
        AppUIActions.createUser({
          username: this.state.username,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword,
        })
      );
    } else {
      this.props.dispatch(
        AppUIActions.loginUser({
          username: this.state.username,
          password: this.state.password,
          token: this.state.token,
        })
      );
    }
  }

  toggleSignup(checked) {
    this.setState({
      signup: checked,
    });
  }

  handleChange({ name, value }) {
    this.setState({
      [name]: value,
    });
  }

  render() {
    const status = this.state.signup ? (
      <FormattedMessage id="Sign up" />
    ) : (
      <FormattedMessage id="Sign in" />
    );
    return (
      <Form
        className="user-connect-form"
        disabled={this.props.loading}
        onSubmit={this.onSubmit}
      >
        <h2
          className="user-connect-title"
          title={this.props.isOnline && secretin.api.db}
        >
          <img
            src="/logo.svg"
            style={{ width: '70%' }}
            alt="logo"
            title={this.props.isOnline ? 'Secret-In.me' : 'Offline'}
          />
        </h2>
        <Input
          name="username"
          label={<FormattedMessage id="login" />}
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
          disabled={this.props.loading}
          error={this.props.errors.username}
          autoFocus={this.props.savedUsername === ''}
          autoComplete
        />
        <Input
          name="password"
          label={<FormattedMessage id="password" />}
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          disabled={this.props.loading}
          error={this.props.errors.password}
          autoFocus={this.props.savedUsername !== ''}
        />
        {this.props.errors.totp && (
          <Input
            name="token"
            label="Token"
            type="text"
            value={this.state.token}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.token}
            autoFocus
          />
        )}
        {this.state.signup && (
          <Input
            name="confirmPassword"
            label={<FormattedMessage id="confirmPassword" />}
            type="password"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.confirmPassword}
          />
        )}

        {this.props.errors.shortLoginExpired && (
          <h3 className="tooltip">
            {this.props.errors.shortLoginExpired.message}
            <Icon id="info" size={13} />
            <span className="tooltiptext">
              {this.props.errors.shortLoginExpired.info}
            </span>
          </h3>
        )}

        <Button
          type="submit"
          disabled={
            this.props.loading ||
            isEmpty(this.state.username) ||
            isEmpty(this.state.password)
          }
        >
          {status}
        </Button>
        <div className="user-connect-create">
          <span>
            {this.state.signup ? (
              <span>
                <FormattedMessage id="alreadyHaveAccount" />
                ,&nbsp;
                <a
                  onClick={() => {
                    this.toggleSignup(!this.state.signup);
                  }}
                  tabIndex="-1"
                >
                  <FormattedMessage id="SignInSubtext" />
                </a>
              </span>
            ) : (
              <span>
                <FormattedMessage id="dontHaveAccount" />
                ,&nbsp;
                <a
                  onClick={() => {
                    this.toggleSignup(!this.state.signup);
                  }}
                  tabIndex="-1"
                >
                  <FormattedMessage id="SignUpSubtext" />
                </a>
              </span>
            )}
          </span>
        </div>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { online } = state.AppUI;
  return {
    isOnline: online,
  };
};

export default connect(mapStateToProps)(UserConnectForm);
