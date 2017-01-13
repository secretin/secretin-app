import React, { PropTypes } from 'react';

import SecretListItemFolderSecret from 'components/secrets/SecretListItem/Secret';

const propTypes = {
  folder: PropTypes.any,
};

function SecretListFolderInfo({ folder }) {
  return (
    <tbody className="secret-list-content-table-body">
      {
        !folder.has('root') &&
          <tr className="secret-list-folder">
            <td colSpan="4" className="secret-list-folder-info">
              {folder.get('name')}
            </td>
          </tr>
      }
      {
        folder.get('secrets').map(secret => (
          <SecretListItemFolderSecret
            key={secret.id}
            secret={secret}
          />
        )).toArray()
      }
    </tbody>
  );
}

SecretListFolderInfo.propTypes = propTypes;

export default SecretListFolderInfo;
