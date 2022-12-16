import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import secretin from 'utils/secretin';
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
  secretin.exportDb().then(db => {
    download(
      `Secret-in_${secretin.currentUser.username}_${moment().format()}.json`,
      db
    );
  });
}

function Sidebar() {
  const currentUser = useSelector(state => state.AppUI.currentUser);
  const isOnline = useSelector(state => state.AppUI.online);
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" title={isOnline && secretin.api.db}>
          <img
            src="/logo.svg"
            style={{ width: '100%' }}
            alt="logo"
            title={isOnline ? 'Secret-In.me' : 'Offline'}
          ></img>
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
            <FormattedMessage id="all" />
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/mine" exact>
            <Icon id="user" size="base" />
            <FormattedMessage id="my secrets" />
          </SidebarMenuLink>
          <SidebarMenuLink to="/secrets/shared" exact>
            <Icon id="people" size="base" />
            <FormattedMessage id="shared secrets" />
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <SidebarMenuLink to="/settings/">
            <Icon id="gear" size="base" />
            <FormattedMessage id="settings" />
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <li className="sidebar-menu-item">
            <a className="sidebar-menu-link" onClick={exportDb}>
              <Icon id="export" size="base" />
              <FormattedMessage id="export secrets" />
            </a>
          </li>
          <SidebarMenuLink to="/import/">
            <Icon id="import" size="base" />
            <FormattedMessage id="import secrets" />
          </SidebarMenuLink>
          <div className="sidebar-separator" />
          <li className="sidebar-menu-item">
            <a
              className="sidebar-menu-link"
              onClick={() => window.location.reload()}
            >
              <Icon id="logout" size="base" />
              <FormattedMessage id="logout" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
