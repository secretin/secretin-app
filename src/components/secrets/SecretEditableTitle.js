import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SecretEditableTitle extends Component {
  static propTypes = {
    title: PropTypes.string,
    canUpdate: PropTypes.bool,
    isUpdating: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.title,
    };
  }

  handleSubmit = () => this.props.onSubmit(this.state.title);

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
