import { Record } from 'immutable';
import alt from 'utils/alt';
import makeImmutable from 'utils/makeImmutable';

import NewSecretUIActions from 'actions/NewSecretUIActions';
import MetadataActions from 'actions/MetadataActions';

import SecretDataRecord from 'models/SecretDataRecord';

const NewSecretUIState = new Record({
  shown: false,
  folder: null,
  isFolder: false,
  title: '',
  data: SecretDataRecord.createWithDefaultFields(
    SecretDataRecord.DEFAULT_FIELDS
  ),
});

class NewSecretUIStore {
  constructor() {
    this.bindActions(NewSecretUIActions);
    this.bindAction(MetadataActions.CREATE_SECRET_SUCCESS, this.onHideModal);

    this.state = new NewSecretUIState();
  }

  onShowModal({ folder, isFolder }) {
    this.setState(
      this.state.merge({
        shown: true,
        title: `Untilted ${isFolder ? 'folder' : 'secret'}`,
        folder,
        isFolder,
      })
    );
  }

  onHideModal() {
    this.setState(
      new NewSecretUIState()
    );
  }

  onChangeTitle({ value }) {
    this.setState(
      this.state.set('title', value)
    );
  }

  onChangeField({ field, value }) {
    this.setState(
      this.state.updateIn(['data', 'fields'], fields =>
        fields.update(
          fields.findIndex(fieldToUpdate => fieldToUpdate.id === field.id),
          fieldToUpdate => fieldToUpdate.set('content', value)
        )
      )
    );
  }
}

export default alt.createStore(
  makeImmutable(NewSecretUIStore),
  'NewSecretUIStore'
);
