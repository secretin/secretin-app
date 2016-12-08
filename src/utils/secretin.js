import Secretin from 'secretin';

const secretin = new Secretin(Secretin.API.Server);
// secretin.changeDB('https://test.secret-in.me');
secretin.changeDB('http://localhost:3001');

export default secretin;
