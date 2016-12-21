import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';

import SecretField from 'components/secrets/SecretField';

class SecretFields extends Component {
  static propTypes = {
    fields: PropTypes.instanceOf(Immutable.List),
    showCopy: PropTypes.bool,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    showCopy: false,
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
              showCopy={this.props.showCopy}
              onChange={this.props.onChange}
              onSubmit={this.props.onSubmit}
            />
          )
        }
      </div>
    );
  }
}

export default SecretFields;
