import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import classNames from 'classnames';

import UserAvatar from 'components/users/UserAvatar';

const propTypes = {
  users: PropTypes.instanceOf(Immutable.List),
  size: PropTypes.string,
};

const defaultProps = {
  size: 'base',
};

function UserAvatars({ users, size }) {
  const className = classNames(
    'user-avatars',
    `user-avatars--size-${size}`,
  );

  return (
    <div className={className}>
      {
        users.map(user => (
          <UserAvatar
            key={user.id}
            user={user}
            size={size}
          />
        )).toArray()
      }
    </div>
  );
}
UserAvatars.propTypes = propTypes;
UserAvatars.defaultProps = defaultProps;

export default UserAvatars;
