import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import Secret from 'models/Secret';
import MetadataActions from 'actions/MetadataActions';
import AppUIStore from 'stores/AppUIStore';

import SecretUserListItem from './SecretUserListItem';
import SecretUserListNew from './SecretUserListNew';

function getDisabledReason(cantShare, isCurrentUser) {
  if (cantShare) {
    return "You dn't have the permission to share this secret";
  } else if (isCurrentUser) {
    return "You can't modify or remove yourself";
  }
  return null;
}

class SecretUserList extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    errors: PropTypes.instanceOf(Immutable.Map),
    isUpdating: PropTypes.bool,
  };

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
    const currentUser = AppUIStore.getCurrentUser();
    const canShare =
      this.props.secret.canBeSharedBy(currentUser) && AppUIStore.isOnline();
    return (
      <div className="secret-users">
        <div className="secret-users-list">
          {this.props.secret.users
            .map(user => (
              <SecretUserListItem
                key={user.id}
                user={user}
                disabled={
                  !canShare ||
                  currentUser.username === user.id ||
                  this.props.isUpdating
                }
                disabledReason={getDisabledReason(
                  !canShare,
                  currentUser.username === user.id
                )}
                onChangeUserRights={this.onChangeUserRights}
                onRemoveUserRights={this.onRemoveUserRights}
              />
            ))
            .toArray()}
        </div>
        {canShare && (
          <SecretUserListNew
            secret={this.props.secret}
            errors={this.props.errors}
          />
        )}
      </div>
    );
  }
}

export default SecretUserList;
