import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as MetadataActions from 'slices/MetadataSlice';
import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';

import { confirm } from 'components/utilities/Confirm';
// import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

import { Dropdown } from 'react-bootstrap';

class SecretListItemOptions extends Component {
  static propTypes = {
    secret: PropTypes.any,
    parentFolderId: PropTypes.string,
    folder: PropTypes.object,
    currentUser: PropTypes.object,
    isOnline: PropTypes.bool,
    dispatch: PropTypes.func,
  };

  handleShow = () => {
    const { secret } = this.props;
    this.props.dispatch(
      ShowSecretUIActions.showSecret({
        secret,
        tab: secret.type === 'folder' ? 'access' : 'details',
      })
    );
  };

  handleShare = () => {
    const { secret } = this.props;
    this.props.dispatch(
      ShowSecretUIActions.showSecret({ secret, tab: 'access' })
    );
  };

  handleMoveToParent = () => {
    const { parentFolderId: currentFolderId, secret } = this.props;
    this.props.dispatch(
      MetadataActions.removeSecretFromCurrentFolder({
        secret,
        currentFolderId,
      })
    );
  };

  handleDelete = () => {
    const { secret } = this.props;
    confirm({
      title: (
        <span>
          Delete <b>{secret.title}</b>?
        </span>
      ),
      text: (
        <span>
          You are about to <b>delete</b> the secret <b>{secret.title}</b>. This
          action is definitive and can&apos;t be recovered.
        </span>
      ),
      acceptLabel: 'Delete the secret',
      cancelLabel: 'Cancel',
      onAccept: () =>
        this.props.dispatch(MetadataActions.deleteSecret({ secret })),
      onCancel: () => ({}),
    });
    return true;
  };

  render() {
    const { parentFolderId, secret, currentUser, folder } = this.props;

    const canShare = secret.canBeSharedBy(currentUser);
    if (!canShare && secret.type === 'folder') {
      return null;
    }
    return (
      <Dropdown id="secret-action" pullRight>
        <Dropdown.Toggle>
          {/* <Icon id="more-vert" size="small" /> */}
          Fuuu
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
          {/* {secret.type !== 'folder' && (
            <Dropdown.Item onSelect={this.handleShow}>Show</Dropdown.Item>
          )}
          {canShare && (
            <Dropdown.Item
              as="button"
              onSelect={this.handleShare}
              disabled={!this.props.isOnline}
            >
              Share
            </Dropdown.Item>
          )}

          {(parentFolderId || secret.canBeDeleted()) && (
            <div>
              <Dropdown.Divider />

              {parentFolderId && (
                <Dropdown.Item as="button" onSelect={this.handleMoveToParent}>
                  Remove from&nbsp;
                  <b>{folder.title}</b>
                </Dropdown.Item>
              )}

              {secret.canBeDeleted() && (
                <Dropdown.Item
                  as="button"
                  onSelect={this.handleDelete}
                  disabled={!this.props.isOnline}
                >
                  Delete
                </Dropdown.Item>
              )}
            </div>
          )} */}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { online, currentUser } = state.AppUI;
  const { metadata } = state.Metadata;
  return {
    isOnline: online,
    currentUser,
    folder: metadata.find(m => m.id === ownProps.parentFolderId),
  };
};

export default connect(mapStateToProps)(SecretListItemOptions);
