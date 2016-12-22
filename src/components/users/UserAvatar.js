import React, { PropTypes } from 'react';
import classNames from 'classnames';
import User from 'models/User';

const COLORS = [
  'green-sea',
  'nephritis',
  'belize-hole',
  'wisteria',
  'midnight-blue',
  'orange',
  'pumpkin',
  'pomegranate',
  'silver',
  'asbestos',
];

function getInitials(fullName) {
  const names = fullName.split(' ');

  if (names.length > 1) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }

  return fullName.substring(0, 2).toUpperCase();
}

function getAvatarColor(fullName) {
  const colorIndex = fullName.split('').reduce((sum, letter) => sum + letter.charCodeAt(), 0);
  return COLORS[colorIndex % COLORS.length];
}

const propTypes = {
  user: PropTypes.instanceOf(User),
  size: PropTypes.oneOf([
    'base',
    'large',
  ]),
};

const defaultProps = {
  size: 'base',
};

function UserAvatar({ user, size }) {
  const color = getAvatarColor(user.username);
  const className = classNames(
    'user-avatar',
    `user-avatar--color-${color}`,
    `user-avatar--size-${size}`
  );

  return (
    <div
      className={className}
      title={user.username}
    >
      {getInitials(user.username)}
    </div>
  );
}
UserAvatar.propTypes = propTypes;
UserAvatar.defaultProps = defaultProps;

export default UserAvatar;
