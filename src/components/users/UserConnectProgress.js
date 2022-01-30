import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Statuses } from 'utils/secretin';
import { connect } from 'react-redux';

const { DecryptMetadataStatus } = Statuses;

class UserConnectProgress extends Component {
  static propTypes = {
    message: PropTypes.string,
    state: PropTypes.number,
    total: PropTypes.number,
  };

  static getDerivedStateFromProps({ message }) {
    const nextMessage =
      message instanceof DecryptMetadataStatus
        ? 'Updating your secrets...'
        : message;

    return {
      message: nextMessage,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      message: '',
    };
  }

  render() {
    const { state, total } = this.props;
    const width = `${Math.round((state / total) * 100)}%`;
    const style = { width };
    return (
      <div className="user-connect-progress">
        <div className="user-connect-progress-bar" style={style} />
        <div className="user-connect-progress-text">{this.state.message}</div>
        <div className="user-connect-progress-title">{width}</div>
      </div>
    );
  }
}

const mapStateToProps = _state => {
  const { message, state, total } = _state.AppUI.status;
  return {
    message,
    state,
    total,
  };
};

export default connect(mapStateToProps)(UserConnectProgress);
