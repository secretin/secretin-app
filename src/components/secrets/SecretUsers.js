import React, { Component, PropTypes } from 'react';

import Secret from 'models/Secret';
import User from 'models/User';
import UserAvatar from 'components/users/UserAvatar';

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

function SecretUsersItem({ user }) {
  return (
    <tr className="secret-users-lis-item">
      <td>
        <UserAvatar user={user} size="large" />
      </td>
      <td>
        {user.username}
      </td>
      <td>
        {accessRightLabel(user.rights)}
      </td>
      <td>
        Actions
      </td>
    </tr>
  );
}
SecretUsersItem.propTypes = {
  user: PropTypes.instanceOf(User),
};

class SecretUsers extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
  }

  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove() {

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
