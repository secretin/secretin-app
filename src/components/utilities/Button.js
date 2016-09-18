import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class Button extends Component {
  static propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    form: PropTypes.string,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    buttonStyle: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    type: 'button',
    size: 'base',
    form: null,
    buttonStyle: 'primary',
    onClick: () => ({}),
    disabled: false,
  }

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.props.disabled) {
      this.props.onClick();
    }
  }

  render() {
    const className = classNames(
      'button',
      `button--style-${this.props.buttonStyle}`,
      `button--size-${this.props.size}`,
    );

    return (
      <button
        className={className}
        name={this.props.name}
        type={this.props.type}
        form={this.props.form}
        onClick={this.handleClick}
        disabled={this.props.disabled}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
