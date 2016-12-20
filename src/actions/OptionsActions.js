import alt from 'utils/alt';
import secretin from 'utils/secretin';
import Import from 'utils/import';

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

  importKeepass(keepass) {
    Import.parseKeepass(keepass)
      .then(() => {
        this.importKeepassSuccess();
      })
      .catch(() => {
        this.importKeepassFailure();
      });
    return true;
  }
}

export default alt.createActions(OptionsActions);
