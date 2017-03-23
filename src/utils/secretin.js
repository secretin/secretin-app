import Secretin from 'secretin';

const serverURI = process.env.REACT_APP_API_SECRETIN ? process.env.REACT_APP_API_SECRETIN : 'http://devapi.secret-in.me:3000';

const secretin = new Secretin(Secretin.API.Server, serverURI);

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
