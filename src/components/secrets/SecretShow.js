import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';
import Immutable from 'immutable';

import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import ShowSecretUIStore from 'stores/ShowSecretUIStore';
import Secret from 'models/Secret';

import SecretEdit from 'components/secrets/SecretEdit';
import WindowsSecretEdit from 'components/secrets/WindowsSecretEdit';
import SecretUserList from 'components/secrets/SecretUserList';
import Modal from 'components/utilities/Modal';
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
  }

  static getStores() {
    return [
      ShowSecretUIStore,
    ];
  }

  static getPropsFromStores() {
    const state = ShowSecretUIStore.getState();
    return {
      secret: state.secret,
      errors: state.errors,
      shown: !!state.secret,
      tab: state.tab,
      isUpdating: state.isUpdating,
    };
  }

  constructor(props) {
    super(props);

    this.handleChangeTab = this.handleChangeTab.bind(this);
  }

  handleChangeTab(tab) {
    ShowSecretUIActions.changeTab({ tab });
  }

  render() {
    if (!this.props.secret) {
      return false;
    }

    return (
      <Modal
        show={this.props.shown}
        onClose={ShowSecretUIActions.hideModal}
      >
        <Modal.Header>
          <Icon id={this.props.secret.getIcon()} size="small" />
          <span className="text" title={this.props.secret.title}>
            {this.props.secret.title}
          </span>
        </Modal.Header>

        <Modal.Body>
          <Tabs
            id="secret-tabs"
            activeKey={this.props.tab}
            onSelect={this.handleChangeTab}
          >
            {
              this.props.secret.type !== 'folder' &&
                <Tab eventKey="details" title="Details">
                  {
                    this.props.secret.type === 'windows' ?
                      <WindowsSecretEdit
                        isUpdating={this.props.isUpdating}
                        secret={this.props.secret}
                      />
                    :
                      <SecretEdit
                        isUpdating={this.props.isUpdating}
                        secret={this.props.secret}
                      />
                  }
                </Tab>
            }
            {
              this.props.secret.type !== 'windows' &&
                <Tab eventKey="access" title="Who has access">
                  <SecretUserList
                    isUpdating={this.props.isUpdating}
                    errors={this.props.errors}
                    secret={this.props.secret}
                  />
                </Tab>
            }
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
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(SecretShow);
