import alt from 'utils/alt';
import secretin from 'utils/secretin';

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
    return dispatch => {
      dispatch();
      if(secret.type === 'folder') {
        this.showSecretSuccess({secret})
      } else {
        secretin.getSecret(secret.id).then(data => {
          const raw = !data.fields ? { fields: data } : data;
          this.showSecretSuccess({
            secret: secret.set('data', SecretDataRecord.createFromRaw(raw)),
          });
        });
      }
    };
  }
}

export default alt.createActions(ShowSecretUIActions);
