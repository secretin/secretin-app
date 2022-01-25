import { createSelector } from 'reselect';

export const getAllSecrets = createSelector(
  state => state.Metadata.metadata,
  metadata => {
    return Object.values(metadata);
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
      return (
        (!folderId && secretUser.folders.ROOT) ||
        (folderId && Object.keys(secretUser.folders).includes(folderId))
      );
    });
  }
);
