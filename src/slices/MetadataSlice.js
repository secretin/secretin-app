import secretin, { Errors } from 'utils/secretin';
import { createSlice } from '@reduxjs/toolkit';
import Secret from 'models/Secret';

import {
  createSecretSuccess,
  createSecretFailure,
  loginUserSuccess,
  addSecretToFolderFailure,
  removeSecretFromCurrentFolderFailure,
} from 'slices/AppUISlice';
import {
  updateSecretFailure,
  createSecretUserRightsFailure,
  updateSecretUserRightsFailure,
  deleteSecretUserRightsFailure,
} from 'slices/ShowSecretUISlice';

const { FriendNotFoundError } = Errors;

const buildSecrets = metadata => {
  return metadata.map(secret => Secret.createFromRaw(secret));
};

const getIndex = (state, secretId) =>
  state.metadata.findIndex(secret => secret.id === secretId);

const getById = (state, secretId) =>
  state.metadata.find(secret => secret.id === secretId);

// Helper function reused in many actions
const _rebuildMetadata = (state, action) => {
  const { metadata } = action.payload;
  state.metadata = buildSecrets(Object.values(metadata));
};

export const MetadataSlice = createSlice({
  name: 'Metadata',
  initialState: {
    metadata: {},
  },
  reducers: {
    loadMetadataSuccess: _rebuildMetadata,
    deleteSecretSuccess: _rebuildMetadata,
    deleteSecretFailure: _rebuildMetadata,
    addSecretToFolderSuccess: _rebuildMetadata,
    removeSecretFromCurrentFolderSuccess: _rebuildMetadata,
    createSecretUserRightsSuccess: _rebuildMetadata,
    updateSecretSuccess: _rebuildMetadata,
    renameSecretSuccess: _rebuildMetadata,

    updateSecretUserRightsSuccess: (state, action) => {
      const { secret, user, rights } = action.payload;
      const secretMetadataIndex = getIndex(state, secret.id);
      state.metadata[secretMetadataIndex].users = state.metadata[
        secretMetadataIndex
      ].users.map(userToUpdate => {
        if (userToUpdate.id === user.id) {
          return userToUpdate.merge({ rights });
        }
        return userToUpdate;
      });
    },

    deleteSecretUserRightsSuccess: (state, action) => {
      const { secret, user } = action.payload;
      const secretMetadata = getById(state, secret.id);
      secretMetadata.users = secretMetadata.users.filter(
        userToFilter => userToFilter.id !== user.id
      );
    },
  },
  extraReducers: {
    [createSecretSuccess]: _rebuildMetadata,
    [loginUserSuccess]: _rebuildMetadata,
  },
});

// Action creators are generated for each case reducer function
export const {
  loadMetadataSuccess,
  deleteSecretSuccess,
  deleteSecretFailure,
  addSecretToFolderSuccess,
  removeSecretFromCurrentFolderSuccess,
  createSecretUserRightsSuccess,
  updateSecretSuccess,
  renameSecretSuccess,
  updateSecretUserRightsSuccess,
  deleteSecretUserRightsSuccess,
} = MetadataSlice.actions;

export const loadMetadata = () => dispatch => {
  secretin.refreshUser().then(() => {
    dispatch(
      loadMetadataSuccess({
        metadata: secretin.currentUser.metadatas,
      })
    );
  });
};

export const createSecret = (
  { title, data, folder, isFolder } = { isFolder: false }
) => dispatch => {
  let promise;
  if (isFolder) {
    if (folder) {
      promise = secretin.addFolder(title, folder);
    } else {
      promise = secretin.addFolder(title);
    }
  } else if (folder) {
    promise = secretin.addSecret(title, data, folder);
  } else {
    promise = secretin.addSecret(title, data);
  }

  return promise
    .then(() =>
      dispatch(
        createSecretSuccess({
          metadata: secretin.currentUser.metadatas,
        })
      )
    )
    .catch(error => {
      dispatch(createSecretFailure({ error }));
      throw error;
    });
};

export const updateSecret = ({ secret, data }) => dispatch => {
  return secretin
    .editSecret(secret.id, data)
    .then(() => {
      dispatch(
        updateSecretSuccess({
          metadata: secretin.currentUser.metadatas,
          data,
        })
      );
    })
    .catch(error => {
      dispatch(updateSecretFailure({ error }));
      throw error;
    });
};

