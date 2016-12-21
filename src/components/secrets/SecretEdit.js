import React, { Component, PropTypes } from 'react';

import Secret from 'models/Secret';

import SecretFields from 'components/secrets/SecretFields';

import MetadataActions from 'actions/MetadataActions';

class SecretEdit extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ field }) {
    const newSecret = this.props.secret.updateIn(['data', 'fields'], (fields) => {
      const index = fields.findIndex(
        fieldToUpdate => fieldToUpdate.id === field.id
      );
      return fields.set(index, field);
    });

    MetadataActions.updateSecret({
      secret: this.props.secret,
      data: newSecret.data,
    });
  }

  render() {
    if (!this.props.secret.data) {
      return <pre>Loading...</pre>;
    }

    return (
      <div className="secret-edit">
        <SecretFields
          fields={this.props.secret.getIn(['data', 'fields'])}
          onSubmit={this.onSubmit}
          showCopy
        />
      </div>
    );
  }
}

export default SecretEdit;
