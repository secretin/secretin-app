import secretin from 'utils/secretin';
import uuid from 'uuid';

function addSecret(child, hashedParent) {
  let title = '';
  const secret = {
    type: 'default',
    fields: [],
  };
  const strings = child.getElementsByTagName('String');

  for (let j = 0; j < strings.length; j += 1) {
    const key = strings[j].children[0].textContent;
    const value = strings[j].children[1].textContent;
    if (key === 'Title') {
      title = value;
    } else if (key === 'Password') {
      secret.fields.push({
        id: uuid.v4(),
        type: 'password',
        label: key,
        content: value,
      });
    } else {
      secret.fields.push({
        id: uuid.v4(),
        type: 'text',
        label: key,
        content: value,
      });
    }
  }

  console.log(title);
  let hashedTitle = '';
  return secretin.addSecret(title, secret)
    .then((rHashedTitle) => {
      hashedTitle = rHashedTitle;
      if (typeof hashedParent !== 'undefined') {
        return secretin.addSecretToFolder(hashedTitle, hashedParent);
      }
      return Promise.resolve();
    });
}

function addAndParseGroup(group, hashedParent) {
  let hashedTitle = '';
  const title = group.getElementsByTagName('Name')[0].textContent;
  console.log(title);
  return secretin.addFolder(title)
    .then((rHashedTitle) => {
      hashedTitle = rHashedTitle;
      if (typeof hashedParent !== 'undefined') {
        return secretin.addSecretToFolder(hashedTitle, hashedParent);
      }
      return Promise.resolve();
    })
    // eslint-disable-next-line
    .then(() => parseGroup(group, hashedTitle));
}


function parseGroup(group, hashedParent) {
  const groups = [].slice.call(group.querySelectorAll(':scope > Group'));
  const groupPromises = groups.reduce(
    (promise, childGroup) =>
      promise.then(() => addAndParseGroup(childGroup, hashedParent))
    , Promise.resolve()
  );

  return groupPromises
    .then(() => {
      const entries = [].slice.call(group.querySelectorAll(':scope > Entry'));
      const entryPromises = entries.reduce(
        (promise, childEntry) =>
          promise.then(() => addSecret(childEntry, hashedParent))
        , Promise.resolve()
      );
      return entryPromises;
    });
}

export function parseKeepass(xml) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, 'application/xml');
  const root = xmlDoc.getElementsByTagName('Root')[0].children[0];
  return parseGroup(root);
}

const Import = {
  parseKeepass,
};

export default Import;
