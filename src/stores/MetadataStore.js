import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import secretin from 'utils/secretin';
import AppUIActions from 'actions/AppUIActions';
import MetadataActions from 'actions/MetadataActions';
import AppUIStore from 'stores/AppUIStore';

import Secret from 'models/Secret';

const MetadataState = new Record({
  metadata: new Immutable.Map(),
});

function buildSecrets(metadata) {
  return Immutable.fromJS(metadata).map(secret => Secret.createFromRaw(secret));
}

class MetadataStore {
  constructor() {
    this.bindAction(
      AppUIActions.LOGIN_USER_SUCCESS,
      this.onLoadMetadataSuccess
    );
    this.bindActions(MetadataActions);

    this.state = new MetadataState();
  }

  onLoadMetadataSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onCreateSecretSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onDeleteSecretSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onDeleteSecretFailure({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  // onAddSecretToFolder({ secret, folder }) {
  //  // TODO: Do something while we add the secret to a folder
  // }

  onAddSecretToFolderSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onRemoveSecretFromCurrentFolderSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onCreateSecretUserRightsSuccess({ metadata }) {
    this.setState(this.state.set('metadata', buildSecrets(metadata)));
  }

  onUpdateSecretUserRightsSuccess({ secret, user, rights }) {
    this.setState(
      this.state.updateIn(['metadata', secret.id, 'users'], users =>
        users.map(userToUpdate => {
          if (userToUpdate.id === user.id) {
            return userToUpdate.set('rights', rights);
          }
          return userToUpdate;
        })
      )
    );
  }

  onDeleteSecretUserRightsSuccess({ secret, user }) {
    this.setState(
      this.state.updateIn(['metadata', secret.id, 'users'], users =>
        users.filterNot(userToFilter => userToFilter.id === user.id)
      )
    );
  }

  static getById(secretId) {
    const { metadata } = this.getState();
    if (!metadata) {
      return new Immutable.Map();
    }
    return metadata.get(secretId);
  }

  static getSecretsInFolder(folderId) {
    const { metadata } = this.getState();
    const currentUser = AppUIStore.getCurrentUser();
    if (!currentUser || !metadata) {
      return new Immutable.Map();
    }

    const userId = currentUser.username;

    return metadata.filter(
      metadatum =>
        (!folderId && metadatum.getIn(['users', userId, 'folders', 'ROOT'])) ||
        (folderId && metadatum.getIn(['users', userId, 'folders', folderId]))
    );
  }

  static getAllFolders() {
    const { metadata } = this.getState();
    return (
      metadata.filter(secret => secret.type === 'folder') || new Immutable.Map()
    );
  }

  static getAllSecrets() {
    const { metadata } = this.getState();
    return (
      metadata.filter(secret => secret.type !== 'folder') || new Immutable.Map()
    );
  }

  static getMySecret() {
    return (
      this.getAllSecrets().filter(
        secret =>
          secret.users
            .filter(user => user.username === secretin.currentUser.username)
            .first()
            .get('rights') === 2
      ) || new Immutable.Map()
    );
  }

  static getSharedSecret() {
    return (
      this.getAllSecrets().filter(secret => secret.users.size > 1) ||
      new Immutable.Map()
    );
  }
}

export default alt.createStore(makeImmutable(MetadataStore), 'MetadataStore');
