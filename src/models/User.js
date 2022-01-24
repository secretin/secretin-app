import uuid from 'uuid';

export const UserRights = [
  0, // Read
  1, // Read && Write
  2, // Read, Write && Share
];

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

class User {
  constructor(raw = {}) {
    this.id = raw.username || uuid.v4();
    this.username = raw.username || '';
    this.rights = raw.rights || 0;
    this.folders = raw.folders || {};
  }

  isValid() {
    return this.username.length > 0;
  }

  merge(fields) {
    Object.entries(fields).forEach(([key, value]) => {
      this[key] = value;
    });
    return this;
  }

  getRaw() {
    const { id, username, rights, folders } = this;
    return {
      id,
      username,
      rights,
      folders,
    };
  }

  static createFromRaw(rawData) {
    return new User(rawData);
  }
}

export default User;
