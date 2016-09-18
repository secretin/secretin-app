import React, { PropTypes } from 'react';

import NewSecretUIActions from 'actions/NewSecretUIActions';
import SecretNew from 'components/secrets/SecretNew';
import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

const propTypes = {
  folder: PropTypes.string,
};

function SecretListNew({ folder }) {
  return (
    <div className="secret-list-new">
      <SecretNew />
      <Dropdown id="new-secret" pullRight>
        <Dropdown.Toggle>
          <Icon id="add-box" />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.MenuItem
            onClick={() => NewSecretUIActions.showModal({ folder, isFolder: true })}
          >
            Create new folder
          </Dropdown.MenuItem>
          <Dropdown.MenuItem
            onClick={() => NewSecretUIActions.showModal({ folder, isFolder: false })}
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
