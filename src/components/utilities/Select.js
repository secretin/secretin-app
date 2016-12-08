import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';

class Select extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    title: PropTypes.string,
    options: PropTypes.instanceOf(Immutable.List),
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    size: PropTypes.string,
  }

  static defaultProps = {
    disabled: false,
    size: 'base',
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.id = uniqueId('input_');
  }

  onChange(e) {
    this.props.onChange({
      name: this.props.name,
      value: e.target.value,
    });
  }

  render() {
    const className = classNames(
      'input',
      'input--type-select',
      `input--size-${this.props.size}`
    );

    return (
      <div className={className}>
        <select
          value={this.props.value}
          disabled={this.props.disabled}
          title={this.props.title}
          onChange={this.onChange}
        >
          {
            this.props.options.map(option =>
              <option key={option[0]} value={option[0]}>
                {option[1]}
              </option>
            )
          }
        </select>
        <Icon id="arrow-down" />
      </div>
    );
  }
}

export default Select;
