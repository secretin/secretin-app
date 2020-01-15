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

  constructor(props) {
    super(props);

    this.state = {
      title: props.secret.title,
    };
  }

  componentWillReceiveProps({ secret: { title: nextTitle } }) {
    const {
      secret: { title: currentTitle },
    } = this.props;

    if (currentTitle !== nextTitle) {
      this.setState({ title: nextTitle });
    }
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
