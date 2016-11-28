import React, { Component, PropTypes } from 'react';
import { isEmpty } from 'lodash';
import Immutable from 'immutable';

import AppUIActions from 'actions/AppUIActions';

import Form from 'components/utilities/Form';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

class UserConnect extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    errors: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      username: '',
      password: '',
    };
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    AppUIActions.loginUser({
      username: this.state.username,
      password: this.state.password,
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

          <Button
            type="submit"
            disabled={
              this.props.loading ||
              isEmpty(this.state.username) ||
              isEmpty(this.state.password)
            }
          >
            Login
          </Button>
        </Form>
      </div>
    );
  }
}

export default UserConnect;
