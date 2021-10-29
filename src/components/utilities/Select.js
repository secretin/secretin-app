import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqueId, noop } from 'lodash';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';

class Select extends Component {
  static propTypes = {
    name: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    size: PropTypes.string,
    actions: PropTypes.array,
  };

  static defaultProps = {
    disabled: false,
    size: 'base',
    onChange: noop,
    actions: [],
  };

  constructor(props) {
    super(props);

    this.id = uniqueId('input_');
  }

  onChange = ({ target }) => {
    this.props.onChange({
      name: this.props.name,
      value: target.value,
    });
  };

  getValue = () => this.select.value;

  render() {
    const className = classNames(
      'input',
      'input--type-select',
      `input--size-${this.props.size}`
    );

    return (
      <div className={className}>
        {this.props.label && (
          <label htmlFor={this.id}>
            {this.props.label}
            {this.props.actions.size > 0 && (
              <span className="input-label-actions">{this.props.actions}</span>
            )}
          </label>
        )}
        <div className="input--type-select--input">
          <select
            ref={ref => {
              this.select = ref;
            }}
            value={this.props.value}
            disabled={this.props.disabled}
            title={this.props.title}
            onChange={this.onChange}
          >
            {this.props.options.map(option => (
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            ))}
          </select>
          <Icon id="arrow-down" />
        </div>
      </div>
    );
  }
}

export default Select;
