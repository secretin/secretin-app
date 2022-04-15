import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Statuses } from 'utils/secretin';
import { connect } from 'react-redux';

const { DecryptMetadataStatus } = Statuses;

class UserConnectProgress extends Component {
  static propTypes = {
    show: PropTypes.bool,
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
    if (!this.props.show) return null;
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
  const status = _state.AppUI.status;
  if (!status)
    return {
      show: false,
    };
  const { message, state, total } = _state.AppUI.status;
  return {
    show: true,
    message,
    state,
    total,
  };
};

export default connect(mapStateToProps)(UserConnectProgress);
