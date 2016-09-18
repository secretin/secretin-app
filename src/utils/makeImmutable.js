import Immutable from 'immutable';

export default function makeImmutable(giveStoreModel) {
  const StoreModel = giveStoreModel;

  StoreModel.config = {
    setState(currentState, nextState) {
      this.state = nextState;
      return this.state;
    },

    getState(currentState) {
      return currentState.state || currentState;
    },

    onSerialize(currentState) {
      const state = currentState.state || currentState;
      return state.toJS();
    },

    onDeserialize(data) {
      return Immutable.fromJS(data);
    },
  };

  return StoreModel;
}
