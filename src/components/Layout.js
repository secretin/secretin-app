import React from 'react';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';
import Redirect from 'react-router-dom/Redirect';

import Sidebar from 'components/Sidebar';
import SecretShow from 'components/secrets/SecretShow';
import SecretListContainer from 'components/secrets/SecretListContainer';
import OptionsContainer from 'components/options/OptionsContainer';

function Layout() {
  return (
    <div className="layout">
      <SecretShow />
      <Sidebar />
      <div className="layout-pane">
        <Switch>
          <Route
            path="/secrets/all"
            render={props => <SecretListContainer {...props} showAll />}
          />
          <Route
            path="/secrets/mine"
            render={props => <SecretListContainer {...props} showMine />}
          />
          <Route
            path="/secrets/shared"
            render={props => <SecretListContainer {...props} showShared />}
          />
          <Route
            path="/secrets/:path*"
            render={props => <SecretListContainer {...props} />}
          />
          <Route path="/settings/" component={OptionsContainer} />
          <Redirect to="/secrets/" />
        </Switch>
      </div>
    </div>
  );
}

export default Layout;
