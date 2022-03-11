import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

class Input extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    // eslint-disable-next-line react/forbid-prop-types
    value: PropTypes.any,
    title: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,

    autoFocus: PropTypes.bool,
    autoSelect: PropTypes.bool,
    autoComplete: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    actions: PropTypes.array,
    size: PropTypes.string,
    inputProps: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      step: PropTypes.number,
    }),
    debounce: PropTypes.number,
  };

  static defaultProps = {
    type: 'text',
    value: '',
    autoFocus: false,
    autoSelect: false,
    autoComplete: false,
    disabled: false,
    readOnly: false,
    actions: [],
    size: 'base',
    debounce: 0,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onTogglePasswordShow = this.onTogglePasswordShow.bind(this);
    this.id = uniqueId(`${this.props.name}_input_`);
    this.state = {
      showPassword: false,
    };
  }

  componentDidMount() {
    if (this.props.autoSelect) {
      setTimeout(() => this.input.select(), 0);
    }
    if (this.props.autoFocus) {
      setTimeout(() => this.input.focus(), 0);
    }
  }

  onTogglePasswordShow() {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  handleChange(event) {
    this.props.onChange({
      name: this.props.name,
      value: event.target.value,
    });
  }

  select() {
    this.input.select();
  }

  render() {
    const className = classNames(
      'input',
      `input--type-${this.props.type}`,
      `input--size-${this.props.size}`,
      {
        'input--error': this.props.error,
      }
    );

    const {
      type,
      title,
      autoComplete,
      autoFocus,
      disabled,
      error,
      label,
      placeholder,
      readOnly,
      actions,
      inputProps,
    } = this.props;

    return (
      <div className={className}>
        {label && (
          <label htmlFor={this.id}>
            {label}
            {actions.length > 0 && (
              <span className="input-label-actions">{actions}</span>
            )}
          </label>
        )}

        <div className="input--wrapper">
          <input
            id={this.id}
            ref={input => {
              this.input = input;
            }}
            name={this.id}
            title={title}
            type={
              type === 'password' && this.state.showPassword ? 'text' : type
            }
            value={this.props.value}
            onChange={this.handleChange}
            placeholder={placeholder}
            autoComplete={autoComplete ? null : 'new-password'}
            autoFocus={autoFocus}
            disabled={disabled}
            readOnly={readOnly}
            {...inputProps}
          />
          {type === 'password' && (
            <div className="input--password-show">
              <Button
                title="Show"
                buttonStyle="icon"
                onClick={this.onTogglePasswordShow}
                tabIndex="-1"
              >
                <Icon
                  id={this.state.showPassword ? 'show' : 'hide'}
                  size="small"
                />
              </Button>
            </div>
          )}
        </div>
        {error && <span className="input-error">{error}</span>}
      </div>
    );
  }
}

export default Input;
