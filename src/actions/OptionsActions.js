import alt from 'utils/alt';
import secretin from 'utils/secretin';
import { parseKeepass } from 'utils/import';
import uuid from 'uuid';

class OptionsActions {
  constructor() {
    this.generateActions(
      'deactivateTotpSuccess',
      'deactivateTotpFailure',
      'activateTotpSuccess',
      'activateTotpFailure',
      'activateShortLoginSuccess',
      'activateShortLoginFailure',
      'deactivateShortLoginSuccess',
      'deactivateShortLoginFailure',
      'hideQRCode',
      'hideShortLogin',
    );
  }

  deactivateTotp() {
    secretin.deactivateTotp()
      .then(() => {
        this.deactivateTotpSuccess();
      })
      .catch(() => {
        this.deactivateTotpFailure();
      });
    return false;
  }

  activateTotp({ seed, token }) {
    secretin.api.testTotp(seed.b32, token)
      .then(() => secretin.activateTotp(seed))
      .then(() => {
        this.activateTotpSuccess();
      })
      .catch(() => {
        this.activateTotpFailure();
      });
    return true;
  }

  activateShortLogin({ shortpass }) {
    secretin.activateShortLogin(shortpass, uuid.v4())
      .then(() => {
        this.activateShortLoginSuccess();
      })
      .catch(() => {
        this.activateShortLoginFailure();
      });
    return true;
  }

  deactivateShortLogin() {
    secretin.deactivateShortLogin()
      .then(() => {
        this.deactivateShortLoginSuccess();
      })
      .catch(() => {
        this.deactivateShortLoginFailure();
      });
    return false;
  }

  toggleTotp({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateTotp();
  }

  importKeepass(keepass) {
    parseKeepass(keepass)
      .then(() => {
        this.importKeepassSuccess();
      })
      .catch(() => {
        this.importKeepassFailure();
      });
    return true;
  }

  toggleShortLogin({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateShortLogin();
  }
}

export default alt.createActions(OptionsActions);
