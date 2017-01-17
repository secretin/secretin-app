import React, { PropTypes } from 'react';
import Link from 'react-router/Link';

import AppUIStore from 'stores/AppUIStore';
import Icon from 'components/utilities/Icon';

function SidebarMenuLink({ children, ...props }) {
  return (
    <li className="sidebar-menu-item">
      <Link
        className="sidebar-menu-link"
        activeClassName="sidebar-menu-link--active"
        {...props}
      >
        {children}
      </Link>
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
        <Link to="/">
          Secret-In.me
        </Link>
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <SidebarMenuLink to="/secrets/" activeOnlyWhenExact>
            <Icon id="home" size="base" />
            {currentUser.username}
          </SidebarMenuLink>
          <div className="sidebar-separator">
            <div />
          </div>
          <SidebarMenuLink to="/secrets/all/">
            <Icon id="apps" size="base" />
            All
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/mine" activeOnlyWhenExact>
            <Icon id="user" size="base" />
            My secrets
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/shared" activeOnlyWhenExact>
            <Icon id="people" size="base" />
            Shared secrets
          </SidebarMenuLink>
          <div className="sidebar-separator">
            <div />
          </div>
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
