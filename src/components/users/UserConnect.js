import React, { Component, PropTypes } from 'react';

import AppUIActions from 'actions/AppUIActions';

import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

class UserConnect extends Component {

  static propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      username: 'Charley',
      password: 'test',
    };
  }

  componentDidMount() {
    if (this.state.username && this.state.password) {
      this.onSubmit();
    }
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
      <form
        disabled={this.props.loading}
        onSubmit={this.onSubmit}
      >
        <Input
          name="username"
          type="text"
          value={this.state.username}
          onChange={this.handleChange}
          autoFocus
          disabled={this.props.loading}
          placeholder="Username"
        />
        <Input
          name="password"
          type="password"
          value={this.state.password}
          onChange={this.handleChange}
          disabled={this.props.loading}
          placeholder="Password"
        />

        {
          this.props.error && (
            <div>
              Invalid username or password
            </div>
          )
        }

        <Button
          type="submit"
          disabled={this.props.loading}
        >
          Login
        </Button>
      </form>
    );
  }
}

export default UserConnect;
