import Immutable from 'immutable';
import urljoin from 'url-join';

export function buildSecretURL(folders = new Immutable.List(), basePath = '/secrets') {
  return urljoin(basePath, folders.toArray().join('/'), '/');
}

const URLHelper = {
  buildSecretURL,
};

export default URLHelper;
