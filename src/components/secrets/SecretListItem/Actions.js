import React, { PropTypes } from 'react';

import AppUIStore from 'stores/AppUIStore';
import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

const propTypes = {
  secret: PropTypes.any,
};

function SecretListItemActions({ secret }) {
  const currentUser = AppUIStore.getCurrentUser();

  return (
    <Dropdown id="secret-action" pullRight>
      <Dropdown.Toggle>
        <Icon id="more-vert" size="small" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.MenuItem
          onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: 'details' })}
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
          onSelect={() => MetadataActions.deleteSecret({ secret })}
          disabled={!secret.canBeUpdatedBy(currentUser)}
        >
          Delete
        </Dropdown.MenuItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}
SecretListItemActions.propTypes = propTypes;

export default SecretListItemActions;
