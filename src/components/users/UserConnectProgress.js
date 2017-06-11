import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sample } from 'lodash';

import loadingMessages from 'utils/loadingMessages';

class UserConnectProgress extends Component {
  static propTypes = {
    status: PropTypes.shape({
      message: PropTypes.string,
      state: PropTypes.number,
      total: PropTypes.number,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      message: sample(loadingMessages),
    };
  }

  componentWillReceiveProps({ status: nextStatus }) {
    const { status: currentStatus } = this.props;

    if (
      nextStatus.message !== currentStatus.message ||
      Math.floor(nextStatus.state / 20) !== Math.floor(currentStatus.state / 20)
    ) {
      this.setState(state => {
        return {
          message: sample(loadingMessages),
        };
      });
    }
  }

  render() {
    const { state, total } = this.props.status;

    return (
      <div className="user-connect-progress">
        <div className="user-connect-progress-title">
          Please wait {`${Math.round(state / total * 100)}%`}
        </div>
        <div className="user-connect-progress-text">
          {this.state.message}
        </div>
      </div>
    );
  }
}

export default UserConnectProgress;
