import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import ShortLoginShow from 'components/options/ShortLoginShow';
import QRCodeShow from 'components/options/QRCodeShow';
import RescueCodes from 'components/options/RescueCodesShow';
import ImportKeepassShow from 'components/options/ImportKeepassShow';
import Title from 'components/utilities/Title';
import Checkbox from 'components/utilities/Checkbox';
import Button from 'components/utilities/Button';

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
    const { options } = this.props;

    return (
      <div className="page">
        <div className="page-header">
          <div className="breadcrumb">
            <Title link="/options/" icon="gear" title="Options" />
          </div>
        </div>

        <div className="page-content options">
          <div className="options-section">
            <h3 className="options-section-title">
              Security
            </h3>

            <div className="options-section-item">
              <QRCodeShow />
              <Checkbox
                checked={options.get('totp')}
                onChange={OptionsActions.toggleTotp}
              >
                Activate two-factor authentication
              </Checkbox>
              {
                options.get('totp') &&
                  <div style={{ marginLeft: '33px' }}>
                    <RescueCodes />
                    <a
                      onClick={() => { OptionsActions.showRescueCodes(); }}
                      tabIndex="-1"
                    >
                      Show rescue Codes
                    </a>
                  </div>
              }
            </div>

            <div className="options-section-item">
              <ShortLoginShow />
              <Checkbox
                checked={options.get('shortLogin')}
                onChange={OptionsActions.toggleShortLogin}
              >
                Activate ShortLogin
              </Checkbox>
            </div>
          </div>
          <div className="options-section">
            <h3 className="options-section-title">
              Imports
            </h3>
            <div className="options-section-item">
              <ImportKeepassShow />
              <Button
                type="button"
                buttonStyle="primary"
                onClick={OptionsActions.showImportKeepass}
              >
                Import from Keepass
              </Button>
              {/* Keepass :
              <input
                type="file"
                id="input"
                onChange={this.handleChangeKeepass}
              />
              <Button
                type="button"
                buttonStyle="primary"
                disabled={isEmpty(this.state.keepass)}
                onClick={() => {
                  OptionsActions.importKeepass(this.state.keepass);
                }}
              >
                Import
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connectToStores(OptionsContainer);
