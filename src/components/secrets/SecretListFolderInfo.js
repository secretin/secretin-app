import React from 'react';
import PropTypes from 'prop-types';

import SecretListItemFolderSecret from 'components/secrets/SecretListItem/Secret';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';

const propTypes = {
  folder: PropTypes.any,
};

function SecretListFolderInfo({ folder }) {
  const secrets = Object.values(folder.secrets);
  secrets.sort((a, b) => {
    if (a.title === null) return 1;
    if (b.title === null) return -1;
    return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  });
  return (
    <div className="secret-list-content-table-body">
      {!folder.root === true && (
        <div className="secret-list-folder">
          <div colSpan="4" className="secret-list-folder-info">
            <SecretListBreadcrumb
              folders={folder.breadcrumb}
              withTitle={false}
            />
          </div>
        </div>
      )}
      {secrets.map(secret => (
        <SecretListItemFolderSecret key={secret.id} secret={secret} />
      ))}
    </div>
  );
}

SecretListFolderInfo.propTypes = propTypes;

export default SecretListFolderInfo;
