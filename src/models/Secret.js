import moment from 'moment';

import User from 'models/User';
import SecretDataRecord from 'models/SecretDataRecord';

const CAN_SHARE = 2;
const CAN_WRITE = 1;
const CAN_READ = 0;

class Secret {
  constructor(raw) {
    this.id = raw.id || null;
    this.type = raw.type || null;
    this.title = raw.title || null;
    this.lastModifiedBy = raw.lastModifiedBy || null;
    this.lastModifiedAt = raw.lastModifiedAt || null;
    this.users = raw.users || {};
    this.data = raw.data || null;
  }

  getIcon() {
    switch (this.type) {
      case 'folder':
        if (Object.keys(this.users) > 1) {
          return 'folder-shared';
        }
        return 'folder';
      case 'secret':
        return 'description';
      case 'windows':
        return 'windows';
      default:
        return 'description';
    }
  }

  accessRightForUser(user) {
    return this.users[user.username].rights;
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

  canBeDeleted() {
    return this.type !== 'windows';
  }

  static createFromRaw(rawData) {
    const raw = Object.entries(rawData).reduce((output, [key, value]) => {
      switch (key) {
        case 'users':
          return {
            ...output,
            users: value.map(user => User.createFromRaw(user)),
          };
        case 'data':
          return { ...output, data: SecretDataRecord.createFromRaw(value) };
        case 'lastModifiedAt':
          return { ...output, lastModifiedAt: moment(value) };
        default:
          return output;
      }
    }, rawData);
    return new Secret(raw);
  }
}

export default Secret;
