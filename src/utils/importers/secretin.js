import secretin from 'utils/secretin';

function defaultProgress(status, total) {
  // eslint-disable-next-line no-console
  console.log(`${status}/${total}`);
}

export function detect(file) {
  let isSecretin = false;
  try {
    const db = JSON.parse(file);
    isSecretin = 'users' in db && 'secrets' in db;
  } catch (e) {
    isSecretin = false;
  }
  return isSecretin;
}

export function parse(db, { username, password }, progress = defaultProgress) {
  return secretin.importDb(username.value, password.value, db, progress);
}

export const mandatoryFields = {
  username: { type: 'text', name: 'username', value: '' },
  password: { type: 'password', name: 'password', value: '' },
};

const secretinDB = {
  parse,
  detect,
  mandatoryFields,
};

export default secretinDB;
