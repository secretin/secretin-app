import alt from 'utils/alt';
import secretin from 'utils/secretin';

class MetadataActions {
  constructor() {
    this.generateActions(
      'createSecretSuccess',
      'deleteSecretSuccess'
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
          currentUser: secretin.currentUser,
        })
      ));
  }

  deleteSecret({ secret }) {
    return secretin
      .deleteSecret(secret.id)
      .catch((error) => {
        console.error(error);
        throw error;
      })
      .then(() => (
        this.deleteSecretSuccess({
          currentUser: secretin.currentUser,
        })
      ));
  }
}

export default alt.createActions(MetadataActions);
