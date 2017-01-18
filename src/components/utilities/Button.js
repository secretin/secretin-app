import React, { Component, PropTypes } from 'react';
import Link from 'react-router/Link';
import classNames from 'classnames';

class Button extends Component {
  static propTypes = {
    name: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    form: PropTypes.string,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    buttonStyle: PropTypes.oneOf([
      'default',
      'primary',
      'icon',
    ]),
    to: PropTypes.string,
    onClick: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    tabIndex: PropTypes.string,
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

    if (this.props.to) {
      return (
        <Link
          className={className}
          title={this.props.title}
          onClick={this.handleClick}
          to={this.props.to}
          disabled={this.props.disabled}
        >
          {this.props.children}
        </Link>
      );
    }

    return (
      <button
        className={className}
        name={this.props.name}
        title={this.props.title}
        type={this.props.type}
        form={this.props.form}
        onClick={this.handleClick}
        disabled={this.props.disabled}
        tabIndex={this.props.tabIndex}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
