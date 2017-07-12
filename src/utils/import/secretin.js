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
  return secretin.importDb(username, password, db, function(status) {
    progress(status.state, status.total);
  });
}

export function needSpecial() {
  return {
    username: '',
    password: '',
  };
}

const secretinDB = {
  parse,
  detect,
  needSpecial,
};

export default secretinDB;
