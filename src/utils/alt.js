import ReactDOM from 'react-dom';
import Alt from 'alt';

const alt = new Alt({
  batchingFunction: ReactDOM.unstable_batchedUpdates,
});
Alt.debug('alt', alt);

export default alt;
