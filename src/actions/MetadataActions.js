import alt from 'utils/alt';
import secretin, { Errors } from 'utils/secretin';

const {
  FriendNotFoundError,
} = Errors;

class MetadataActions {
  constructor() {
    this.generateActions(
      'loadMetadataSuccess',
      'createSecretSuccess',
      'createSecretFailure',
      'updateSecretSuccess',
      'updateSecretFailure',
      'deleteSecretSuccess',
      'deleteSecretFailure',
      'createSecretUserRightsSuccess',
      'createSecretUserRightsFailure',
      'updateSecretUserRightsSuccess',
      'updateSecretUserRightsFailure',
      'deleteSecretUserRightsSuccess',
      'deleteSecretUserRightsFailure',
      'removeSecretFromCurrentFolderSuccess',
      'removeSecretFromCurrentFolderFailure',
      'addSecretToFolderSuccess',
      'addSecretToFolderFailure',
    );
  }

  loadMetadata() {
    return secretin
      .refreshUser()
      .then(() => {
        this.loadMetadataSuccess({
          metadata: secretin.currentUser.metadatas,
        });
      });
  }

  createSecret({ title, data, folder, isFolder } = { isFolder: false }) {
    let promise;
    if (isFolder) {
      promise = secretin.addFolder(title);
    } else {
      promise = secretin.addSecret(title, data.toJS());
    }

    return promise
      .then((id) => {
        if (folder) {
          return secretin.addSecretToFolder(id, folder);
        }
        return id;
      })
      .then(() => (
        this.createSecretSuccess({
          metadata: secretin.currentUser.metadatas,
        })
      ))
      .catch((error) => {
        this.createSecretFailure({ error });
        throw error;
      });
  }

  updateSecret({ secret, data }) {
    return secretin.editSecret(secret.id, data);
  }

  deleteSecret({ secret }) {
    return secretin
      .deleteSecret(secret.id)
      .catch((error) => {
        this.deleteSecretFailure({
          metadata: secretin.currentUser.metadatas,
        });
        throw error;
      })
      .then(() => (
        this.deleteSecretSuccess({
          metadata: secretin.currentUser.metadatas,
        })
      ));
  }

  createSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, rights)
      .then(() => secretin.refreshUser())
      .then(() => {
        this.loadMetadataSuccess({
          metadata: secretin.currentUser.metadatas,
        });
      })
      .catch((error) => {
        if (error instanceof FriendNotFoundError) {
          return this.createSecretUserRightsFailure({
            error: { username: 'User not found' },
          });
        }
        this.createSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        });
        throw error;
      });
  }

  updateSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, rights)
      .then(() => (
        this.updateSecretUserRightsSuccess({ secret, user, rights })
      ))
      .catch((error) => {
        this.updateSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        });
        throw error;
      });
  }

  deleteSecretUserRights({ secret, user }) {
    return secretin
      .unshareSecret(secret.id, user.username)
      .then(() => (
        this.deleteSecretUserRightsSuccess({ secret, user })
      ))
      .catch((error) => {
        this.deleteSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        });
        throw error;
      });
  }

  addSecretToFolder({ secret, folder }) {
    return secretin
      .addSecretToFolder(secret.id, folder.id)
      .then(() => (
        this.addSecretToFolderSuccess({
          secret,
          folder,
          metadata: secretin.currentUser.metadatas,
        })
      ))
      .catch((error) => {
        this.addSecretToFolderFailure({
          error: { unknown: 'Unknown error' },
        });
        throw error;
      });
  }

  removeSecretFromCurrentFolder({ secret, currentFolderId }) {
    return secretin
      .removeSecretFromFolder(secret.id, currentFolderId)
      .then(() => (
        this.removeSecretFromCurrentFolderSuccess({
          secret,
          currentFolderId,
          metadata: secretin.currentUser.metadatas,
        })
      ))
      .catch((error) => {
        this.removeSecretFromCurrentFolderFailure({
          error: { unknown: 'Unknown error' },
        });
        throw error;
      });
  }
}

export default alt.createActions(MetadataActions);
