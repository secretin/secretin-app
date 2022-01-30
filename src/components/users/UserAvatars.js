import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import UserAvatar from 'components/users/UserAvatar';

const propTypes = {
  users: PropTypes.array,
  size: PropTypes.string,
};

const defaultProps = {
  size: 'base',
};

function UserAvatars({ users, size }) {
  const className = classNames('user-avatars', `user-avatars--size-${size}`);

  return (
    <div className={className}>
      {users.map(user => (
        <UserAvatar key={user.id} user={user} size={size} />
      ))}
    </div>
  );
}
UserAvatars.propTypes = propTypes;
UserAvatars.defaultProps = defaultProps;

export default UserAvatars;
