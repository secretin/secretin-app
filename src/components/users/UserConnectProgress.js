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
      Math.floor(nextStatus.state / 100) !==
        Math.floor(currentStatus.state / 100)
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
    const width = `${Math.round(state / total * 100)}%`;
    const style = { width };
    return (
      <div className="user-connect-progress">
        <div className="user-connect-progress-bar" style={style} />
        <div className="user-connect-progress-text">
          {this.state.message}
        </div>
        <div className="user-connect-progress-title">
          {width}
        </div>
      </div>
    );
  }
}

export default UserConnectProgress;
