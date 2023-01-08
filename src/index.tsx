import './utils/wdyr';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/App';
import { unregister } from 'utils/registerServiceWorker';

import store from 'stores/store';
import { Provider } from 'react-redux';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
if (typeof window.process === 'undefined') {
  unregister(); // Get rid of the service worker, we don't need it
}
