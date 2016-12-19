import React, { PropTypes } from 'react';
import Link from 'react-router/Link';
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
    <div className="secret-list-breadcrumb-item">
      <Link
        to={link}
        className="secret-list-breadcrumb-link"
        activeClassName="secret-list-breadcrumb-link--active"
        activeOnlyWhenExact
      >
        <Icon id={icon} size="base" />
        {title}
      </Link>
    </div>
  );
}
Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

export default Title;
