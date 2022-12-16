import React from 'react';
import PropTypes from 'prop-types';

import User, { UserRights, userRightLabel } from 'models/User';
import UserAvatar from 'components/users/UserAvatar';
import Select from 'components/utilities/Select';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

const propTypes = {
  user: PropTypes.instanceOf(User),
  disabled: PropTypes.bool,
  disabledReason: PropTypes.string,
  onChangeUserRights: PropTypes.func.isRequired,
  onRemoveUserRights: PropTypes.func.isRequired,
  intl: PropTypes.object,
};

function SecretUserListItem(props) {
  const {
    user,
    disabled,
    disabledReason,
    onChangeUserRights,
    onRemoveUserRights,
    intl,
  } = props;

  return (
    <div className="secret-users-list-item">
      <div className="secret-users-list-item-infos">
        <UserAvatar user={user} size="large" />
        {user.username}
      </div>

      <div className="secret-users-list-item-actions">
        <Select
          value={user.rights}
          options={UserRights.map(rights => [
            rights,
            intl.formatMessage({ id: userRightLabel(rights) }),
          ])}
          size="small"
          disabled={disabled}
          title={disabledReason}
          onChange={({ value }) => onChangeUserRights(user, value)}
        />
        <Button
          buttonStyle="icon"
          onClick={() => onRemoveUserRights(user)}
          disabled={disabled}
          title={disabledReason}
          size="small"
          iconOnly
        >
          <Icon id="close" />
        </Button>
      </div>
    </div>
  );
}
SecretUserListItem.propTypes = propTypes;

export default SecretUserListItem;
