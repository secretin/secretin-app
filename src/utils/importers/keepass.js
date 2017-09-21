import secretin from 'utils/secretin';
import uuid from 'uuid';
import { isEmpty } from 'lodash';

class InternalProgressBar {
  constructor(progressFunction, total) {
    this.func = progressFunction;
    this.total = total;
    this.status = 0;
  }

  update() {
    this.status += 1;
    this.func({ state: this.status, total: this.total });
  }
}

function addSecret(child, hashedParent) {
  let title = '';
  const secret = {
    type: 'default',
    fields: [
      {
        id: uuid.v4(),
        type: 'text',
        label: 'login',
        content: '',
      },
      {
        id: uuid.v4(),
        type: 'password',
        label: 'password',
        content: '',
      },
      {
        id: uuid.v4(),
        type: 'url',
        label: 'url',
        content: '',
      },
    ],
  };
  const strings = child.querySelectorAll(':scope > String');

  for (let j = 0; j < strings.length; j += 1) {
    const key = strings[j].children[0].textContent;
    const value = strings[j].children[1].textContent;
    if (key.toLowerCase() === 'title') {
      title = value;
    } else if (key.toLowerCase() === 'password') {
      secret.fields[1].content = value;
    } else if (key.toLowerCase() === 'url') {
      secret.fields[2].content = value;
    } else if (key.toLowerCase() === 'username') {
      secret.fields[0].content = value;
    } else if (!isEmpty(value)) {
      secret.fields.push({
        id: uuid.v4(),
        type: 'text',
        label: key,
        content: value,
      });
    }
  }

  let hashedTitle = '';
  return secretin.addSecret(title, secret).then(rHashedTitle => {
    hashedTitle = rHashedTitle;
    if (typeof hashedParent !== 'undefined') {
      return secretin.addSecretToFolder(hashedTitle, hashedParent);
    }
    return Promise.resolve();
  });
}

function defaultProgress(status, total) {
  // eslint-disable-next-line no-console
  console.log(`${status}/${total}`);
}

function addAndParseGroup(group, progress, hashedParent) {
  let hashedTitle = '';
  const title = group.getElementsByTagName('Name')[0].textContent;
  return (
    secretin
      .addFolder(title)
      .then(rHashedTitle => {
        hashedTitle = rHashedTitle;
        const entries = [].slice.call(group.querySelectorAll(':scope > Entry'));
        const entryPromises = entries.reduce(
          (promise, childEntry) =>
            promise.then(() =>
              addSecret(childEntry, hashedTitle).then(() => {
                progress.update();
              })
            ),
          Promise.resolve()
        );
        return entryPromises;
      })
      .then(() => {
        if (typeof hashedParent !== 'undefined') {
          return secretin.addSecretToFolder(hashedTitle, hashedParent);
        }
        return Promise.resolve();
      })
      // eslint-disable-next-line
      .then(() => parseGroup(group, progress, hashedTitle))
  );
}

function parseGroup(group, progress, hashedParent) {
  let entryPromises;
  if (typeof hashedParent === 'undefined') {
    const entries = [].slice.call(group.querySelectorAll(':scope > Entry'));
    entryPromises = entries.reduce(
      (promise, childEntry) =>
        promise.then(() =>
          addSecret(childEntry, hashedParent).then(() => {
            progress.update();
          })
        ),
      Promise.resolve()
    );
  } else {
    entryPromises = Promise.resolve();
  }

  return entryPromises.then(() => {
    const groups = [].slice.call(group.querySelectorAll(':scope > Group'));
    return groups.reduce(
      (promise, childGroup) =>
        promise.then(() =>
          addAndParseGroup(childGroup, progress, hashedParent)
        ),
      Promise.resolve()
    );
  });
}

function count(group) {
  let nb = group.querySelectorAll(':scope > Entry').length;
  const groups = group.querySelectorAll(':scope > Group');
  for (let i = 0; i < groups.length; i += 1) {
    nb += count(groups[i]);
  }
  return nb;
}

export function detect(file) {
  const parser = new DOMParser();
  let isKeepass = false;
  try {
    const xmlDoc = parser.parseFromString(file, 'application/xml');
    isKeepass = xmlDoc.getElementsByTagName('KeePassFile').length === 1;
  } catch (e) {
    isKeepass = false;
  }
  return isKeepass;
}

export function parse(xml, mandatoryField, progress = defaultProgress) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'application/xml');
  const root = xmlDoc.getElementsByTagName('Root')[0].children[0];
  const currentProgress = new InternalProgressBar(progress, count(root));
  return parseGroup(root, currentProgress);
}

export const mandatoryFields = {};

const keepass = {
  parse,
  detect,
  mandatoryFields,
};

export default keepass;
