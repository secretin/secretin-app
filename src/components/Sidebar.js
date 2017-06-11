import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import NavLink from 'react-router-dom/NavLink';

import secretin from 'utils/secretin';
import AppUIStore from 'stores/AppUIStore';
import Icon from 'components/utilities/Icon';

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
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
