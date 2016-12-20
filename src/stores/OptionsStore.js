import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import AppUIActions from 'actions/AppUIActions';
import OptionsActions from 'actions/OptionsActions';

const OptionsState = new Record({
  options: new Immutable.Map(),
  errors: new Immutable.Map(),
  showQRCode: false,
});

class OptionsStore {
  constructor() {
    this.bindAction(AppUIActions.LOGIN_USER_SUCCESS, this.onLoadOptions);
    this.bindActions(OptionsActions);

    this.state = new OptionsState();
  }

  onLoadOptions({ currentUser }) {
    const options = currentUser.options;
    options.totp = currentUser.totp;

    this.setState(this.state
      .set('options', new Immutable.Map(options))
    );
  }

  onToggleTotp(showQRCode) {
    this.setState(this.state
      .set('showQRCode', showQRCode)
    );
  }

  onHideQRCode() {
    this.setState(
      this.state.merge({
        showQRCode: false,
        errors: new Immutable.Map(),
      }));
  }

  onActivateTotpFailure() {
    this.setState(
      this.state
      .set('errors', new Immutable.Map({ totp: 'Not synchronised' })),
    );
  }

  onActivateTotpSuccess() {
    this.setState(
      this.state.merge({
        showQRCode: false,
        errors: new Immutable.Map(),
        options: this.state.options.set('totp', true),
      }));
  }

  onDeactivateTotpSuccess() {
    this.setState(this.state
      .set('options', this.state.options.set('totp', false))
    );
  }

  static getOptions() {
    return this.getState().get('options');
  }

}

export default alt.createStore(
  makeImmutable(OptionsStore),
  'OptionsStore'
);
