import React from 'react';

import * as MetadataActions from 'slices/MetadataSlice';
import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';

import { confirm } from 'components/utilities/Confirm';
import Icon from 'components/utilities/Icon';

import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'components/utilities/Dropdown';

type SecretListItemOptionsProps = {
  secret: any;
  parentFolderId: string;
  folder: any;
};

export const SecretListItemOptions = (props: SecretListItemOptionsProps) => {
  const isOnline = useSelector(state => state.AppUI.online);
  const currentUser = useSelector(state => state.AppUI.currentUser);
  const folder = useSelector(state =>
    state.Metadata.metadata.find(m => m.id === props.parentFolderId)
  );
  const dispatch = useDispatch();

  const handleShow = () => {
    const { secret } = props;
    dispatch(
      ShowSecretUIActions.showSecret({
        secret,
        tab: secret.type === 'folder' ? 'access' : 'details',
      })
    );
  };

  const handleShare = () => {
    const { secret } = props;
    dispatch(ShowSecretUIActions.showSecret({ secret, tab: 'access' }));
  };

  const handleMoveToParent = () => {
    const { parentFolderId: currentFolderId, secret } = props;
    dispatch(
      MetadataActions.removeSecretFromCurrentFolder({
        secret,
        currentFolderId,
      })
    );
  };

  const handleDelete = () => {
    const { secret } = props;
    confirm({
      title: (
        <span>
          Delete <b>{secret.title}</b>?
        </span>
      ),
      text: (
        <span>
          You are about to <b>delete</b> the secret <b>{secret.title}</b>. This
          action is definitive and can&apos;t be recovered.
        </span>
      ),
      acceptLabel: 'Delete the secret',
      cancelLabel: 'Cancel',
      onAccept: () => dispatch(MetadataActions.deleteSecret({ secret })),
      onCancel: () => ({}),
    });
    return true;
  };

  const { parentFolderId, secret } = props;

  const canShare = secret.canBeSharedBy(currentUser);
  if (!canShare && secret.type === 'folder') {
    return null;
  }
  return (
    <Dropdown target={<Icon id="more-vert" size="small" />}>
      <Dropdown.Menu>
        {secret.type !== 'folder' && (
          <Dropdown.Item onClick={handleShow}>Show</Dropdown.Item>
        )}
        {canShare && (
          <Dropdown.Item onClick={handleShare} disabled={!isOnline}>
            Share
          </Dropdown.Item>
        )}

        {(parentFolderId || secret.canBeDeleted()) && (
          <div>
            <Dropdown.Divider />

            {parentFolderId && (
              <Dropdown.Item onClick={handleMoveToParent}>
                Remove from&nbsp;
                <b>{folder.title}</b>
              </Dropdown.Item>
            )}

            {secret.canBeDeleted() && (
              <Dropdown.Item onClick={handleDelete} disabled={!isOnline}>
                Delete
              </Dropdown.Item>
            )}
          </div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
