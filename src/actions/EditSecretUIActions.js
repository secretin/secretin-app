import alt from 'utils/alt';
import MetadataActions from 'actions/MetadataActions';

class EditSecretUIActions {
  constructor() {
    this.generateActions(
      'changeField'
    );
  }

  save({ secret, data }) {
    return MetadataActions.updateSecret({
      secret,
      data
    });
  }
}

export default alt.createActions(EditSecretUIActions);
