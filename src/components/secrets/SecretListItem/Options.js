import React, { PropTypes } from 'react';

import AppUIStore from 'stores/AppUIStore';
import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

const propTypes = {
  secret: PropTypes.any,
  parentFolderId: PropTypes.string,
};

function SecretListItemOptions({ parentFolderId, secret }) {
  const currentUser = AppUIStore.getCurrentUser();
  return (
    <Dropdown id="secret-action" pullRight>
      <Dropdown.Toggle>
        <Icon id="more-vert" size="small" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.MenuItem
          onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: secret.type === 'folder' ? 'access' : 'details' })}
        >
          Show
        </Dropdown.MenuItem>
        <Dropdown.MenuItem
          onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: 'access' })}
          disabled={!secret.canBeSharedBy(currentUser)}
        >
          Share
        </Dropdown.MenuItem>

        <Dropdown.MenuItem divider />

        <Dropdown.MenuItem
          onSelect={() => MetadataActions.removeSecretFromCurrentFolder({
            secret,
            currentFolderId: parentFolderId,
          })}
          disabled={!parentFolderId || !secret.canBeUpdatedBy(currentUser)}
        >
          Remove from this folder
        </Dropdown.MenuItem>

        <Dropdown.MenuItem
          onSelect={() => MetadataActions.deleteSecret({ secret })}
          disabled={!secret.canBeUpdatedBy(currentUser)}
        >
          Delete
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}
SecretListItemOptions.propTypes = propTypes;

export default SecretListItemOptions;
