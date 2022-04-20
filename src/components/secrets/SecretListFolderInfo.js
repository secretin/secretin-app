import React from 'react';
import PropTypes from 'prop-types';

import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';

const propTypes = {
  folder: PropTypes.any,
};

function SecretListFolderInfo({ folder }) {
  if (folder.root) return null;
  return (
    <div className="secret-list-folder">
      <div colSpan="4" className="secret-list-folder-info">
        <SecretListBreadcrumb folders={folder.breadcrumb} withTitle={false} />
      </div>
    </div>
  );
}

SecretListFolderInfo.propTypes = propTypes;

export default SecretListFolderInfo;
