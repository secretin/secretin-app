import Secretin from 'secretin';
import SecretinBrowserAdapter from 'secretin/dist/adapters/browser.umd';

const serverURI = process.env.REACT_APP_API_SECRETIN
  ? process.env.REACT_APP_API_SECRETIN
  : 'http://devapi.secret-in.me:3000';

let api = serverURI;

if (typeof window.process !== 'undefined') {
  // Electron
  const params = new URLSearchParams(window.location.search);
  api = params.get('api');
}

const secretin = new Secretin(SecretinBrowserAdapter, Secretin.API.Server, api);

export const Statuses = {
  ...Secretin.Statuses,
};

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
