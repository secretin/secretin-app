import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SecretField from 'components/secrets/SecretField';

class SecretFields extends Component {
  static propTypes = {
    fields: PropTypes.array,
    isNew: PropTypes.bool,
    onChange: PropTypes.func,
    canUpdate: PropTypes.bool,
  };

  render() {
    if (!this.props.fields) {
      return false;
    }

    return (
      <div className="secret-fields">
        {this.props.fields.map(field => (
          <SecretField
            key={field.id}
            field={field}
            onChange={this.props.onChange}
            isNew={this.props.isNew}
            canUpdate={this.props.canUpdate}
          />
        ))}
      </div>
    );
  }
}

export default SecretFields;
