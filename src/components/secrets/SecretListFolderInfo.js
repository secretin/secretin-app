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
    <tbody className="secret-list-content-table-body">
      {!folder.root === true && (
        <tr className="secret-list-folder">
          <td colSpan="4" className="secret-list-folder-info">
            <SecretListBreadcrumb
              folders={folder.breadcrumb}
              withTitle={false}
            />
          </td>
        </tr>
      )}
      {secrets.map(secret => (
        <SecretListItemFolderSecret key={secret.id} secret={secret} />
      ))}
    </tbody>
  );
}

SecretListFolderInfo.propTypes = propTypes;

export default SecretListFolderInfo;
