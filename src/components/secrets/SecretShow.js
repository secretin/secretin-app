import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';

import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIStore from 'stores/ShowSecretUIStore';
import EditSecretUIStore from 'stores/EditSecretUIStore';
import AppUIStore from 'stores/AppUIStore';
import Secret from 'models/Secret';

import SecretEdit from 'components/secrets/SecretEdit';
import WindowsSecretEdit from 'components/secrets/WindowsSecretEdit';
import SecretUserList from 'components/secrets/SecretUserList';
import SecretEditableTitle from 'components/secrets/SecretEditableTitle';
import Modal from 'components/utilities/Modal';
import Flash from 'components/utilities/Flash';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';
import { Tabs, Tab } from 'components/utilities/Tabs';

class SecretShow extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    errors: PropTypes.instanceOf(Immutable.Map),
    shown: PropTypes.bool,
    tab: PropTypes.string,
    isUpdating: PropTypes.bool,
    isMetadataUpdating: PropTypes.bool,
    isEditing: PropTypes.bool,
  };

  static getStores() {
    return [ShowSecretUIStore, EditSecretUIStore];
  }

  static getPropsFromStores() {
    const state = ShowSecretUIStore.getState();
    return {
      secret: state.secret,
      errors: state.errors,
      shown: !!state.secret,
      tab: state.tab,
      isUpdating: state.isUpdating,
      isEditing: EditSecretUIStore.getState().get('isEditing'),
    };
  }

  constructor(props) {
    super(props);

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChangeTab(tab) {
    ShowSecretUIActions.changeTab({ tab });
  }

  handleClick() {
    MetadataActions.updateSecret({
      secret: this.props.secret,
      data: EditSecretUIStore.getState().get('data'),
    });
  }

  render() {
    if (!this.props.secret) {
      return false;
    }

    const { username: currentUserId } = AppUIStore.getCurrentUser();
    const users = this.props.secret.users
      .toList()
      .filterNot(user => user.id === currentUserId);

    const canUpdate =
      this.props.secret.canBeUpdatedBy(AppUIStore.getCurrentUser()) &&
      (AppUIStore.isOnline() || users.size === 0);

    return (
      <Modal show={this.props.shown} onClose={ShowSecretUIActions.hideModal}>
        <Modal.Header>
          <Icon id={this.props.secret.getIcon()} size="small" />
          <SecretEditableTitle
            secret={this.props.secret}
            canUpdate={canUpdate}
            isUpdating={this.props.isUpdating}
          />
        </Modal.Header>

        <Modal.Body>
          {this.props.secret.type === 'windows' &&
            <Flash type="info">
              This secret is used for your Windows domain authentication. It
              cannot be deleted.
            </Flash>}
          <Tabs
            id="secret-tabs"
            activeKey={this.props.tab}
            onSelect={this.handleChangeTab}
          >
            {this.props.secret.type !== 'folder' &&
              <Tab eventKey="details" title="Details">
                {this.props.secret.type === 'windows'
                  ? <WindowsSecretEdit isUpdating={this.props.isUpdating} />
                  : <SecretEdit
                      isUpdating={this.props.isUpdating}
                      canUpdate={canUpdate}
                    />}
              </Tab>}

            {this.props.secret.type !== 'windows' &&
              <Tab eventKey="access" title="Who has access">
                <SecretUserList
                  isUpdating={this.props.isUpdating}
                  errors={this.props.errors}
                  secret={this.props.secret}
                />
              </Tab>}
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={ShowSecretUIActions.hideModal}
            disabled={this.props.isUpdating}
          >
            Close
          </Button>
          {this.props.isEditing &&
            <Button
              type="submit"
              buttonStyle="primary"
              onClick={this.handleClick}
              disabled={this.props.isUpdating}
            >
              Save
            </Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(SecretShow);
