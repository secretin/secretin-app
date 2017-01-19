import React, { PropTypes } from 'react';

import SecretListItemFolderSecret from 'components/secrets/SecretListItem/Secret';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';

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
              <SecretListBreadcrumb folders={folder.get('breadcrumb')} withTitle={false} />
            </td>
          </tr>
      }
      {
        folder.get('secrets').sortBy(secret => secret.get('title').toLowerCase()).map(secret => (
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
