import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

class Form extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    autoComplete: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
  };

  static defaultProps = {
    disabled: false,
    autoComplete: false,
    onSubmit: () => ({}),
  };

  constructor(props) {
    super(props);

    this.id = props.id || uniqueId('form_');
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onSubmit();
    }
  }

  render() {
    const className = classNames('form', this.props.className);

    return (
      <form
        id={this.id}
        className={className}
        onSubmit={this.onSubmit}
        autoComplete={this.props.autoComplete ? null : 'new-password'}
      >
        {!this.props.autoComplete && [
          <input
            key="autofill_trap_email"
            name="autofill_trap_email"
            type="text"
            style={{ display: 'none' }}
          />,
          <input
            key="autofill_trap_password"
            name="autofill_trap_password"
            type="password"
            style={{ display: 'none' }}
          />,
        ]}
        <input type="submit" style={{ display: 'none' }} />
        {this.props.children}
      </form>
    );
  }
}

export default Form;
