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
      'showImportKeepass',
      'hideImportKeepass',
      'importKeepassProgress',
      'importKeepassSuccess',
      'importKeepassFailure',
      'hideQRCode',
      'hideShortLogin',
      'showRescueCodesSuccess',
      'hideRescueCodes',
    );
  }

  deactivateTotp() {
    return (dispatch) => {
      dispatch();
      secretin.deactivateTotp()
        .then(() => {
          this.deactivateTotpSuccess();
        })
        .catch(() => {
          this.deactivateTotpFailure();
        });
    };
  }

  activateTotp({ seed, token }) {
    return (dispatch) => {
      dispatch();
      secretin.api.testTotp(seed.b32, token)
        .then(() => secretin.activateTotp(seed))
        .then(() => {
          this.activateTotpSuccess();
        })
        .catch((err) => {
          if (err === 'Invalid couple') {
            this.activateTotpFailure({ error: 'Synchronisation error' });
          } else {
            this.activateTotpFailure({ error: 'An error occured' });
          }
        });
    };
  }

  activateShortLogin({ shortpass }) {
    return (dispatch) => {
      dispatch();
      secretin.activateShortLogin(shortpass, uuid.v4())
        .then(() => {
          this.activateShortLoginSuccess();
        })
        .catch(() => {
          this.activateShortLoginFailure();
        });
    };
  }

  deactivateShortLogin() {
    return (dispatch) => {
      dispatch();
      secretin.deactivateShortLogin()
        .then(() => {
          this.deactivateShortLoginSuccess();
        })
        .catch(() => {
          this.deactivateShortLoginFailure();
        });
    };
  }

  toggleTotp({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateTotp();
  }

  importKeepass({ file }) {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = readedFile => (
      parseKeepass(
          readedFile.target.result,
          (importStatus, importTotal) => this.importKeepassProgress({ importStatus, importTotal })
        )
        .then(() => {
          this.importKeepassSuccess();
        })
        .catch((error) => {
          this.importKeepassFailure({ error });
        })
    );

    return reader;
  }

  showRescueCodes() {
    return (dispatch) => {
      dispatch();
      secretin.getRescueCodes()
        .then((rescueCodes) => {
          this.showRescueCodesSuccess({ rescueCodes });
        });
    };
  }

  toggleShortLogin({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateShortLogin();
  }
}

export default alt.createActions(OptionsActions);
