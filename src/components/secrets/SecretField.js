import React, { Component } from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';
import { Utils } from 'secretin';
import { injectIntl, FormattedMessage } from 'react-intl';

import Dropdown from 'components/utilities/Dropdown';
import Input from 'components/utilities/Input';
import Icon from 'components/utilities/Icon';

class SecretField extends Component {
  static propTypes = {
    field: PropTypes.object,
    onChange: PropTypes.func,
    isNew: PropTypes.bool,
    canUpdate: PropTypes.bool,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onCopy = this.onCopy.bind(this);
    this.onGenerate = this.onGenerate.bind(this);
    this.onGenerateAlphanum = this.onGenerateAlphanum.bind(this);
    this.onGeneratePronounceable = this.onGeneratePronounceable.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onCopy() {
    copyToClipboard(this.props.field.content, { debug: true });
  }

  onGenerate() {
    this.handleChange({
      value: Utils.PasswordGenerator.generatePassword(),
    });
  }

  onGenerateAlphanum() {
    this.handleChange({
      value: Utils.PasswordGenerator.generatePassword({
        contentRules: {
          numbers: true,
          mixedCase: true,
          symbols: false,
        },
      }),
    });
  }

  onGeneratePronounceable() {
    this.handleChange({
      value: Utils.PasswordGenerator.generatePassword({
        readable: true,
      }),
    });
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
            <FormattedMessage id="Open" />
          </a>
        );
      }
    }

    actions.push(
      <a key="copy" onClick={this.onCopy} tabIndex="-1">
        <FormattedMessage id="Copy" />
      </a>
    );

    return (
      <div className="secret-field">
        <Input
          ref={ref => {
            this.input = ref;
          }}
          label={this.props.intl.formatMessage({ id: this.props.field.label })}
          name={this.props.field.label}
          value={this.props.field.content}
          onChange={this.handleChange}
          type={this.props.field.type}
          readOnly={!this.props.canUpdate}
          actions={actions}
        />
        <div className="secret-field-action">
          {this.props.field.type === 'password' && this.props.canUpdate && (
            <Dropdown id="password-generation-options" pullRight>
              <Dropdown.Toggle>
                <Icon id="generate" size="small" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onSelect={this.onGenerate}>
                  <FormattedMessage id="Generate strong" />
                </Dropdown.Item>
                <Dropdown.Item onSelect={this.onGenerateAlphanum}>
                  <FormattedMessage id="Generate alphanumeric" />
                </Dropdown.Item>
                <Dropdown.Item onSelect={this.onGeneratePronounceable}>
                  <FormattedMessage id="Generate pronounceable" />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }
}

export default injectIntl(SecretField);
