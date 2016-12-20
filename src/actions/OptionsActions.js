import alt from 'utils/alt';
import secretin from 'utils/secretin';

class OptionsActions {
  constructor() {
    this.generateActions(
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

  toggleTotp({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateTotp();
  }
}

export default alt.createActions(OptionsActions);
