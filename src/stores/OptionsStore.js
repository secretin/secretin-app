import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';
import secretin from 'utils/secretin';

import AppUIActions from 'actions/AppUIActions';
import OptionsActions from 'actions/OptionsActions';

const OptionsState = new Record({
  options: new Immutable.Map(),
  errors: new Immutable.Map(),
  showQRCode: false,
  showShortLogin: false,
  loading: false,
  import: Immutable.fromJS({
    keepass: {
      shown: false,
      importing: false,
      importStatus: 0,
      importTotal: 0,
      success: false,
      errors: new Immutable.Map(),
    },
  }),
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
    options.shortLogin = secretin.canITryShortLogin();

    this.setState(this.state
      .set('options', new Immutable.Map(options))
    );
  }

  onActivateTotp() {
    this.setState(this.state
      .set('loading', true)
    );
  }

  onActivateShortLogin() {
    this.setState(this.state
      .set('loading', true)
    );
  }

  onToggleTotp(showQRCode) {
    this.setState(this.state
      .set('showQRCode', showQRCode)
    );
  }

  onToggleShortLogin(showShortLogin) {
    this.setState(this.state
      .set('showShortLogin', showShortLogin)
    );
  }

  onShowImportKeepass() {
    this.setState(this.state
      .setIn(['import', 'keepass', 'shown'], true)
      .setIn(['import', 'keepass', 'importing'], false)
      .setIn(['import', 'keepass', 'success'], false)
      .setIn(['import', 'keepass', 'errors'], new Immutable.Map())
    );
  }

  onHideImportKeepass() {
    this.setState(this.state
      .setIn(['import', 'keepass', 'shown'], false)
      .setIn(['import', 'keepass', 'importing'], false)
      .setIn(['import', 'keepass', 'success'], false)
      .setIn(['import', 'keepass', 'errors'], new Immutable.Map())
    );
  }

  onImportKeepass() {
    this.setState(this.state
      .setIn(['import', 'keepass', 'importing'], true)
      .setIn(['import', 'keepass', 'success'], false)
      .setIn(['import', 'keepass', 'errors'], new Immutable.Map())
    );
  }

  onImportKeepassProgress({ importStatus, importTotal }) {
    this.setState(this.state
      .setIn(['import', 'keepass', 'importStatus'], importStatus)
      .setIn(['import', 'keepass', 'importTotal'], importTotal)
    );
  }

  onImportKeepassSuccess() {
    this.setState(this.state
      .setIn(['import', 'keepass', 'importing'], false)
      .setIn(['import', 'keepass', 'success'], true)
      .setIn(['import', 'keepass', 'errors'], new Immutable.Map())
    );
  }

  onImportKeepassFailure({ error }) {
    this.setState(this.state
      .setIn(['import', 'keepass', 'importing'], false)
      .setIn(['import', 'keepass', 'success'], false)
      .setIn(['import', 'keepass', 'errors'], new Immutable.Map(error))
    );
  }

  onActivateTotpFailure({ error }) {
    this.setState(
      this.state.merge({
        errors: new Immutable.Map({ totp: error }),
        loading: false,
      }));
  }

  onHideQRCode() {
    this.setState(
      this.state.merge({
        showQRCode: false,
        loading: false,
        errors: new Immutable.Map(),
      }));
  }

  onHideShortLogin() {
    this.setState(
      this.state.merge({
        showShortLogin: false,
        loading: false,
        errors: new Immutable.Map(),
      })
    );
  }

  onActivateTotpSuccess() {
    this.setState(
      this.state.merge({
        showQRCode: false,
        loading: false,
        errors: new Immutable.Map(),
        options: this.state.options.set('totp', true),
      }));
  }

  onDeactivateTotpSuccess() {
    this.setState(this.state
      .set('options', this.state.options.set('totp', false))
    );
  }

  onDeactivateShortLoginSuccess() {
    this.setState(this.state
      .set('options', this.state.options.set('shortLogin', secretin.canITryShortLogin()))
    );
  }

  onActivateShortLoginSuccess() {
    this.setState(
      this.state.merge({
        showShortLogin: false,
        loading: false,
        errors: new Immutable.Map(),
        options: this.state.options.set('shortLogin', secretin.canITryShortLogin()),
      }));
  }

  static getOptions() {
    return this.getState().get('options');
  }

}

export default alt.createStore(
  makeImmutable(OptionsStore),
  'OptionsStore'
);
