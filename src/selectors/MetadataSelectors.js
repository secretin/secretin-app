import { createSelector } from 'reselect';

export const getAllSecrets = createSelector(
  state => state.Metadata.metadata,
  metadata => {
    return Object.values(metadata).filter(secret => secret.type !== 'folder');
  }
);

export const getMySecrets = createSelector(
  getAllSecrets,
  state => state.AppUI.currentUser,
  (allSecrets, currentUser) => {
    if (!allSecrets) return [];
    return allSecrets.filter(secret => {
      const user = secret.users.find(
        user => user.username === currentUser.username
      );
      return user?.rights === 2;
    });
  }
);

export const getSecretsInFolder = createSelector(
  state => state.Metadata.metadata,
  state => state.AppUI.currentUser,
  (state, folderId) => folderId,
  (metadata, currentUser, folderId) => {
    if (!currentUser || !metadata) {
      return {};
    }
    const userId = currentUser.username;
    return Object.values(metadata).filter(secret => {
      const secretUser = secret.users.find(user => user.id === userId);
      const folders = secretUser?.folders || {};
      return (
        (!folderId && folders.ROOT) ||
        (folderId && Object.keys(folders).includes(folderId))
      );
    });
  }
);

// TODO
//   static getSharedSecret() {
//     return (
//       this.getAllSecrets().filter(secret => secret.users.size > 1) ||
//       new Immutable.Map()
//     );
//   }
