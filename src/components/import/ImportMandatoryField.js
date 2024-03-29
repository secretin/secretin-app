import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/utilities/Input';

class ImportMandatoryField extends Component {
  static propTypes = {
    field: PropTypes.object,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ value }) {
    const params = {
      field: this.props.field,
      value,
    };

    this.props.onChange(params);
  }

  render() {
    return (
      <Input
        ref={ref => {
          this.input = ref;
        }}
        label={this.props.field.name}
        name={this.props.field.name}
        value={this.props.field.value}
        onChange={this.handleChange}
        type={this.props.field.type}
      />
    );
  }
}

export default ImportMandatoryField;
