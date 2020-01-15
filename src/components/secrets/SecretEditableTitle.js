import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MetadataActions from 'actions/MetadataActions';
import Secret from 'models/Secret';

class SecretEditableTitle extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    canUpdate: PropTypes.bool,
    isUpdating: PropTypes.bool,
  };

  static getDerivedStateFromProps(nextProps) {
    const {
      secret: { title: nextTitle },
    } = nextProps;
    const {
      secret: { title: currentTitle },
    } = this.props;

    if (currentTitle !== nextTitle) {
      return { title: nextTitle };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      title: props.secret.title,
    };
  }

  handleSubmit = ({ target }) => {
    if (target.value !== this.props.secret.title) {
      setTimeout(() => {
        MetadataActions.renameSecret({
          secret: this.props.secret,
          newTitle: target.value,
        });
      });
    }
  };

  handleKeyDown = ({ key, target }) => {
    if (key === 'Enter') {
      target.blur();
    }
  };

  handleChange = ({ target }) => {
    this.setState({ title: target.value });
  };

  render() {
    const { canUpdate, isUpdating } = this.props;
    const { title } = this.state;

    return (
      <input
        className="secret-editable-title"
        type="text"
        value={title}
        onBlur={this.handleSubmit}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        readOnly={!canUpdate || isUpdating}
        size={title.length + 1}
      />
    );
  }
}

export default SecretEditableTitle;
