import urljoin from 'url-join';

export function buildSecretURL(folders = [], basePath = '/secrets') {
  return urljoin(basePath, folders.join('/'), '/');
}

const URLHelper = {
  buildSecretURL,
};

export default URLHelper;
