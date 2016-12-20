import React, { Component, PropTypes } from 'react';
import { isEmpty } from 'lodash';
import Immutable from 'immutable';

import AppUIActions from 'actions/AppUIActions';

import Form from 'components/utilities/Form';
import Input from 'components/utilities/Input';
import Checkbox from 'components/utilities/Checkbox';
import Button from 'components/utilities/Button';

class UserConnect extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      signup: false,
      username: '',
      password: '',
    };
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.signup) {
      AppUIActions.createUser({
        username: this.state.username,
        password: this.state.password,
      });
    } else {
      AppUIActions.loginUser({
        username: this.state.username,
        password: this.state.password,
        token: this.state.token,
      });
    }
  }

  toggleSignup({ checked }) {
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
    return (
      <div className="user-connect">
        <h2 className="user-connect-title">
          Secret-in.me
          <small>
            { this.state.signup ? 'Register' : 'Connect' }
          </small>
        </h2>
        <Form
          className="user-connect-form"
          disabled={this.props.loading}
          onSubmit={this.onSubmit}
        >
          <Input
            name="username"
            label="Username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.get('username')}
            autoFocus
          />
          <Input
            name="password"
            label="Password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            disabled={this.props.loading}
            error={this.props.errors.get('password')}
          />
          {
            this.props.errors.get('totp') ?
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
            :
              <span />
          }

          <Checkbox
            checked={this.state.signup}
            onChange={this.toggleSignup}
          >
            Create an account
          </Checkbox>

          <Button
            type="submit"
            disabled={
              this.props.loading ||
              isEmpty(this.state.username) ||
              isEmpty(this.state.password)
            }
          >
            { this.state.signup ? 'Register' : 'Connect' }
          </Button>
        </Form>
      </div>
    );
  }
}

export default UserConnect;
