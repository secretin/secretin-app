import React from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';

import Sidebar from 'components/Sidebar';
import SecretShow from 'components/secrets/SecretShow';
import SecretListContainer from 'components/secrets/SecretListContainer';

function Layout() {
  return (
    <div className="layout">
      <SecretShow />
      <Sidebar />
      <div className="layout-pane">
        <Match
          exactly
          pattern="/secrets/:path*"
          render={matchProps => (
            <div>
              <Match
                pattern="/secrets/all"
                render={() => <SecretListContainer {...matchProps} showAll />}
              />
              <Miss
                render={() => <SecretListContainer {...matchProps} />}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}


export default Layout;
