import React, { Component, PropTypes } from 'react';
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
    canUpdate: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onGenerate = this.onGenerate.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: props.field.content,
      editContent: false,
    };
  }

  onEdit() {
    this.setState(
      { editContent: true },
      this.input.select
    );
  }

  onSave() {
    this.props.onSubmit({
      field: this.props.field.set('content', this.state.value),
    });

    this.setState({
      editContent: false,
    });
  }

  onCopy() {
    copyToClipboard(this.state.value, { debug: true });
  }

  onGenerate() {
    this.setState({
      value: '',
    });
    setTimeout(() => {
      this.setState({
        value: Utils.PasswordGenerator.generatePassword()
      });
    }, 300);
  }

  handleChange({ value }) {
    const params = {
      field: this.props.field,
      value,
    };

    if (this.props.onChange) {
      this.props.onChange(params);
    }
    this.setState(params);
  }

  render() {
    const actions = [];
    if (this.props.canUpdate) {
      actions.push(
        <a
          key="edit"
          onClick={this.state.editContent ? this.onSave : this.onEdit}
          tabIndex="-1"
        >
          {this.state.editContent ? 'Save' : 'Edit'}
        </a>
      );
    }

    return (
      <div className="secret-field">
        <Input
          ref={(ref) => { this.input = ref; }}
          label={this.props.field.label}
          name={this.props.field.label}
          value={this.state.value}
          onChange={this.handleChange}
          type={this.props.field.type}
          readOnly={!this.state.editContent && !this.props.onChange}
          actions={new Immutable.List(actions)}
        />

        {
          !this.props.onChange && (
            <div className="secret-field-action">
              {
                this.state.editContent ? (
                  <div>
                    {
                      this.props.field.type === 'password' && (
                        <Button
                          title="Generate password"
                          buttonStyle="icon"
                          onClick={this.onGenerate}
                        >
                          <Icon id="generate" size="small" />
                        </Button>
                      )
                    }
                  </div>
                )
                :
                (
                  <Button
                    title="Copy"
                    buttonStyle="icon"
                    onClick={this.onCopy}
                  >
                    <Icon id="copy" size="small" />
                  </Button>
                )
              }
            </div>
          )
        }
      </div>
    );
  }
}

export default SecretField;
