import React, { Component, PropTypes } from 'react';

import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';
import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import { confirm } from 'components/utilities/Confirm';
import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

class SecretListItemOptions extends Component {
  static propTypes = {
    secret: PropTypes.any,
    parentFolderId: PropTypes.string,
  }

  handleShow = () => {
    const { secret } = this.props;
    ShowSecretUIActions.showSecret({
      secret,
      tab: secret.type === 'folder' ? 'access' : 'details',
    });
  };

  handleShare = () => {
    const { secret } = this.props;
    ShowSecretUIActions.showSecret({ secret, tab: 'access' });
  };

  handleMoveToParent = () => {
    const { parentFolderId: currentFolderId, secret } = this.props;
    MetadataActions.removeSecretFromCurrentFolder({
      secret,
      currentFolderId,
    });
  };

  handleDelete = () => {
    const { secret } = this.props;
    confirm({
      title: <span>Delete <b>{secret.title}</b>?</span>,
      text: (
        <span>
          You are about to <b>delete</b> the secret <b>{secret.title}</b>. This action is definitive and can't be recovered.
        </span>
      ),
      acceptLabel: 'Delete the secret',
      cancelLabel: 'Cancel',
      onAccept: () => MetadataActions.deleteSecret({ secret }),
      onCancel: () => ({}),
    });
    return true;
  };

  render() {
    const { parentFolderId, secret } = this.props;
    const currentUser = AppUIStore.getCurrentUser();
    const folder = MetadataStore.getById(parentFolderId);
    const canShare = secret.canBeSharedBy(currentUser);
    if (!canShare && secret.type === 'folder') {
      return null;
    }
    return (
      <Dropdown id="secret-action" pullRight>
        <Dropdown.Toggle>
          <Icon id="more-vert" size="small" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {secret.type !== 'folder' &&
            <Dropdown.MenuItem onSelect={this.handleShow}>
              Show
            </Dropdown.MenuItem>}
          {canShare &&
            <Dropdown.MenuItem
              onSelect={this.handleShare}
              disabled={!AppUIStore.isOnline()}
            >
              Share
            </Dropdown.MenuItem>}

          {(parentFolderId || secret.canBeDeleted()) &&
            <div>
              <Dropdown.MenuItem divider />

              {parentFolderId &&
                <Dropdown.MenuItem onSelect={this.handleMoveToParent}>
                  Remove from <b>{folder.title}</b>
                </Dropdown.MenuItem>}

              {secret.canBeDeleted() &&
                <Dropdown.MenuItem
                  onSelect={this.handleDelete}
                  disabled={!AppUIStore.isOnline()}
                >
                  Delete
                </Dropdown.MenuItem>}
            </div>}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SecretListItemOptions;
