import React, { PropTypes } from 'react';

import Secret from 'models/Secret';
import AppUIStore from 'stores/AppUIStore';
import NewSecretUIActions from 'actions/NewSecretUIActions';
import SecretNew from 'components/secrets/SecretNew';
import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

const propTypes = {
  folder: PropTypes.instanceOf(Secret),
};

function SecretListNew({ folder }) {
  let folderId = null;
  let canWrite = true;
  if (folder) {
    folderId = folder.id;
    const currentUser = AppUIStore.getCurrentUser();
    canWrite = folder.canBeUpdatedBy(currentUser);
  }

  return (
    <div className="secret-list-new">
      <SecretNew />
      <Dropdown
        id="new-secret"
        disabled={!canWrite}
        pullRight
      >
        <Dropdown.Toggle
          title={!canWrite ? "Your don't have write access" : null}
        >
          <Icon id="add-box" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.MenuItem
            onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: true })}
          >
            Create new folder
          </Dropdown.MenuItem>
          <Dropdown.MenuItem
            onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: false })}
          >
            Create new secret
          </Dropdown.MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
SecretListNew.propTypes = propTypes;

export default SecretListNew;
