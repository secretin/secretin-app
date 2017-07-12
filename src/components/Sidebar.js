import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import NavLink from 'react-router-dom/NavLink';

import secretin from 'utils/secretin';
import AppUIStore from 'stores/AppUIStore';
import Icon from 'components/utilities/Icon';

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    `data:application/json;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function SidebarMenuLink({ children, ...props }) {
  return (
    <li className="sidebar-menu-item">
      <NavLink
        className="sidebar-menu-link"
        activeClassName="sidebar-menu-link--active"
        {...props}
      >
        {children}
      </NavLink>
    </li>
  );
}
SidebarMenuLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
};

function exportDb() {
  secretin.getDb().then(db => {
    download(
      `Secret-in_${secretin.currentUser.username}_${Date.now()}.json`,
      db
    );
  });
}

function Sidebar() {
  const currentUser = AppUIStore.getCurrentUser();
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" title={AppUIStore.isOnline() && secretin.api.db}>
          {AppUIStore.isOnline() ? 'Secret-In.me' : 'Offline'}
        </Link>
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <SidebarMenuLink to="/secrets/" exact>
            <Icon id="home" size="base" />
            {currentUser.username}
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <SidebarMenuLink to="/secrets/all/">
            <Icon id="apps" size="base" />
            All
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/mine" exact>
            <Icon id="user" size="base" />
            My secrets
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/shared" exact>
            <Icon id="people" size="base" />
            Shared secrets
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <SidebarMenuLink to="/settings/">
            <Icon id="gear" size="base" />
            Settings
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <li className="sidebar-menu-item">
            <a className="sidebar-menu-link" onClick={exportDb}>
              <Icon id="export" size="base" />
              Export secrets
            </a>
          </li>
          <SidebarMenuLink to="/import/">
            <Icon id="import" size="base" />
            Import secrets
          </SidebarMenuLink>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
