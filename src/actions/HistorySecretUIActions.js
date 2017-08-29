import alt from 'utils/alt';
import secretin from 'utils/secretin';
import SecretDataRecord from 'models/SecretDataRecord';

class HistorySecretUIActions {
  constructor() {
    this.generateActions('showHistorySuccess');
    this.generateActions('changeHistory');
  }

  loadHistory({ secret }) {
    return dispatch => {
      dispatch();
      secretin.getHistory(secret.id).then(data => {
        const history = data.map(
          ({ secret: secretHistory, lastModifiedAt, lastModifiedBy }) => {
            const raw = !secretHistory.fields
              ? { fields: secretHistory }
              : secretHistory;
            return {
              data: SecretDataRecord.createFromRaw(raw),
              lastModifiedAt,
              lastModifiedBy,
            };
          }
        );
        this.showHistorySuccess({ history });
      });
    };
  }
}

export default alt.createActions(HistorySecretUIActions);
