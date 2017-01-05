import alt from 'utils/alt';
import secretin from 'utils/secretin';
import uuid from 'uuid';

class OptionsActions {
  constructor() {
    this.generateActions(
      'verifyTotpSuccess',
      'verifyTotpFailure',
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
      'changeDelaySuccess',
      'changeDelayFailure',
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

  activateTotp({ seed }) {
    secretin.activateTotp(seed)
      .then(() => {
        this.activateTotpSuccess();
      })
      .catch(() => {
        this.activateTotpFailure();
      });
    return true;
  }

  verifyTotp({ seed, token }) {
    secretin.api.testTotp(seed.b32, token)
      .then(() => {
        this.verifyTotpSuccess();
      })
      .catch(() => {
        this.verifyTotpFailure();
      });
    return token;
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

  toggleShortLogin({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateShortLogin();
  }

  changeDelay(delay) {
    secretin.editOption('timeToClose', delay)
      .then(() => {
        this.changeDelaySuccess(secretin.currentUser.options.timeToClose);
      })
      .catch(() => {
        this.changeDelayFailure();
      });
    return true;
  }
}

export default alt.createActions(OptionsActions);
