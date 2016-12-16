import React, { Component, PropTypes } from 'react';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

class Form extends Component {
  static propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    disabled: false,
    onSubmit: () => ({}),
  }

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
    const className = classNames(
      'form',
      this.props.className
    );

    return (
      <form
        id={this.id}
        className={className}
        onSubmit={this.onSubmit}
      >
        <input type="submit" style={{ display: 'none' }} />
        {this.props.children}
      </form>
    );
  }
}

export default Form;
