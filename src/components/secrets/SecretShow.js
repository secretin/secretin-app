import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';
import * as MetadataActions from 'slices/MetadataSlice';

import Secret from 'models/Secret';

import SecretEdit from 'components/secrets/SecretEdit';
import SecretShowHeader from 'components/secrets/SecretShowHeader';
import SecretHistory from 'components/secrets/SecretHistory';
import WindowsSecretEdit from 'components/secrets/WindowsSecretEdit';
import SecretUserList from 'components/secrets/SecretUserList';
import Modal from 'components/utilities/Modal';
import Flash from 'components/utilities/Flash';
import Button from 'components/utilities/Button';
import { Tabs, Tab } from 'components/utilities/Tabs';

class SecretShow extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    errors: PropTypes.object,
    shown: PropTypes.bool,
    tab: PropTypes.string,
    isUpdating: PropTypes.bool,
    isMetadataUpdating: PropTypes.bool,
    isEditing: PropTypes.bool,
    data: PropTypes.object,
    currentUser: PropTypes.object,
    isOnline: PropTypes.bool,
    showSecretActions: PropTypes.object,
    metadataActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleChangeTab = this.handleChangeTab.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChangeTab(tab) {
    this.props.showSecretActions.changeTab({ tab });
  }

  handleClick() {
    this.props.metadataActions.updateSecret({
      secret: this.props.secret,
      data: this.props.data,
    });
  }

  render() {
    if (!this.props.secret) {
      return false;
    }

    const { username: currentUserId } = this.props.currentUser;
    const users = this.props.secret.users.filter(
      user => user.id !== currentUserId
    );

    const canUpdate =
      this.props.secret.canBeUpdatedBy(this.props.currentUser) &&
      (this.props.isOnline || users.length === 0);

    return (
      <Modal
        show={this.props.shown}
        onClose={this.props.showSecretActions.hideModal}
      >
        <Modal.Header>
          <SecretShowHeader
            icon={this.props.secret.getIcon()}
            title={this.props.secret.title}
            canEditTitle={canUpdate}
            isUpdating={this.props.isUpdating}
            onEditTitle={newTitle => {
              setTimeout(() => {
                this.props.metadataActions.renameSecret({
                  secret: this.props.secret,
                  newTitle,
                });
              });
            }}
          />
        </Modal.Header>

        <Modal.Body>
          {this.props.secret.type === 'windows' && (
            <Flash type="info">
              This secret is used for your Windows domain authentication. It
              cannot be deleted.
            </Flash>
          )}
          <Tabs
            id="secret-tabs"
            activeKey={this.props.tab}
            onSelect={this.handleChangeTab}
          >
            {this.props.secret.type !== 'folder' && (
              <Tab eventKey="details" title="Details">
                {this.props.secret.type === 'windows' ? (
                  <WindowsSecretEdit isUpdating={this.props.isUpdating} />
                ) : (
                  <SecretEdit
                    isUpdating={this.props.isUpdating}
                    canUpdate={canUpdate}
                    data={this.props.secret.fields}
                  />
                )}
              </Tab>
            )}

            {this.props.secret.type !== 'windows' && (
              <Tab eventKey="access" title="Who has access">
                <SecretUserList
                  isUpdating={this.props.isUpdating}
                  errors={this.props.errors}
                  secret={this.props.secret}
                />
              </Tab>
            )}

            {this.props.secret?.history?.length > 1 && (
              <Tab eventKey="history" title="History">
                <SecretHistory />
              </Tab>
            )}
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={this.props.showSecretActions.hideModal}
            disabled={this.props.isUpdating}
          >
            Close
          </Button>
          {this.props.isEditing && (
            <Button
              type="submit"
              buttonStyle="primary"
              onClick={this.handleClick}
              disabled={this.props.isUpdating}
            >
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  showSecretActions: bindActionCreators(ShowSecretUIActions, dispatch),
  metadataActions: bindActionCreators(MetadataActions, dispatch),
});

const mapStateToProps = state => {
  const { secret, errors, tab, isUpdating } = state.ShowSecretUI;
  const { isEditing, data } = state.EditSecretUI;
  const { currentUser, online } = state.AppUI;
  return {
    secret,
    shown: !!secret,
    errors,
    tab,
    isUpdating,
    isEditing,
    data,
    currentUser,
    isOnline: online,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SecretShow);
