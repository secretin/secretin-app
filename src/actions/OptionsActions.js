import alt from 'utils/alt';
import secretin from 'utils/secretin';
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

  toggleShortLogin({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateShortLogin();
  }
}

export default alt.createActions(OptionsActions);
