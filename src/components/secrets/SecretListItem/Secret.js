import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import classNames from 'classnames';

import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';

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
  const currentUser = useSelector(state => state.AppUI.currentUser);
  const isOnline = useSelector(state => state.AppUI.online);
  const dispatch = useDispatch();

  const users = secret.users.filter(user => user.id !== currentUser.username);

  const secretRights =
    secret.users.find(user => user.id === currentUser.username)?.rights || 0;
  const className = classNames('secret-list-item', {
    'secret-list-item--is-dragging': isDragging,
  });

  const link = (
    <div>
      <a
        onClick={() => dispatch(ShowSecretUIActions.showSecret({ secret }))}
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
    <div className={className}>
      <div className="secret-list-item-column secret-list-item-column--title">
        {secretRights > 0 && (isOnline || users.length === 0)
          ? connectDragSource(link)
          : link}
      </div>
      <div className="secret-list-item-column secret-list-item-column--last-modified">
        {secret.lastModifiedAt.fromNow()}
        {' - '}
        <span className="muted">{secret.lastModifiedBy}</span>
      </div>
      <div className="secret-list-item-column secret-list-item-column--shared-with">
        {users.length > 0 ? <UserAvatars users={users} /> : '––'}
      </div>
      <div className="secret-list-item-column secret-list-item-column--actions">
        <SecretListItemOptions
          parentFolderId={parentFolderId}
          secret={secret}
        />
      </div>
    </div>
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
