import React from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import Immutable from 'immutable';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import MetadataActions from 'actions/MetadataActions';

import { buildSecretURL } from 'utils/URLHelper';
import AppUIStore from 'stores/AppUIStore';
import UserAvatars from 'components/users/UserAvatars';
import Icon from 'components/utilities/Icon';

import SecretListItemOptions from './Options';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.instanceOf(Immutable.List),
  isDragging: PropTypes.bool,
  canDrop: PropTypes.bool,
  isOver: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
};

function SecretListItemFolder(props) {
  const { secret, folders, isDragging, canDrop, isOver } = props;
  const { connectDragSource, connectDropTarget } = props;

  const currentUser = AppUIStore.getCurrentUser();
  const secretRights = secret.getIn(['users', currentUser.username, 'rights']);
  const users = secret.users
    .toList()
    .filterNot(user => user.id === currentUser.username);

  const className = classNames('secret-list-item', {
    'secret-list-item--is-dragging': isDragging,
    'secret-list-item--is-over': isOver,
    'secret-list-item--can-drop': canDrop,
    'secret-list-item--cant-drop': !canDrop,
  });

  const link = (
    <div>
      <Link to={buildSecretURL(folders.push(secret.id))}>
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
        {secretRights > 0 && (AppUIStore.isOnline() || users.size === 0)
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
          parentFolderId={folders.last()}
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
    const { username: currentUserId } = AppUIStore.getCurrentUser();
    const { secret: draggedSecret } = monitor.getItem();

    return (
      draggedSecret.getIn(['users', currentUserId, 'rights']) !== 0 &&
      targetSecret.type === 'folder' &&
      targetSecret.id !== draggedSecret.id &&
      targetSecret.getIn(['users', currentUserId, 'rights']) !== 0
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
