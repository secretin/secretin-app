import moment, { Moment } from 'moment';

import User, { Permissions, RawUser } from 'models/User';
import SecretDataRecord, { RawSecretDataRecord } from 'models/SecretDataRecord';

type SecretType = 'folder' | 'secret' | 'windows';

type RawSecret = {
  id: string;
  type: SecretType;
  title: string;
  lastModifiedBy: string | null;
  lastModifiedAt: Moment | null;
  users: RawUser[];
  data: RawSecretDataRecord;
};

type SecretCreationParams = Omit<RawSecret, 'users' | 'data'> & {
  users: User[];
  data: SecretDataRecord;
};

class Secret {
  id: string;
  type: SecretType;
  title: string;
  lastModifiedBy: string | null;
  lastModifiedAt: Moment | null;
  users: User[];
  data: SecretDataRecord;
  constructor(initialValues: SecretCreationParams) {
    this.id = initialValues.id;
    this.type = initialValues.type;
    this.title = initialValues.title || '';
    this.lastModifiedBy = initialValues.lastModifiedBy || null;
    this.lastModifiedAt = initialValues.lastModifiedAt || null;
    this.users = initialValues.users || [];
    this.data = initialValues.data || null;
  }

  getIcon() {
    switch (this.type) {
      case 'folder':
        if (Object.keys(this.users).length > 1) {
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

  accessRightForUser(user: User) {
    return this.users.find(_user => _user.id === user.username)?.rights || 0;
  }

  canBeReadBy(user: User) {
    return this.accessRightForUser(user) >= Permissions.READ;
  }

  canBeUpdatedBy(user: User) {
    return this.accessRightForUser(user) >= Permissions.WRITE;
  }

  canBeSharedBy(user: User) {
    return this.accessRightForUser(user) >= Permissions.SHARE;
  }

  canBeDeleted() {
    return this.type !== 'windows';
  }

  merge(fields: Secret) {
    if (fields.id) this.id = fields.id;
    if (fields.type) this.type = fields.type;
    if (fields.title) this.title = fields.title;
    if (fields.lastModifiedBy) this.lastModifiedBy = fields.lastModifiedBy;
    if (fields.lastModifiedAt) this.lastModifiedAt = fields.lastModifiedAt;
    if (fields.users) this.users = fields.users;
    if (fields.data) this.data = fields.data;
    return this;
  }

  getRaw(): RawSecret {
    const {
      id,
      type,
      title,
      lastModifiedBy,
      lastModifiedAt,
      data,
      users,
    } = this;
    return {
      id,
      type,
      title,
      lastModifiedBy,
      lastModifiedAt,
      data: data?.getRaw(),
      users: users.map(user => user.getRaw()),
    };
  }

  static createFromRaw(rawSecret: RawSecret) {
    const initialValues = {
      ...rawSecret,
      users: Object.values(rawSecret.users).map(user =>
        User.createFromRaw(user)
      ),
      data: SecretDataRecord.createFromRaw(rawSecret.data),
      lastModifiedAt: moment(rawSecret.lastModifiedAt),
    };

    return new Secret(initialValues);
  }
}

export default Secret;
