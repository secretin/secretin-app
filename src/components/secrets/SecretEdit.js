import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import SecretDataRecord from 'models/SecretDataRecord';

import EditSecretUIActions from 'actions/EditSecretUIActions';
import EditSecretUIStore from 'stores/EditSecretUIStore';
import SecretFields from 'components/secrets/SecretFields';

class SecretEdit extends Component {
  static propTypes = {
    data: PropTypes.instanceOf(SecretDataRecord),
    canUpdate: PropTypes.bool,
  };

  static getStores() {
    return [EditSecretUIStore];
  }

  static getPropsFromStores() {
    return { data: EditSecretUIStore.getState().get('data') };
  }

  render() {
    if (!this.props.data) {
      return <pre>Loading...</pre>;
    }

    return (
      <div className="secret-edit">
        <SecretFields
          fields={this.props.data.get('fields')}
          onChange={
            this.props.canUpdate ? EditSecretUIActions.changeField : () => {}
          }
          canUpdate={this.props.canUpdate}
        />
      </div>
    );
  }
}

export default connectToStores(SecretEdit);
