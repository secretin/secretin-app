import alt from 'utils/alt';
import secretin from 'utils/secretin';
import Immutable from 'immutable';

import SecretDataRecord from 'models/SecretDataRecord';

class ShowSecretUIActions {
  constructor() {
    this.generateActions(
      'showModal',
      'showSecretSuccess',
      'hideModal',
      'changeTab'
    );
  }

  showSecret({ secret, tab }) {
    this.showModal({ secret, tab });
    return secretin.getSecret(secret.id)
      .then((data) => {
        if (secret.type === 'windows') {
          this.showSecretSuccess({
            secret: secret.set('data', new Immutable.List(data)),
          });
        } else {
          this.showSecretSuccess({
            secret: secret.set('data', SecretDataRecord.createFromRaw(data)),
          });
        }
      });
  }
}

export default alt.createActions(ShowSecretUIActions);
