import uuid from 'uuid';

export enum Permissions {
  READ = 0,
  WRITE = 1,
  SHARE = 2,
}

export function userRightLabel(accessRights: Permissions) {
  switch (accessRights) {
    case Permissions.READ:
      return 'Read only';
    case Permissions.WRITE:
      return 'Read and write';
    case Permissions.SHARE:
      return 'Read, write and share';
    default:
      throw new Error(`Unknown access rights "${accessRights}"`);
  }
}

export type RawUser = {
  username?: string;
  rights?: Permissions;
  folders?: unknown;
};
export type UserCreationParams = RawUser;

class User {
  id: string;
  username: string;
  rights: Permissions;
  folders: unknown;
  constructor(initialValues: UserCreationParams) {
    this.id = initialValues.username || uuid.v4();
    this.username = initialValues.username || '';
    this.rights = initialValues.rights || 0;
    this.folders = initialValues.folders || {};
  }

  isValid() {
    return this.username.length > 0;
  }

  merge(fields: User) {
    if (fields.id) this.id = fields.id;
    if (fields.rights) this.rights = fields.rights;
    if (fields.folders) this.folders = fields.folders;
    if (fields.folders) this.folders = fields.folders;
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

  static createFromRaw(rawData: RawUser) {
    return new User(rawData);
  }
}

export default User;
