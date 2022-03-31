import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { defaultMemoize } from 'reselect';
import equal from 'fast-deep-equal/es6';

import SecretList from 'components/secrets/SecretList';

import {
  getAllSecrets,
  getMySecrets,
  getSecretsInFolder,
  getSharedSecrets,
} from 'selectors/MetadataSelectors';

const propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      secrets: PropTypes.string,
      path: PropTypes.string,
    }),
  }),
  showAll: PropTypes.bool,
  showMine: PropTypes.bool,
  showShared: PropTypes.bool,
};

const defaultProps = {
  showAll: false,
  showMine: false,
  showShared: false,
};

const getFolders = defaultMemoize(
  params => {
    return params.path ? params.path.split('/') : [];
  },
  (previousVal, currentVal) => equal(previousVal, currentVal)
);

function SecretListContainer({
  match: { params },
  showAll,
  showMine,
  showShared,
}) {
  const metadata = useSelector(state => state.Metadata.metadata);
  const allSecrets = useSelector(getAllSecrets);
  const mySecrets = useSelector(getMySecrets);
  const sharedSecrets = useSelector(getSharedSecrets);
  const folders = getFolders(params);
  const folderId = folders[folders.length - 1];
  const folderSecrets = useSelector(state =>
    getSecretsInFolder(state, folderId)
  );
  if (showAll) {
    return <SecretList secrets={allSecrets} showAll />;
  } else if (showMine) {
    return <SecretList secrets={mySecrets} showMine />;
  } else if (showShared) {
    return <SecretList secrets={sharedSecrets} showShared />;
  }
  const folder = metadata.find(f => f.id === folderId);
  return (
    <SecretList folder={folder} folders={folders} secrets={folderSecrets} />
  );
}
SecretListContainer.propTypes = propTypes;
SecretListContainer.defaultProps = defaultProps;

export default SecretListContainer;
