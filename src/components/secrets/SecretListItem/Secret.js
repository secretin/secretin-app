import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';

import AppUIStore from 'stores/AppUIStore';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import UserAvatars from 'components/users/UserAvatars';

import Icon from 'components/utilities/Icon';

import SecretListItemOptions from './Options';

const propTypes = {
  secret: PropTypes.any,
  parentFolderId: PropTypes.string,
  isDragging: PropTypes.bool,
  connectDragSource: PropTypes.func.isRequired,
};

function SecretListItemSecret({
  secret,
  parentFolderId,
  isDragging,
  connectDragSource,
}) {
  const currentUser = AppUIStore.getCurrentUser();
  const users = secret.users
    .toList()
    .filterNot(user => user.id === currentUser.username);

  const secretRights = secret.getIn(['users', currentUser.username, 'rights']);
  const className = classNames('secret-list-item', {
    'secret-list-item--is-dragging': isDragging,
  });

  const link = (
    <div>
      <a
        onClick={() => ShowSecretUIActions.showSecret({ secret })}
        tabIndex="-1"
      >
        <Icon id={secret.getIcon()} size="base" />
        <span className="text" title={secret.title}>
          {secret.title}
        </span>
      </a>
    </div>
  );

  return (
    <tr className={className}>
      <td className="secret-list-item-column secret-list-item-column--title">
        {secretRights > 0 && (AppUIStore.isOnline() || users.size === 0)
          ? connectDragSource(link)
          : link}
      </td>
      <td className="secret-list-item-column secret-list-item-column--last-modified">
        {secret.lastModifiedAt.fromNow()}
        {' - '}
        <span className="muted">
          {secret.lastModifiedBy}
        </span>
      </td>
      <td className="secret-list-item-column secret-list-item-column--shared-with">
        {users.size > 0 ? <UserAvatars users={users} /> : '––'}
      </td>
      <td className="secret-list-item-column secret-list-item-column--actions">
        <SecretListItemOptions
          parentFolderId={parentFolderId}
          secret={secret}
        />
      </td>
    </tr>
  );
}
SecretListItemSecret.propTypes = propTypes;

const cardSource = {
  beginDrag({ secret }) {
    return {
      secret,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default new DragSource('SecretListItem', cardSource, collect)(
  SecretListItemSecret
);
