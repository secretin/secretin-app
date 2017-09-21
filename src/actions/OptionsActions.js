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
      'showImportKeepass',
      'hideImportKeepass',
      'showChangePassword',
      'hideChangePassword',
      'importKeepassProgress',
      'importKeepassSuccess',
      'importKeepassFailure',
      'hideQRCode',
      'hideShortLogin',
      'changeDelaySuccess',
      'changeDelayFailure',
      'showRescueCodesSuccess',
      'hideRescueCodes',
      'changeNewPass1',
      'changeNewPass2',
      'changePasswordSuccess',
      'changePasswordFailure'
    );
  }

  deactivateTotp() {
    return dispatch => {
      dispatch();
      secretin
        .deactivateTotp()
        .then(() => {
          this.deactivateTotpSuccess();
        })
        .catch(() => {
          this.deactivateTotpFailure();
        });
    };
  }

  activateTotp({ seed, token }) {
    return dispatch => {
      dispatch();
      secretin.api
        .testTotp(seed.b32, token)
        .then(() => secretin.activateTotp(seed))
        .then(() => {
          this.activateTotpSuccess();
        })
        .catch(err => {
          if (err === 'Invalid couple') {
            this.activateTotpFailure({ error: 'Synchronisation error' });
          } else {
            this.activateTotpFailure({ error: 'An error occured' });
          }
        });
    };
  }

  activateShortLogin({ shortpass }) {
    return dispatch => {
      dispatch();
      secretin
        .activateShortLogin(shortpass, uuid.v4())
        .then(() => {
          this.activateShortLoginSuccess({
            shortLogin: secretin.canITryShortLogin(),
          });
        })
        .catch(() => {
          this.activateShortLoginFailure();
        });
    };
  }

  deactivateShortLogin() {
    return dispatch => {
      dispatch();
      secretin
        .deactivateShortLogin()
        .then(() => {
          this.deactivateShortLoginSuccess({
            shortLogin: secretin.canITryShortLogin(),
          });
        })
        .catch(() => {
          this.deactivateShortLoginFailure();
        });
    };
  }

  changePassword({ newPass }) {
    return dispatch => {
      dispatch();
      secretin
        .changePassword(newPass)
        .then(() => {
          this.changePasswordSuccess();
        })
        .catch(() => {
          this.changePasswordFailure();
        });
    };
  }

  toggleTotp({ checked }) {
    if (checked) {
      return true;
    }

    return this.deactivateTotp();
  }

  showRescueCodes() {
    return dispatch => {
      dispatch();
      // eslint-disable-next-line no-alert
      if (
        !window.confirm(
          'Be careful, this will replace your previously generated codes. Continue?'
        )
      ) {
        return;
      }
      secretin.getRescueCodes().then(rescueCodes => {
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

  toggleAutoLogout({ checked }) {
    const delay = checked ? 30 : 0;
    return this.changeTimeToClose({ timeToClose: delay });
  }

  changeTimeToClose({ timeToClose }) {
    secretin
      .editOption('timeToClose', timeToClose)
      .then(() => {
        this.changeDelaySuccess({ timeToClose });
      })
      .catch(() => {
        this.changeDelayFailure();
      });
    return true;
  }
}

export default alt.createActions(OptionsActions);
