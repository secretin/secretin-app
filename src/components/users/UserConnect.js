import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import secretin from 'utils/secretin';

import * as AppUIActions from 'stores/AppUISlice';

import UserConnectForm from './UserConnectForm';
import UserConnectShortPass from './UserConnectShortPass';

class UserConnect extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    errors: PropTypes.object,
    status: PropTypes.shape({
      message: PropTypes.string,
      state: PropTypes.number,
      total: PropTypes.number,
    }),
    dispatch: PropTypes.func,
  };

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

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    if (this.state.signup) {
      this.props.dispatch(
        AppUIActions.createUser({
          username: this.state.username,
          password: this.state.password,
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
      showShortpass: false,
    });
  }

  render() {
    const { savedUsername, loading, errors } = this.props;

    return (
      <div className="user-connect">
        {this.state.showShortpass ? (
          <UserConnectShortPass
            savedUsername={savedUsername}
            loading={loading}
            error={errors.shortlogin}
            onCancel={this.hideShortpass}
          />
        ) : (
          <UserConnectForm loading={loading} errors={errors} />
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(UserConnect);
