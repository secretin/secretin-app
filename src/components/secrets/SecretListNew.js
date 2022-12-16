import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Secret from 'models/Secret';

import * as NewSecretUIActions from 'slices/NewSecretUISlice';

import SecretNew from 'components/secrets/SecretNew';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';

const propTypes = {
  folder: PropTypes.instanceOf(Secret),
  showAddFolder: PropTypes.bool,
};

function SecretListNew({ folder, showAddFolder }) {
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
      <SecretNew folder={folder} />
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
        <FormattedMessage id="new secret" />
      </Button>
      {showAddFolder && (
        <Button
          title="Add folder"
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
          <FormattedMessage id="new folder" />
        </Button>
      )}
    </div>
  );
}
SecretListNew.propTypes = propTypes;

export default SecretListNew;
