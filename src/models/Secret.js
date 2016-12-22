import Immutable from 'immutable';
import moment from 'moment';

import User from 'models/User';
import SecretDataRecord from 'models/SecretDataRecord';

const defaultRecord = {
  id: null,
  type: null,
  title: null,
  lastModifiedBy: null,
  lastModifiedAt: null,
  users: new Immutable.Map(),
  data: null,
};

const CAN_SHARE = 2;
const CAN_WRITE = 1;
const CAN_READ = 0;

class Secret extends (new Immutable.Record(defaultRecord)) {
  getIcon() {
    switch (this.type) {
      case 'folder':
        if (this.users.size > 1) {
          return 'folder-shared';
        }
        return 'folder';
      case 'secret':
        return 'description';
      case 'windows':
        return 'description';
      default:
        return 'description';
    }
  }

  accessRightForUser(user) {
    return this.users.get(user.username).get('rights');
  }

  canBeReadBy(user) {
    return this.accessRightForUser(user) >= CAN_READ;
  }

  canBeUpdatedBy(user) {
    return this.accessRightForUser(user) >= CAN_WRITE;
  }

  canBeSharedBy(user) {
    return this.accessRightForUser(user) >= CAN_SHARE;
  }

  static createFromRaw(rawData) {
    const raw = Immutable.fromJS(rawData).map((value, key) => {
      switch (key) {
        case 'users':
          return value.map(user => User.createFromRaw(user));
        case 'data':
          return SecretDataRecord.createFromRaw(value);
        case 'lastModifiedAt':
          return moment(value);
        default:
          return value;
      }
    });

    return new Secret(raw);
  }
}

export default Secret;
