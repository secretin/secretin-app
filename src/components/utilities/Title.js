import React from 'react';
import PropTypes from 'prop-types';
import NavLink from 'react-router-dom/NavLink';
import Icon from 'components/utilities/Icon';

const propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string,
};

const defaultProps = {
  icon: 'home',
  title: 'Home',
  link: '/secrets/',
};

function Title({ icon, title, link }) {
  return (
    <div className="breadcrumb-item">
      <NavLink
        to={link}
        className="breadcrumb-link"
        activeClassName="breadcrumb-link--active"
        exact
      >
        <Icon id={icon} size="base" />
        {title}
      </NavLink>
    </div>
  );
}
Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

export default Title;
