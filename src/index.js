import './utils/wdyr';

import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import { unregister } from 'utils/registerServiceWorker';

import store from 'stores/store';
import { Provider } from 'react-redux';

// eslint-disable-next-line
import './index.css';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootEl
);
if (typeof window.process === 'undefined') {
  unregister(); // Get rid of the service worker, we don't need it
}

// if (module.hot) {
//   module.hot.accept('components/App', () => {
//     // eslint-disable-next-line global-require
//     const NextApp = require('components/App').default;

//     ReactDOM.render(<NextApp />, rootEl);
//   });
// }
