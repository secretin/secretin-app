import React from 'react';
import PropTypes from 'prop-types';

import SecretListItemFolderFolder from './Folder';
import SecretListItemFolderSecret from './Secret';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.array,
};

function SecretListItem({ secret, folders }) {
  if (secret.type === 'folder') {
    return <SecretListItemFolderFolder secret={secret} folders={folders} />;
  }
  return (
    <SecretListItemFolderSecret
      parentFolderId={folders.last()}
      secret={secret}
    />
  );
}
SecretListItem.propTypes = propTypes;

export default SecretListItem;
