import React from 'react';
import { useSelector } from 'react-redux';
import store from 'stores/store';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import * as MetadataActions from 'slices/MetadataSlice';

import { buildSecretURL } from 'utils/URLHelper';

import UserAvatars from 'components/users/UserAvatars';
import Icon from 'components/utilities/Icon';

import SecretListItemOptions from './Options';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.array,
  isDragging: PropTypes.bool,
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
};

function SecretListItemFolder(props) {
  const { secret, folders, isDragging, canDrop, isOver } = props;
  const { connectDragSource, connectDropTarget } = props;

  const currentUser = useSelector(state => state.AppUI.currentUser);
  const isOnline = useSelector(state => state.AppUI.online);

  const secretRights = secret.users.find(
    user => user.id === currentUser.username
  ).rights;
  const users = secret.users.filter(user => user.id !== currentUser.username);

  const className = classNames('secret-list-item', {
    'secret-list-item--is-dragging': isDragging,
    'secret-list-item--is-over': isOver,
    'secret-list-item--can-drop': canDrop,
    'secret-list-item--cant-drop': !canDrop,
  });

  const link = (
    <div>
      <Link to={buildSecretURL([...folders, secret.id])}>
        <Icon id={secret.getIcon()} size="base" />
        <span className="text" title={secret.title}>
          {secret.title}
        </span>
      </Link>
    </div>
  );

  return connectDropTarget(
    <tr className={className}>
      <td className="secret-list-item-column secret-list-item-column--title">
        {secretRights > 0 && (isOnline || users.size === 0)
          ? connectDragSource(link)
          : link}
      </td>
      <td className="secret-list-item-column secret-list-item-column--last-modified">
        {secret.lastModifiedAt.fromNow()}
        {' - '}
        <span className="muted">{secret.lastModifiedBy}</span>
      </td>
      <td className="secret-list-item-column secret-list-item-column--shared-with">
        {users.size > 0 ? <UserAvatars users={users} /> : '––'}
      </td>
      <td className="secret-list-item-column secret-list-item-column--actions">
        <SecretListItemOptions
          parentFolderId={folders[folders.length - 1]}
          secret={secret}
        />
      </td>
    </tr>
  );
}
SecretListItemFolder.propTypes = propTypes;

const itemSource = {
  beginDrag({ secret }) {
    return { secret };
  },
};

const itemTarget = {
  drop({ secret: folder }, monitor) {
    const { secret } = monitor.getItem();
    MetadataActions.addSecretToFolder({ secret, folder });
  },

  canDrop({ secret: targetSecret }, monitor) {
    const { username: currentUserId } = store.getState().AppUI.currentUser;
    const { secret: draggedSecret } = monitor.getItem();

    return (
      draggedSecret.users.find(user => user.id === currentUserId).rights !==
        0 &&
      targetSecret.type === 'folder' &&
      targetSecret.id !== draggedSecret.id &&
      targetSecret.users.find(user => user.id === currentUserId).rights !== 0
    );
  },
};

function itemSourceCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function itemTargetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver(),
  };
}

const SecretListItemFolderSource = new DragSource(
  'SecretListItem',
  itemSource,
  itemSourceCollect
)(SecretListItemFolder);
const SecretListItemFolderTarget = new DropTarget(
  'SecretListItem',
  itemTarget,
  itemTargetCollect
)(SecretListItemFolderSource);

export default SecretListItemFolderTarget;
