import React, { PropTypes } from 'react';
import Immutable from 'immutable';

import SecretListItemFolderFolder from './Folder';
import SecretListItemFolderSecret from './Secret';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.instanceOf(Immutable.List),
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
