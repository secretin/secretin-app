import React, { Component, PropTypes } from 'react';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    checked: false,
    disabled: false,
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.id = uniqueId('input_');
  }

  onChange(e) {
    this.props.onChange({
      name: this.props.name,
      checked: e.target.checked,
    });
  }

  render() {
    const checboxClassName = classNames(
      'checkbox',
      {
        'checkbox--checked': this.props.checked,
        'checkbox--unchecked': !this.props.checked,
      }
    );

    return (
      <div className="input input--type-checkbox">
        <input
          id={this.id}
          type="checkbox"
          name={this.props.name}
          checked={this.props.checked}
          disabled={this.props.disabled}
          onChange={this.onChange}
        />
        <label htmlFor={this.id}>
          <div className={checboxClassName} />
          {this.props.children}
        </label>
      </div>
    );
  }
}

export default Checkbox;
