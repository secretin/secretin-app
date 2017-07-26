import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Statuses } from 'utils/secretin';

const { DecryptMetadataStatus } = Statuses;

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
      message: '',
    };
  }

  componentWillReceiveProps({ status: nextStatus }) {
    const { status: currentStatus } = this.props;

    const nextMessage =
      nextStatus instanceof DecryptMetadataStatus
        ? 'Loading your secrets...'
        : nextStatus.message;

    if (nextMessage !== currentStatus.message) {
      this.setState({
        message: nextMessage,
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
