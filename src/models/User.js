import Immutable from 'immutable';

const defaultRecord = {
  id: null,
  username: null,
  rights: null,
};

export const UserRights = new Immutable.List([
  0, // Read
  1, // Read && Write
  2, // Read, Write && Share
]);

class User extends new Immutable.Record(defaultRecord) {
  static createFromRaw(rawData) {
    const raw = rawData.set('id', rawData.get('username'));
    return new User(raw);
  }
}

export default User;
