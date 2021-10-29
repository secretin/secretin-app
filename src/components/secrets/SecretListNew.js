import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import Secret from 'models/Secret';

import * as NewSecretUIActions from 'slices/NewSecretUISlice';

import SecretNew from 'components/secrets/SecretNew';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

const propTypes = {
  folder: PropTypes.instanceOf(Secret),
};

function SecretListNew({ folder }) {
  const currentUser = useSelector(state => state.AppUI.currentUser);
  const dispatch = useDispatch();
  let folderId = null;
  let canWrite = true;
  if (folder) {
    folderId = folder.id;
    canWrite = folder.canBeUpdatedBy(currentUser);
  }

  return (
    <div className="secret-list-new">
      <SecretNew />
      <Button
        title="Add secret"
        buttonStyle="primary"
        size="small"
        disabled={!canWrite}
        onClick={() =>
          dispatch(
            NewSecretUIActions.showModal({ folder: folderId, isFolder: false })
          )
        }
      >
        <Icon id="add-secret" size="small" />
        Add secret
      </Button>
      <Button
        title="Add secret"
        buttonStyle="primary"
        size="small"
        disabled={!canWrite}
        onClick={() =>
          dispatch(
            NewSecretUIActions.showModal({ folder: folderId, isFolder: true })
          )
        }
      >
        <Icon id="add-folder" size="small" />
        Create folder
      </Button>
    </div>
  );
}
SecretListNew.propTypes = propTypes;

export default SecretListNew;
