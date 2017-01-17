import React from 'react';

import MetadataActions from 'actions/MetadataActions';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

function SecretListRefresh() {
  return (
    <div className="secret-list-refresh">
      <Button
        title="Refresh secret list"
        buttonStyle="icon"
        onClick={MetadataActions.loadMetadata}
      >
        <Icon id="refresh" />
      </Button>
    </div>
  );
}

export default SecretListRefresh;
