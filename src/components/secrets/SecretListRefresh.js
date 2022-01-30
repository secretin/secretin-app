import React from 'react';
import { useDispatch } from 'react-redux';

import * as MetadataActions from 'slices/MetadataSlice';

import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

function SecretListRefresh() {
  const dispatch = useDispatch();
  return (
    <div className="secret-list-refresh">
      <Button
        title="Refresh secret list"
        buttonStyle="icon"
        onClick={() => dispatch(MetadataActions.loadMetadata())}
      >
        <Icon id="refresh" />
      </Button>
    </div>
  );
}

export default SecretListRefresh;
