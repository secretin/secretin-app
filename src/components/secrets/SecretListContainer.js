import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import SecretList from 'components/secrets/SecretList';

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
  // TODO : better selectors
  // Currently this is mocked
  const getAllSecrets = () =>
    metadata.filter(secret => secret.type !== 'folder') || [];
  if (showAll) {
    const secrets = getAllSecrets();

    return <SecretList secrets={secrets} showAll />;
  } else if (showMine) {
    // TODO build actual selector : getMySecret
    const secrets = getAllSecrets();
    return <SecretList secrets={secrets} showMine />;
  } else if (showShared) {
    // TODO build actual selector : getSharedSecret
    const secrets = getAllSecrets();
    return <SecretList secrets={secrets} showShared />;
  }

  const path = params.path ? params.path.split('/') : [];
  const folders = new Immutable.List(path);
  const folderId = folders.last();
  const folder = metadata[folderId];
  // TODO build actual selector : getSecretsInFolder(folderId)
  const secrets = getAllSecrets();

  return <SecretList folder={folder} folders={folders} secrets={secrets} />;
}
SecretListContainer.propTypes = propTypes;
SecretListContainer.defaultProps = defaultProps;

export default SecretListContainer;
