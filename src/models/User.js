import Immutable from 'immutable';
import uuid from 'uuid';

const defaultRecord = {
  id: null,
  username: null,
  rights: null,
  folders: new Immutable.Map(),
};

export const UserRights = new Immutable.List([
  0, // Read
  1, // Read && Write
  2, // Read, Write && Share
]);

export function userRightLabel(accessRights) {
  switch (accessRights) {
    case 0:
      return 'Read only';
    case 1:
      return 'Read and write';
    case 2:
      return 'Read, write and share';
    default:
      throw new Error(`Unknown access rights "${accessRights}"`);
  }
}

class User extends new Immutable.Record(defaultRecord) {
  constructor(attributes = new Immutable.Map()) {
    super(
      attributes.set(
        'id',
        attributes.get('username', uuid.v4())
      )
    );
  }

  isValid() {
    return this.username.length > 0;
  }

  static createFromRaw(rawData) {
    const raw = Immutable.fromJS(rawData)
      .map((value, key) => {
        switch (key) {
          case 'folders':
            return Immutable.fromJS(value);
          default:
            return value;
        }
      });
    return new User(raw);
  }
}

export default User;
