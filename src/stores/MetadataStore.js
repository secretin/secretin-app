import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';
import MetadataActions from 'actions/MetadataActions';
import AppUIStore from 'stores/AppUIStore';

import Secret from 'models/Secret';

const MetadataState = new Record({
  metadata: new Immutable.Map(),
});

class MetadataStore {
  constructor() {
    this.bindAction(AppUIActions.LOGIN_USER_SUCCESS, this.onLoadMetadata);
    this.bindActions(MetadataActions);

    this.state = new MetadataState();
  }

  onLoadMetadata({ currentUser }) {
    this.setState(this.state
      .set('metadata', Immutable.fromJS(currentUser.metadatas).map(secret => Secret.createFromRaw(secret)))
    );
  }

  onCreateSecretSuccess({ currentUser }) {
    this.setState(this.state
      .set('metadata', Immutable.fromJS(currentUser.metadatas).map(secret => Secret.createFromRaw(secret)))
    );
  }

  onDeleteSecretSuccess({ currentUser }) {
    this.setState(this.state
      .set('metadata', Immutable.fromJS(currentUser.metadatas).map(secret => Secret.createFromRaw(secret)))
    );
  }

  onCreateSecretUserRightsSuccess({ secret, user, rights }) {
    this.setState(this.state
      .updateIn(['metadata', secret.id, 'users'], users =>
        users.push(user.set('rights', rights))
      )
    );
  }

  onUpdateSecretUserRightsSuccess({ secret, user, rights }) {
    this.setState(this.state
      .updateIn(['metadata', secret.id, 'users'], users =>
        users.map((userToUpdate) => {
          if (userToUpdate.id === user.id) {
            return userToUpdate.set('rights', rights);
          }
          return userToUpdate;
        })
      )
    );
  }

  onDeleteSecretUserRightsSuccess({ secret, user }) {
    this.setState(this.state
      .updateIn(['metadata', secret.id, 'users'], users =>
        users.filterNot(userToFilter => userToFilter.id === user.id)
      )
    );
  }

  onMoveSecretToFolder({ secret, folder }) {

  }

  onMoveSecretToFolderSuccess({ metadata }) {
    this.setState(this.state
      .set('metadata', Immutable.fromJS(metadata).map(secret => Secret.createFromRaw(secret)))
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

    return metadata.filter(metadatum => (
      (!folderId && metadatum.getIn(['users', userId, 'folders', 'ROOT'])) ||
      (folderId && metadatum.getIn(['users', userId, 'folders', folderId]))
    ));
  }

  static getAllSecrets() {
    const { metadata } = this.getState();
    return metadata.filter(secret => secret.type !== 'folder') || new Immutable.Map();
  }
}

export default alt.createStore(
  makeImmutable(MetadataStore),
  'MetadataStore'
);
