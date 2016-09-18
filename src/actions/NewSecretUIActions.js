import alt from 'utils/alt';

class NewSecretUIActions {
  constructor() {
    this.generateActions(
      'showModal',
      'hideModal',
      'changeTitle',
      'changeField'
    );
  }
}

export default alt.createActions(NewSecretUIActions);
