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
  users: new Immutable.List(),
  folders: new Immutable.List(),
  data: null,
};

const CAN_SHARE = new Immutable.List([2]);
const CAN_WRITE = CAN_SHARE.push(1);
const CAN_READ = CAN_WRITE.push(0);

class Secret extends new Immutable.Record(defaultRecord) {
  getIcon() {
    switch (this.type) {
      case 'folder':
        if (this.users.size > 1) {
          return 'folder-shared';
        }
        return 'folder';
      case 'secret':
        return 'description';
      default:
        return 'description';
    }
  }

  accessRightForUser(user) {
    return this.users.find(secretUser => secretUser.id === user.username).get('rights');
  }

  canBeReadBy(user) {
    return CAN_READ.includes(this.accessRightForUser(user));
  }

  canBeUpdatedBy(user) {
    return CAN_WRITE.includes(this.accessRightForUser(user));
  }

  canBeSharedBy(user) {
    return CAN_SHARE.includes(this.accessRightForUser(user));
  }

  static createFromRaw(rawData) {
    const raw = Immutable.fromJS(rawData)
      .map((value, key) => {
        switch (key) {
          case 'users':
            return value.map(
              user => User.createFromRaw(user)
            ).toList();
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
