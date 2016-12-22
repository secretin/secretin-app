// eslint-disable-next-line
import Secretin from 'secretin';

const secretin = new Secretin(Secretin.API.Server, 'http://127.0.0.1:3000');

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
