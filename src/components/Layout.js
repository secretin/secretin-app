import React from 'react';
import MatchGroup from 'react-router/MatchGroup';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import Redirect from 'react-router/Redirect';

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
        <MatchGroup>
          <Match
            pattern="/secrets/:path*"
            render={matchProps =>
              <MatchGroup>
                <Match
                  pattern="/secrets/all"
                  render={() => <SecretListContainer {...matchProps} showAll />}
                />
                <Match
                  pattern="/secrets/mine"
                  render={() =>
                    <SecretListContainer {...matchProps} showMine />}
                />
                <Match
                  pattern="/secrets/shared"
                  render={() =>
                    <SecretListContainer {...matchProps} showShared />}
                />
                <Miss render={() => <SecretListContainer {...matchProps} />} />
              </MatchGroup>}
          />
          <Match pattern="/settings/" render={() => <OptionsContainer />} />
          <Miss render={() => <Redirect to="/secrets/" />} />
        </MatchGroup>
      </div>
    </div>
  );
}

export default Layout;
