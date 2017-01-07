import { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import EditSecretUIActions from 'actions/EditSecretUIActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import MetadataActions from 'actions/MetadataActions';

const EditSecretUIState = new Record({
  isEditing: false,
  data: null,
});

const {
  SHOW_SECRET_SUCCESS,
  HIDE_MODAL,
}
= ShowSecretUIActions;

const {
  UPDATE_SECRET_SUCCESS,
}
= MetadataActions;

class EditSecretUIStore {
  constructor() {
    this.bindActions(EditSecretUIActions);
    this.bindAction(SHOW_SECRET_SUCCESS, this.onUpdateSecret);
    this.bindAction(HIDE_MODAL, this.onHideModal);
    this.bindAction(UPDATE_SECRET_SUCCESS, this.onUpdateData);

    this.state = new EditSecretUIState();
  }

  onUpdateSecret({ secret }) {
    this.setState(
      this.state.merge({
        isEditing: false,
        data: secret.data,
      })
    );
  }

  onUpdateData({ data }) {
    this.setState(
      this.state.merge({
        isEditing: false,
        data,
      })
    );
  }

  onHideModal() {
    this.setState(this.state
      .set('isEditing', false)
      .set('data', null)
    );
  }

  onChangeField({ field, value }) {
    this.setState(
      this.state.updateIn(['data', 'fields'], fields =>
        fields.update(
          fields.findIndex(fieldToUpdate => fieldToUpdate.id === field.id),
          fieldToUpdate => fieldToUpdate.set('content', value)
        )
      ).set('isEditing', true)
    );
  }
}

export default alt.createStore(
  makeImmutable(EditSecretUIStore),
  'EditSecretUIStore'
);
