import React, { Component, PropTypes } from 'react';

import Secret from 'models/Secret';
import User, { UserRights } from 'models/User';
import UserAvatar from 'components/users/UserAvatar';
import Icon from 'components/utilities/Icon';

import MetadataActions from 'actions/MetadataActions';

function accessRightLabel(accessRights) {
  switch (accessRights) {
    case 0:
      return 'Read only';
    case 1:
      return 'Read and write';
    case 2:
      return 'Read, write and share';
    default:
      throw new Error(`Unknown access rights "${accessRights}"`);
  }
}

function SecretUsersItem({ user, isUpdating, onChangeUserRights, onRemoveUserRights }) {
  return (
    <tr className="secret-users-lis-item">
      <td>
        <UserAvatar user={user} size="large" />
      </td>
      <td>
        {user.username}
      </td>
      <td>
        <select
          value={user.rights}
          disable={isUpdating}
          onChange={event => onChangeUserRights(user, event.target.value)}
        >
          {
            UserRights.map(rights =>
              <option key={rights} value={rights}>
                {accessRightLabel(rights)}
              </option>
            )
          }
        </select>
      </td>
      <td>
        <a
          tabIndex={-1}
          className="secret-users-lis-item-action"
          onClick={() => onRemoveUserRights(user)}
        >
          <Icon id="delete" size="small" />
        </a>
      </td>
    </tr>
  );
}
SecretUsersItem.propTypes = {
  user: PropTypes.instanceOf(User),
  isUpdating: PropTypes.bool,
  onChangeUserRights: PropTypes.func.isRequired,
  onRemoveUserRights: PropTypes.func.isRequired,
};

class SecretUsers extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    isUpdating: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onChangeUserRights = this.onChangeUserRights.bind(this);
    this.onRemoveUserRights = this.onRemoveUserRights.bind(this);
  }

  onChangeUserRights(user, rights) {
    MetadataActions.updateSecretUserRights({
      secret: this.props.secret,
      user,
      rights,
    });
  }

  onRemoveUserRights(user) {
    MetadataActions.deleteSecretUserRights({
      secret: this.props.secret,
      user,
    });
  }

  render() {
    return (
      <div className="secret-users">
        <table className="secret-users-list">
          <tbody>
            {
              this.props.secret.users.map(user =>
                <SecretUsersItem
                  key={user.id}
                  user={user}
                  disable={this.props.isUpdating}
                  onChangeUserRights={this.onChangeUserRights}
                  onRemoveUserRights={this.onRemoveUserRights}
                />
              )
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default SecretUsers;
