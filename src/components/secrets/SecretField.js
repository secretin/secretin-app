import React, { Component, PropTypes } from 'react';

import SecretFieldRecord from 'models/SecretFieldRecord';

import Input from 'components/utilities/Input';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

class SecretField extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(SecretFieldRecord),
    showCopy: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    showCopy: false,
  }

  constructor(props) {
    super(props);

    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
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

  handleChange({ value }) {
    this.setState({ value });
  }

  render() {
    return (
      <div className="secret-field">
        <Input
          ref={(ref) => { this.input = ref; }}
          label={this.props.field.label}
          name={this.props.field.label}
          value={this.state.value}
          onChange={this.handleChange}
          type={this.props.field.type}
          showCopy={this.props.showCopy}
          readOnly={!this.state.editContent}
        />

        <div className="secret-field-action">
          {
            !this.state.editContent && (
              <Button
                title="Edit"
                buttonStyle="icon"
                onClick={this.onEdit}
              >
                <Icon id="edit" size="small" />
              </Button>
            )
          }
          {
            this.state.editContent && (
              <Button
                title="Save"
                buttonStyle="icon"
                onClick={this.onSave}
              >
                <Icon id="save" size="small" />
              </Button>
            )
          }
        </div>
      </div>
    );
  }
}

export default SecretField;
