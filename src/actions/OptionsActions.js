import alt from 'utils/alt';
import secretin from 'utils/secretin';

class OptionsActions {
  constructor() {
    this.generateActions(
      'verifyTotpSuccess',
      'verifyTotpFailure',
      'deactivateTotpSuccess',
      'deactivateTotpFailure',
      'activateTotpSuccess',
      'activateTotpFailure',
      'hideQRCode',
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

  toggleTotp({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateTotp();
  }
}

export default alt.createActions(OptionsActions);
