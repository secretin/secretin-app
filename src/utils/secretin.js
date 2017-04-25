import Secretin from 'secretin';

const serverURI = process.env.REACT_APP_API_SECRETIN
  ? process.env.REACT_APP_API_SECRETIN
  : 'http://devapi.secret-in.me:3000';

let api = serverURI;

if (typeof window.process !== 'undefined') {
  // Electron
  const params = new URLSearchParams(location.search);
  api = params.get('api');
}

const secretin = new Secretin(Secretin.API.Server, api);

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
