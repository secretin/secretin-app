import React, { Component, PropTypes } from 'react';

import Secret from 'models/Secret';

import SecretFields from 'components/secrets/SecretFields';

import MetadataActions from 'actions/MetadataActions';
import AppUIStore from 'stores/AppUIStore';

class SecretEdit extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit({ field }) {
    const newSecret = this.props.secret.updateIn(['data', 'fields'], fields =>
      fields.set(
        fields.findIndex(fieldToUpdate => fieldToUpdate.id === field.id),
        field
      )
    );

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
          canUpdate={this.props.secret.canBeUpdatedBy(AppUIStore.getCurrentUser())}
          showCopy
        />
      </div>
    );
  }
}

export default SecretEdit;
