import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/App';
import registerServiceWorker from 'registerServiceWorker';

// eslint-disable-next-line
import './index.css';

const rootEl = document.getElementById('root');

ReactDOM.render(<App />, rootEl);
if (typeof window.process === 'undefined') {
  registerServiceWorker();
}

if (module.hot) {
  module.hot.accept('components/App', () => {
    // eslint-disable-next-line global-require
    const NextApp = require('components/App').default;

    ReactDOM.render(<NextApp />, rootEl);
  });
}