export const renameSecret = ({ secret, newTitle }) => dispatch => {
  return secretin
    .renameSecret(secret.id, newTitle)
    .then(() => {
      dispatch(
        renameSecretSuccess({
          metadata: secretin.currentUser.metadatas,
        })
      );
    })
    .catch(error => {
      // TODO
      // dispatch(renameSecretFailure({ error }));
      throw error;
    });
};

export const deleteSecret = ({ secret }) => dispatch => {
  return secretin
    .deleteSecret(secret.id)
    .catch(error => {
      dispatch(
        deleteSecretFailure({
          metadata: secretin.currentUser.metadatas,
        })
      );
      throw error;
    })
    .then(() =>
      dispatch(
        deleteSecretSuccess({
          metadata: secretin.currentUser.metadatas,
        })
      )
    );
};

export const createSecretUserRights = ({
  secret,
  user,
  rights,
}) => dispatch => {
  return secretin
    .shareSecret(secret.id, user.username, rights)
    .then(() => secretin.refreshUser())
    .then(() => {
      dispatch(
        createSecretUserRightsSuccess({
          metadata: secretin.currentUser.metadatas,
          user,
          rights,
        })
      );
    })
    .catch(error => {
      if (error instanceof FriendNotFoundError) {
        return dispatch(
          createSecretUserRightsFailure({
            error: { username: 'User not found' },
          })
        );
      }
      dispatch(
        createSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        })
      );
      throw error;
    });
};

export const updateSecretUserRights = ({
  secret,
  user,
  rights,
}) => dispatch => {
  return secretin
    .shareSecret(secret.id, user.username, rights)
    .then(() =>
      dispatch(updateSecretUserRightsSuccess({ secret, user, rights }))
    )
    .catch(error => {
      dispatch(
        updateSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        })
      );
      throw error;
    });
};

export const deleteSecretUserRights = ({ secret, user }) => dispatch => {
  return secretin
    .unshareSecret(secret.id, user.username)
    .then(() => dispatch(deleteSecretUserRightsSuccess({ secret, user })))
    .catch(error => {
      dispatch(
        deleteSecretUserRightsFailure({
          error: { unknown: 'Unknown error' },
        })
      );
      throw error;
    });
};

export const addSecretToFolder = ({ secret, folder }) => dispatch => {
  return secretin
    .addSecretToFolder(secret.id, folder.id)
    .then(() =>
      dispatch(
        addSecretToFolderSuccess({
          secret,
          folder,
          metadata: secretin.currentUser.metadatas,
        })
      )
    )
    .catch(error => {
      dispatch(
        addSecretToFolderFailure({
          error: { unknown: 'Unknown error' },
        })
      );
      throw error;
    });
};

export const removeSecretFromCurrentFolder = ({
  secret,
  currentFolderId,
}) => dispatch => {
  return secretin
    .removeSecretFromFolder(secret.id, currentFolderId)
    .then(() =>
      dispatch(
        removeSecretFromCurrentFolderSuccess({
          secret,
          currentFolderId,
          metadata: secretin.currentUser.metadatas,
        })
      )
    )
    .catch(error => {
      dispatch(
        removeSecretFromCurrentFolderFailure({
          error: { unknown: 'Unknown error' },
        })
      );
      throw error;
    });
};

// TODO : these should be some kind of selectors
//

//   static getSecretsInFolder(folderId) {
//     const { metadata } = this.getState();
//     const currentUser = AppUIStore.getCurrentUser();
//     if (!currentUser || !metadata) {
//       return new Immutable.Map();
//     }

//     const userId = currentUser.username;

//     return metadata.filter(
//       metadatum =>
//         (!folderId && metadatum.getIn(['users', userId, 'folders', 'ROOT'])) ||
//         (folderId && metadatum.getIn(['users', userId, 'folders', folderId]))
//     );
//   }

//   static getAllFolders() {
//     const { metadata } = this.getState();
//     return (
//       metadata.filter(secret => secret.type === 'folder') || new Immutable.Map()
//     );
//   }

//   static getAllSecrets() {
//   const { metadata } = this.getState();
//   return (
//     metadata.filter(secret => secret.type !== 'folder') || new Immutable.Map()
//   );
// }

//   static getMySecret() {
//     return (
// this.getAllSecrets().filter(
//   secret =>
//     secret.users
//       .filter(user => user.username === secretin.currentUser.username)
//       .first()
//       .rights') === 2
// ) || new Immutable.Map()
//   );
// }

//   static getSharedSecret() {
//     return (
//       this.getAllSecrets().filter(secret => secret.users.size > 1) ||
//       new Immutable.Map()
//     );
//   }

export default MetadataSlice.reducer;
