// eslint-disable-next-line
import Secretin from 'secretin';

const secretin = new Secretin(Secretin.API.Server);
secretin.changeDB('https://api.secret-in.me');

export default secretin;
