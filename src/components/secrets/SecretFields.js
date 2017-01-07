import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import SecretField from 'components/secrets/SecretField';

class SecretFields extends Component {
  static propTypes = {
    fields: PropTypes.instanceOf(Immutable.List),
    isNew: PropTypes.bool,
    onChange: React.PropTypes.func,
    canUpdate: PropTypes.bool,
  }

  render() {
    if (!this.props.fields) {
      return false;
    }

    return (
      <div className="secret-fields">
        {
          this.props.fields.map(field =>
            <SecretField
              key={field.id}
              field={field}
              onChange={this.props.onChange}
              isNew={this.props.isNew}
              canUpdate={this.props.canUpdate}
            />
          )
        }
      </div>
    );
  }
}

export default SecretFields;
