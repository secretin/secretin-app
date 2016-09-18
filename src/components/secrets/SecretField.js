import React, { Component, PropTypes } from 'react';

import SecretFieldRecord from 'models/SecretFieldRecord';

import Input from 'components/utilities/Input';

class SecretField extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(SecretFieldRecord),
    showCopy: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    showCopy: false,
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.onToggleShow = this.onToggleShow.bind(this);
  }

  onToggleShow() {
    this.setState({
      showContent: !this.state.showContent,
    });
  }

  onToggleEdit() {
    this.setState({
      editContent: !this.state.editContent,
    });
  }

  handleChange({ value }) {
    this.props.onChange({
      field: this.props.field,
      value,
    });
  }

  render() {
    return (
      <div className="secret-field">
        <Input
          label={this.props.field.label}
          name={this.props.field.label}
          value={this.props.field.content}
          type={this.props.field.type}
          onChange={this.handleChange}
          showCopy={this.props.showCopy}
          readOnly={!this.props.onChange}
        />
      </div>
    );
  }
}

export default SecretField;
