import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import HistorySecretUIActions from 'actions/HistorySecretUIActions';

const HistorySecretUIState = new Record({
  selected: 0,
  history: new Immutable.Map(),
});

class HistorySecretUIStore {
  constructor() {
    this.bindActions(HistorySecretUIActions);
    this.state = new HistorySecretUIState();
  }

  onShowHistorySuccess({ history }) {
    this.setState(this.state.set('selected', 0).set('history', history));
  }

  onChangeHistory(data) {
    let newSelected = this.state.get('selected') + data;
    if (newSelected < 0) {
      newSelected = this.state.history.length - 1;
    } else if (newSelected >= this.state.history.length) {
      newSelected = 0;
    }

    this.setState(this.state.set('selected', newSelected));
  }

  static getHistoryData() {
    if (this.state.selected in this.state.history) {
      return this.state.history[this.state.selected];
    }
    return { data: null, lastModifiedAt: null, lastModifiedBy: null };
  }
}

export default alt.createStore(
  makeImmutable(HistorySecretUIStore),
  'HistorySecretUIStore'
);
