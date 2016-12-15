import React, { PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import Immutable from 'immutable';
import Link from 'react-router/Link';
import classNames from 'classnames';

import MetadataActions from 'actions/MetadataActions';

import { buildSecretURL } from 'utils/URLHelper';
import AppUIStore from 'stores/AppUIStore';
import UserAvatars from 'components/users/UserAvatars';
import Icon from 'components/utilities/Icon';

import SecretListItemFolderActions from './Actions';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.instanceOf(Immutable.List),
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
};

function SecretListItemFolder(props) {
  const { secret, folders, isDragging, isOver, connectDragSource, connectDropTarget } = props;
  const currentUser = AppUIStore.getCurrentUser();
  const users = secret.users.toList().filterNot(user => user.id === currentUser.username);

  const className = classNames(
    'secret-list-item',
    {
      'secret-list-item--is-dragging': isDragging,
      'secret-list-item--is-over': isOver,
    }
  );

  return (
    connectDropTarget(
      <tr className={className}>
        <td className="secret-list-item-title">
          {
            connectDragSource(
              <div>
                <Link to={buildSecretURL(folders.push(secret.id))}>
                  <Icon id={secret.getIcon()} size="base" />
                  {secret.title}
                </Link>
              </div>
            )
          }
        </td>
        <td className="secret-list-item-last-modified">
          {secret.lastModifiedAt.fromNow()}
          {' - '}
          <span className="muted">{secret.lastModifiedBy}</span>
        </td>
        <td className="secret-list-item-last-shared-with">
          {
            users.size > 0 ? (
              <UserAvatars users={users} />
            ) : (
              '––'
            )
          }
        </td>
        <td className="secret-list-item-last-actions">
          <SecretListItemFolderActions secret={secret} />
        </td>
      </tr>
    )
  );
}
SecretListItemFolder.propTypes = propTypes;

const itemSource = {
  beginDrag({ secret }) {
    return { secret };
  },
};

const itemTarget = {
  drop(props, monitor) {
    const { secret } = monitor.getItem();
    MetadataActions.moveSecretToFolder({
      secret,
      folder: props.secret,
    });
  },

  canDrop(props, monitor) {
    const { secret } = monitor.getItem();
    return secret.id !== props.secret.id;
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
    isOver: monitor.isOver() && monitor.canDrop(),
  };
}

const SecretListItemFolderSource = new DragSource('SecretListItem', itemSource, itemSourceCollect)(SecretListItemFolder);
const SecretListItemFolderTarget = new DropTarget('SecretListItem', itemTarget, itemTargetCollect)(SecretListItemFolderSource);

export default SecretListItemFolderTarget;
