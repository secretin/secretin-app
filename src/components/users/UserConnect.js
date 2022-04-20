import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import secretin from 'utils/secretin';

import * as AppUIActions from 'slices/AppUISlice';

import UserConnectForm from './UserConnectForm';
import UserConnectShortPass from './UserConnectShortPass';
import moment from 'moment';

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
    showShortpass: PropTypes.bool,
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

  render() {
    const { savedUsername, loading, errors, showShortpass } = this.props;
    const shortLoginActivationDate = secretin.getShortLoginActivationDate();
    const shortLoginExpired = shortLoginActivationDate
      ? moment(shortLoginActivationDate)
          .add(7, 'days')
          .isBefore(moment())
      : false;

    return (
      <div className="user-connect">
        {showShortpass && !shortLoginExpired ? (
          <UserConnectShortPass
            savedUsername={savedUsername}
            loading={loading}
            error={errors.shortlogin}
          />
        ) : (
          <UserConnectForm
            loading={loading}
            savedUsername={savedUsername ? savedUsername : ''}
            errors={{
              ...errors,
              ...(shortLoginActivationDate && shortLoginExpired
                ? {
                    shortLoginExpired: {
                      message: `Your shortpass has expired `,
                      info: `Previous shortpass will automatically reactivate for your account ${savedUsername} if you sign-in.`,
                    },
                  }
                : {}),
            }}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { showShortpass, status } = state.AppUI;
  return {
    showShortpass,
    status,
  };
};

export default connect(mapStateToProps)(UserConnect);
