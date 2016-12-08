import { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import MetadataStore from 'stores/MetadataStore';

const ShowSecretUIState = new Record({
  secret: null,
  tab: 'details',
  isUpdating: false,
});

class ShowSecretUIStore {
  constructor() {
    this.bindActions(ShowSecretUIActions);
    this.bindAction(
      MetadataActions.CREATE_SECRET_USER_RIGHTS,
      this.onUpdateSecret,
    );
    this.bindAction(
      MetadataActions.UPDATE_SECRET_USER_RIGHTS,
      this.onUpdateSecret,
    );
    this.bindAction(
      MetadataActions.DELETE_SECRET_USER_RIGHTS,
      this.onUpdateSecret,
    );
    this.bindAction(
      MetadataActions.CREATE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess,
    );
    this.bindAction(
      MetadataActions.UPDATE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess,
    );
    this.bindAction(
      MetadataActions.DELETE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess,
    );

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
    this.setState(this.state
      .set('secret', secret)
    );
  }

  onHideModal() {
    this.setState(this.state
      .set('secret', null)
    );
  }

  onChangeTab({ tab }) {
    this.setState(this.state
      .set('tab', tab)
    );
  }

  onUpdateSecret() {
    this.setState(this.state
      .set('isUpdating', true)
    );
  }

  onUpdateSecretSuccess() {
    this.waitFor(MetadataStore);
    this.setState(this.state
      .update('secret', secret => (
        secret.merge(
          MetadataStore.getById(this.state.secret.id).toMap().remove('data')
        )
      ))
      .set('isUpdating', false)
    );
  }
}

export default alt.createStore(
  makeImmutable(ShowSecretUIStore),
  'ShowSecretUIStore'
);
