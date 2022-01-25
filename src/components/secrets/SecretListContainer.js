import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import SecretList from 'components/secrets/SecretList';

import {
  getAllSecrets,
  getMySecrets,
  getSecretsInFolder,
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

function SecretListContainer({
  match: { params },
  showAll,
  showMine,
  showShared,
}) {
  const metadata = useSelector(state => state.Metadata.metadata);
  const allSecrets = useSelector(getAllSecrets);
  const mySecrets = useSelector(getMySecrets);
  const folders = params.path ? params.path.split('/') : [];
  const folderId = folders[folders.length - 1];
  const folderSecrets = useSelector(state =>
    getSecretsInFolder(state, folderId)
  );
  if (showAll) {
    return <SecretList secrets={allSecrets} showAll />;
  } else if (showMine) {
    return <SecretList secrets={mySecrets} showMine />;
  } else if (showShared) {
    // TODO build actual selector : getSharedSecret
    const secrets = allSecrets;
    return <SecretList secrets={secrets} showShared />;
  }
  const folder = metadata.find(f => f.id === folderId);
  return (
    <SecretList folder={folder} folders={folders} secrets={folderSecrets} />
  );
}
SecretListContainer.propTypes = propTypes;
SecretListContainer.defaultProps = defaultProps;

export default SecretListContainer;
