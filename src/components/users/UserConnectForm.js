import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import secretin from 'utils/secretin';

import * as AppUIActions from 'stores/AppUISlice';

import Form from 'components/utilities/Form';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

class UserConnectForm extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.object,
    isOnline: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      signup: false,
      username: '',
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
    const status = this.state.signup ? 'Sign up' : 'Sign in';
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
          Secret-in.me
          <small>{status}</small>
        </h2>

        <Input
          name="username"
          label="Username"
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
          disabled={this.props.loading}
          error={this.props.errors.get('username')}
          autoFocus
          autoComplete
        />
        <Input
          name="password"
          label="Password"
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          disabled={this.props.loading}
          error={this.props.errors.get('password')}
          autoComplete
        />
        {this.props.errors.get('totp') && (
          <Input
            name="token"
            label="Token"
            type="text"
            value={this.state.token}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.get('token')}
            autoFocus
          />
        )}
        {this.state.signup && (
          <Input
            name="confirmPassword"
            label="Confirm password"
            type="password"
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.get('confirmPassword')}
          />
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
                I already have an account,&nbsp;
                <a
                  onClick={() => {
                    this.toggleSignup(!this.state.signup);
                  }}
                  tabIndex="-1"
                >
                  sign in
                </a>
              </span>
            ) : (
              <span>
                I don&apos;t have an account,&nbsp;
                <a
                  onClick={() => {
                    this.toggleSignup(!this.state.signup);
                  }}
                  tabIndex="-1"
                >
                  create one
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
  // TODO : implement corresponding selectors
  // const secrets = MetadataStore.getSecretsInFolder();
  // const options = OptionsStore.getOptions();
  return {
    isOnline: online,
  };
};

export default connect(mapStateToProps)(UserConnectForm);
