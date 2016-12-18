import alt from 'utils/alt';
import secretin from 'utils/secretin';

class MetadataActions {
  constructor() {
    this.generateActions(
      'createSecretSuccess',
      'createSecretFailure',
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
      .shareSecret(secret.id, user.username, secret.type, rights)
      .then(() => (
        this.createSecretUserRightsSuccess({ secret, user, rights })
      ))
      .catch((error) => {
        this.createSecretUserRightsFailure({ error });
        throw error;
      });
  }

  updateSecretUserRights({ secret, user, rights }) {
    return secretin
      .shareSecret(secret.id, user.username, secret.type, rights)
      .then(() => (
        this.updateSecretUserRightsSuccess({ secret, user, rights })
      ))
      .catch((error) => {
        this.updateSecretUserRightsFailure({ error });
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
        this.deleteSecretUserRightsFailure({ error });
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
        this.addSecretToFolderFailure({ error });
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
        this.removeSecretFromCurrentFolderFailure({ error });
        throw error;
      });
  }
}

export default alt.createActions(MetadataActions);
