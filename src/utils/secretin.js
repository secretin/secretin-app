// eslint-disable-next-line
import Secretin from 'secretin';

const secretin = new Secretin(Secretin.API.Server, 'https://api.secret-in.me');

export const Errors = {
  ...Secretin.Errors,
};

export default secretin;
