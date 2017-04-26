import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import AppUIStore from 'stores/AppUIStore';
import ShortLoginShow from 'components/options/ShortLoginShow';
import QRCodeShow from 'components/options/QRCodeShow';
import ImportKeepassShow from 'components/options/ImportKeepassShow';
import Title from 'components/utilities/Title';
import Checkbox from 'components/utilities/Checkbox';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

import OptionsActions from 'actions/OptionsActions';

import OptionsStore from 'stores/OptionsStore';

class OptionsContainer extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Immutable.Map),
  };

  static getStores() {
    return [OptionsStore];
  }

  static getPropsFromStores() {
    return {
      options: OptionsStore.getOptions(),
    };
  }

  onChangeTimeToClose({ value }) {
    OptionsActions.changeTimeToClose({
      timeToClose: parseInt(value, 10) || 0,
    });
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
                disabled={!AppUIStore.isOnline()}
              >
                Activate two-factor authentication
              </Checkbox>
            </div>

            <div className="options-section-item">
              <ShortLoginShow />
              <Checkbox
                checked={options.get('shortLogin')}
                onChange={OptionsActions.toggleShortLogin}
                disabled={!AppUIStore.isOnline()}
              >
                Activate ShortLogin
              </Checkbox>
            </div>

            <div className="options-section-item">
              <Checkbox
                checked={options.get('timeToClose') > 0}
                onChange={OptionsActions.toggleAutoLogout}
                disabled={!AppUIStore.isOnline()}
              >
                Activate auto logout
              </Checkbox>

              {options.get('timeToClose') > 0 &&
                <div className="options-section-subitem">
                  {'Disconnect me after '}
                  <Input
                    name="timeToClose"
                    label=""
                    size="small"
                    value={options.get('timeToClose')}
                    onChange={this.onChangeTimeToClose}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 60,
                      step: 5,
                    }}
                    debounce={800}
                    disabled={!AppUIStore.isOnline()}
                  />
                  <b> min</b>
                </div>}
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
                disabled={!AppUIStore.isOnline()}
              >
                Import from Keepass
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connectToStores(OptionsContainer);
