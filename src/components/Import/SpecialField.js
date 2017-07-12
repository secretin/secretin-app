import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/utilities/Input';

class SpecialField extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ value }) {
    const params = {
      name: this.props.name,
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
        label={this.props.name}
        name={this.props.name}
        value={this.props.value}
        onChange={this.handleChange}
        type="password"
      />
    );
  }
}

export default SpecialField;
