import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import Input from 'components/utilities/Input';

class ImportMandatoryField extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Immutable.Map),
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
        label={this.props.field.get('name')}
        name={this.props.field.get('name')}
        value={this.props.field.get('value')}
        onChange={this.handleChange}
        type={this.props.field.get('type')}
      />
    );
  }
}

export default ImportMandatoryField;
