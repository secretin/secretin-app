import alt from 'utils/alt';
import secretin, { Errors } from 'utils/secretin';

const { FriendNotFoundError } = Errors;

class MetadataActions {
  constructor() {
    this.generateActions(
      'loadMetadataSuccess',
      'createSecretSuccess',
      'createSecretFailure',
      'updateSecretSuccess',
      'updateSecretFailure',
      'renameSecretSuccess',
      'renameSecretFailure',
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
      'addSecretToFolderFailure'
    );
  }

  loadMetadata() {
    return dispatch => {
      dispatch();
      secretin.refreshUser().then(() => {
        this.loadMetadataSuccess({
          metadata: secretin.currentUser.metadatas,
        });
      });
    };
  }

  createSecret({ title, data, folder, isFolder } = { isFolder: false }) {
    let promise;
    if (isFolder) {
      if (folder) {
        promise = secretin.addFolder(title, folder);
      } else {
        promise = secretin.addFolder(title);
      }
    } else if (folder) {
      promise = secretin.addSecret(title, data.toJS(), folder);
    } else {
      promise = secretin.addSecret(title, data.toJS());
    }

    return dispatch => {
      dispatch();

      promise
        .then(() =>
          this.createSecretSuccess({
            metadata: secretin.currentUser.metadatas,
          })
        )
        .catch(error => {
          this.createSecretFailure({ error });
          throw error;
        });
    };
  }

  updateSecret({ secret, data }) {
    return dispatch => {
      dispatch();
      secretin
        .editSecret(secret.id, data)
        .then(() => {
          this.updateSecretSuccess({
            metadata: secretin.currentUser.metadatas,
            data,
          });
        })
        .catch(error => {
          this.updateSecretFailure({ error });
          throw error;
        });
    };
  }

  renameSecret({ secret, newTitle }) {
    return dispatch => {
      dispatch();
      secretin
        .renameSecret(secret.id, newTitle)
        .then(() => {
          this.renameSecretSuccess({
            metadata: secretin.currentUser.metadatas,
          });
        })
        .catch(error => {
          this.renameSecretFailure({ error });
          throw error;
        });
    };
  }

  deleteSecret({ secret }) {
    return dispatch => {
      dispatch();
      secretin
        .deleteSecret(secret.id)
        .catch(error => {
          this.deleteSecretFailure({
            metadata: secretin.currentUser.metadatas,
          });
          throw error;
        })
        .then(() =>
          this.deleteSecretSuccess({
            metadata: secretin.currentUser.metadatas,
          })
        );
    };
  }

  createSecretUserRights({ secret, user, rights }) {
    return dispatch => {
      dispatch();
      secretin
        .shareSecret(secret.id, user.username, rights)
        .then(() => secretin.refreshUser())
        .then(() => {
          this.createSecretUserRightsSuccess({
            metadata: secretin.currentUser.metadatas,
          });
        })
        .catch(error => {
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
    };
  }

  updateSecretUserRights({ secret, user, rights }) {
    return dispatch => {
      dispatch();
      secretin
        .shareSecret(secret.id, user.username, rights)
        .then(() =>
          this.updateSecretUserRightsSuccess({ secret, user, rights })
        )
        .catch(error => {
          this.updateSecretUserRightsFailure({
            error: { unknown: 'Unknown error' },
          });
          throw error;
        });
    };
  }

  deleteSecretUserRights({ secret, user }) {
    return dispatch => {
      dispatch();
      secretin
        .unshareSecret(secret.id, user.username)
        .then(() => this.deleteSecretUserRightsSuccess({ secret, user }))
        .catch(error => {
          this.deleteSecretUserRightsFailure({
            error: { unknown: 'Unknown error' },
          });
          throw error;
        });
    };
  }

  addSecretToFolder({ secret, folder }) {
    return dispatch => {
      dispatch();
      secretin
        .addSecretToFolder(secret.id, folder.id)
        .then(() =>
          this.addSecretToFolderSuccess({
            secret,
            folder,
            metadata: secretin.currentUser.metadatas,
          })
        )
        .catch(error => {
          this.addSecretToFolderFailure({
            error: { unknown: 'Unknown error' },
          });
          throw error;
        });
    };
  }

  removeSecretFromCurrentFolder({ secret, currentFolderId }) {
    return dispatch => {
      dispatch();
      secretin
        .removeSecretFromFolder(secret.id, currentFolderId)
        .then(() =>
          this.removeSecretFromCurrentFolderSuccess({
            secret,
            currentFolderId,
            metadata: secretin.currentUser.metadatas,
          })
        )
        .catch(error => {
          this.removeSecretFromCurrentFolderFailure({
            error: { unknown: 'Unknown error' },
          });
          throw error;
        });
    };
  }
}

export default alt.createActions(MetadataActions);
