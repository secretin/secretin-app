import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import secretin from 'utils/secretin';

import AppUIActions from 'actions/AppUIActions';

import UserConnectForm from 'components/users/UserConnectForm';
import UserConnectShortPass from 'components/users/UserConnectShortPass';

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
    this.hideShortpass = this.hideShortpass.bind(this);

    this.state = {
      signup: false,
      username: '',
      password: '',
      showShortpass: secretin.canITryShortLogin(),
    };
  }

  componentWillReceiveProps() {
    this.setState({
      showShortpass: secretin.canITryShortLogin(),
    });
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

  hideShortpass() {
    this.setState({
      showShortpass: false
    });
  }

  render() {
    return (
      <div className="user-connect">
        {
          this.state.showShortpass ? (
            <UserConnectShortPass
              loading={this.props.loading}
              error={this.props.errors.get('shortlogin')}
              onCancel={this.hideShortpass}
            />
          ) : (
            <UserConnectForm
              loading={this.props.loading}
              errors={this.props.errors}
            />
          )
        }
      </div>
    );
  }
}

export default UserConnect;
