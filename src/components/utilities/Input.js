import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import { uniqueId } from 'lodash';
import classNames from 'classnames';
import copyToClipboard from 'copy-to-clipboard';

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
    showCopy: PropTypes.bool,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,
    actions: PropTypes.instanceOf(Immutable.List),
    size: PropTypes.string,
  }

  static defaultProps = {
    type: 'text',
    value: '',
    autoFocus: false,
    autoSelect: false,
    showCopy: false,
    disabled: false,
    readOnly: false,
    actions: new Immutable.List(),
    size: 'base',
  }

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onTogglePasswordShow = this.onTogglePasswordShow.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.id = uniqueId(`${this.props.name}_input_`);
    this.state = {
      showPassword: false,
    };
  }

  componentDidMount() {
    if (this.props.autoSelect) {
      setTimeout(
        () => this.input.select(),
        0
      );
    }
  }

  onChange(e) {
    this.props.onChange({
      name: this.props.name,
      value: e.target.value,
    });
  }

  onTogglePasswordShow() {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }

  onCopy() {
    copyToClipboard(this.props.value, { debug: true });
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

    let actions = this.props.actions;
    if (this.props.type === 'password') {
      actions = actions.unshift(
        <a
          key="show"
          onClick={this.onTogglePasswordShow}
          tabIndex="-1"
        >
          {this.state.showPassword ? 'Hide' : 'Show'}
        </a>
      );
    } else if (this.props.type === 'url') {
      actions = actions.unshift(
        <a
          key="open"
          href={this.props.value}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex="-1"
        >
          Open
        </a>
      );
    }
    if (this.props.showCopy) {
      actions = actions.unshift(
        <a
          key="copy"
          onClick={this.onCopy}
          tabIndex="-1"
        >
          Copy
        </a>
      );
    }

    return (
      <div className={className}>
        {
          this.props.label && (
            <label htmlFor={this.id}>
              {this.props.label}
              {
                actions.size > 0 && (
                  <span className="input-label-actions">{actions}</span>
                )
              }
            </label>
          )
        }

        <input
          id={this.id}
          ref={(input) => { this.input = input; }}
          name={this.id}
          title={this.props.title}
          type={this.props.type === 'password' && this.state.showPassword ? 'text' : this.props.type}
          value={this.props.value}
          onChange={this.onChange}
          placeholder={this.props.placeholder}

          autoFocus={this.props.autoFocus}
          disabled={this.props.disabled}
          readOnly={this.props.readOnly}
        />
        {
          this.props.error && (
            <span className="input-error">
              { this.props.error }
            </span>
          )
        }
      </div>
    );
  }
}

export default Input;
