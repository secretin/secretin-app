import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import copyToClipboard from 'copy-to-clipboard';
import { Utils } from 'secretin';

import SecretFieldRecord from 'models/SecretFieldRecord';

import Input from 'components/utilities/Input';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

class SecretField extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(SecretFieldRecord),
    onChange: PropTypes.func,
    isNew: PropTypes.bool,
    canUpdate: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onCopy = this.onCopy.bind(this);
    this.onGenerate = this.onGenerate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCopy() {
    copyToClipboard(this.props.field.content, { debug: true });
  }

  onGenerate() {
    this.handleChange({ value: '' });
    setTimeout(() => {
      this.handleChange({
        value: Utils.PasswordGenerator.generatePassword(),
      });
    }, 100);
  }

  handleChange({ value }) {
    const params = {
      field: this.props.field,
      value,
    };

    this.props.onChange(params);
  }

  render() {
    const actions = [];
    if (!this.props.isNew) {
      if (this.props.field.type === 'url') {
        actions.push(
          <a
            key="open"
            href={this.props.field.content}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex="-1"
          >
            Open
          </a>
        );
      }
    }

    actions.push(
      <a key="copy" onClick={this.onCopy} tabIndex="-1">
        Copy
      </a>
    );

    return (
      <div className="secret-field">
        <Input
          ref={ref => {
            this.input = ref;
          }}
          label={this.props.field.label}
          name={this.props.field.label}
          value={this.props.field.content}
          onChange={this.handleChange}
          type={this.props.field.type}
          readOnly={!this.props.canUpdate}
          actions={new Immutable.List(actions)}
        />
        <div className="secret-field-action">
          {this.props.field.type === 'password' && this.props.canUpdate && (
            <Button
              title="Generate password"
              buttonStyle="icon"
              onClick={this.onGenerate}
              tabIndex="-1"
            >
              <Icon id="generate" size="small" />
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default SecretField;
