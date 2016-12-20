import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import QRCodeShow from 'components/QRCodeShow';
import Title from 'components/utilities/Title';
import BootstrapPanel from 'react-bootstrap/lib/Panel';
import Checkbox from 'components/utilities/Checkbox';

import OptionsActions from 'actions/OptionsActions';

import OptionsStore from 'stores/OptionsStore';

class OptionsContainer extends Component {

  static propTypes = {
    options: PropTypes.instanceOf(Immutable.Map),
  }

  static getStores() {
    return [
      OptionsStore,
    ];
  }

  static getPropsFromStores() {
    return {
      options: OptionsStore.getOptions(),
    };
  }

  render() {
    const options = this.props.options;
    return (
      <div className="secret-list-container">
        <div className="secret-list">
          <div className="secret-list-header">
            <div className="secret-list-breadcrumb">
              <Title link="/options/" icon="gear" title="Options" />
            </div>
          </div>
          <QRCodeShow />
          <div className="secret-list-content">
            <BootstrapPanel
              header={(<h3>Security</h3>)}
            >
              <Checkbox
                checked={options.get('totp')}
                onChange={OptionsActions.toggleTotp}
              >
                Activate TOTP
              </Checkbox>
            </BootstrapPanel>
          </div>
        </div>
      </div>
    );
  }
}
export default connectToStores(OptionsContainer);
