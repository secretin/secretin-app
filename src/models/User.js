import Immutable from 'immutable';

const defaultRecord = {
  id: null,
  username: null,
  rights: null,
};

class User extends new Immutable.Record(defaultRecord) {
  static createFromRaw(rawData) {
    const raw = rawData.set('id', rawData.get('username'));
    return new User(raw);
  }
}

export default User;
