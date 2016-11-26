import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import ShowSecretUIStore from 'stores/ShowSecretUIStore';
import Secret from 'models/Secret';

import SecretEdit from 'components/secrets/SecretEdit';
import Modal from 'components/utilities/Modal';
import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';
import { Tabs, Tab } from 'components/utilities/Tabs';

class SecretShow extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    shown: PropTypes.bool,
    tab: PropTypes.string,
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
      shown: !!state.secret,
      tab: state.tab,
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
          {this.props.secret.title}
        </Modal.Header>

        <Modal.Body>
          <Tabs
            id="secret-tabs"
            activeKey={this.props.tab}
            onSelect={this.handleChangeTab}
          >
            <Tab eventKey="details" title="Details">
              <SecretEdit secret={this.props.secret} />
            </Tab>

            <Tab eventKey="access" title="Who has access">
              <pre>{JSON.stringify(this.props.secret.users, null, 2)}</pre>
            </Tab>

            <Tab eventKey="settings" title="Settings" disabled>
              Tab 3 content
            </Tab>
          </Tabs>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={ShowSecretUIActions.hideModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(SecretShow);
