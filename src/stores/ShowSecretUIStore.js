import { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import ShowSecretUIActions from 'actions/ShowSecretUIActions';

const ShowSecretUIState = new Record({
  secret: null,
  tab: 'details',
});

class ShowSecretUIStore {
  constructor() {
    this.bindActions(ShowSecretUIActions);

    this.state = new ShowSecretUIState();
  }

  onShowModal({ secret, tab }) {
    this.setState(
      this.state.merge({
        secret,
        tab: tab || 'details',
      })
    );
  }

  onShowSecretSuccess({ secret }) {
    this.setState(
      this.state.set('secret', secret)
    );
  }

  onHideModal() {
    this.setState(
      this.state.set('secret', null)
    );
  }

  onChangeTab({ tab }) {
    this.setState(
      this.state.set('tab', tab)
    );
  }
}

export default alt.createStore(
  makeImmutable(ShowSecretUIStore),
  'ShowSecretUIStore'
);
