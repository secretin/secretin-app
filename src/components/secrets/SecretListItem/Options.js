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
  const canShare = secret.canBeSharedBy(currentUser);
  if (!canShare && secret.type === 'folder') {
    return null;
  }
  return (
    <Dropdown id="secret-action" pullRight>
      <Dropdown.Toggle>
        <Icon id="more-vert" size="small" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {
          secret.type !== 'folder' &&
            <Dropdown.MenuItem
              onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: secret.type === 'folder' ? 'access' : 'details' })}
            >
              Show
            </Dropdown.MenuItem>
        }
        {
          canShare &&
          (
            <div>
              <Dropdown.MenuItem
                onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: 'access' })}
              >
                Share
              </Dropdown.MenuItem>

              <Dropdown.MenuItem divider />

              {
                parentFolderId &&
                  <Dropdown.MenuItem
                    onSelect={() => MetadataActions.removeSecretFromCurrentFolder({
                      secret,
                      currentFolderId: parentFolderId,
                    })}
                  >
                    Remove from this folder
                  </Dropdown.MenuItem>
              }

              <Dropdown.MenuItem
                onSelect={() => MetadataActions.deleteSecret({ secret })}
              >
                Delete
              </Dropdown.MenuItem>
            </div>
          )
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}
SecretListItemOptions.propTypes = propTypes;

export default SecretListItemOptions;
