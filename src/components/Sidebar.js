import React, { PropTypes } from 'react';
import Link from 'react-router/Link';

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
            Home
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/all/">
            <Icon id="apps" size="base" />
            All
          </SidebarMenuLink>
          <SidebarMenuLink to="/options/">
            <Icon id="gear" size="base" />
            Options
          </SidebarMenuLink>
        </ul>
      </div>
    </div>
  );
}


export default Sidebar;
