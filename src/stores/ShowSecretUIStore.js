import Immutable, { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import MetadataStore from 'stores/MetadataStore';

const ShowSecretUIState = new Record({
  secret: null,
  errors: new Immutable.Map(),
  tab: 'details',
  isUpdating: false,
});

const {
  UPDATE_SECRET,
  UPDATE_SECRET_SUCCESS,
  UPDATE_SECRET_FAILURE,
  RENAME_SECRET,
  RENAME_SECRET_SUCCESS,
  RENAME_SECRET_FAILURE,
  CREATE_SECRET_USER_RIGHTS,
  UPDATE_SECRET_USER_RIGHTS,
  DELETE_SECRET_USER_RIGHTS,
  CREATE_SECRET_USER_RIGHTS_SUCCESS,
  UPDATE_SECRET_USER_RIGHTS_SUCCESS,
  DELETE_SECRET_USER_RIGHTS_SUCCESS,
  CREATE_SECRET_USER_RIGHTS_FAILURE,
  UPDATE_SECRET_USER_RIGHTS_FAILURE,
  DELETE_SECRET_USER_RIGHTS_FAILURE,
} = MetadataActions;

class ShowSecretUIStore {
  constructor() {
    this.bindActions(ShowSecretUIActions);
    this.bindAction(UPDATE_SECRET, this.onUpdateSecret);
    this.bindAction(RENAME_SECRET, this.onUpdateSecret);
    this.bindAction(CREATE_SECRET_USER_RIGHTS, this.onUpdateSecret);
    this.bindAction(CREATE_SECRET_USER_RIGHTS, this.onUpdateSecret);
    this.bindAction(UPDATE_SECRET_USER_RIGHTS, this.onUpdateSecret);
    this.bindAction(DELETE_SECRET_USER_RIGHTS, this.onUpdateSecret);
    this.bindAction(UPDATE_SECRET_SUCCESS, this.onUpdateSecretSuccess);
    this.bindAction(UPDATE_SECRET_FAILURE, this.onUpdateSecretFailure);
    this.bindAction(RENAME_SECRET_SUCCESS, this.onUpdateSecretSuccess);
    this.bindAction(RENAME_SECRET_FAILURE, this.onUpdateSecretFailure);
    this.bindAction(
      CREATE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess
    );
    this.bindAction(
      UPDATE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess
    );
    this.bindAction(
      DELETE_SECRET_USER_RIGHTS_SUCCESS,
      this.onUpdateSecretSuccess
    );
    this.bindAction(
      CREATE_SECRET_USER_RIGHTS_FAILURE,
      this.onUpdateSecretFailure
    );
    this.bindAction(
      UPDATE_SECRET_USER_RIGHTS_FAILURE,
      this.onUpdateSecretFailure
    );
    this.bindAction(
      DELETE_SECRET_USER_RIGHTS_FAILURE,
      this.onUpdateSecretFailure
    );

    this.state = new ShowSecretUIState();
  }

  onShowModal({ secret, tab }) {
    this.setState(
      this.state.merge({
        secret,
        tab: tab || 'details',
        errors: new Immutable.Map(),
      })
    );
  }

  onShowSecretSuccess({ secret }) {
    this.setState(
      this.state.set('secret', secret).set('errors', new Immutable.Map())
    );
  }

  onHideModal() {
    this.setState(
      this.state.set('secret', null).set('errors', new Immutable.Map())
    );
  }

  onChangeTab({ tab }) {
    this.setState(this.state.set('tab', tab));
  }

  onUpdateSecret() {
    this.setState(
      this.state.set('errors', new Immutable.Map()).set('isUpdating', true)
    );
  }

  onUpdateSecretSuccess() {
    this.waitFor(MetadataStore);
    this.setState(
      this.state
        .update('secret', secret =>
          secret.merge(
            MetadataStore.getById(this.state.secret.id).toMap().remove('data')
          )
        )
        .set('isUpdating', false)
        .set('errors', new Immutable.Map())
    );
  }

  onUpdateSecretFailure({ error }) {
    this.setState(
      this.state
        .set('errors', new Immutable.Map(error))
        .set('isUpdating', false)
    );
  }
}

export default alt.createStore(
  makeImmutable(ShowSecretUIStore),
  'ShowSecretUIStore'
);
