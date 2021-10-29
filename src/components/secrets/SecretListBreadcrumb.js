import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { NavLink } from 'react-router-dom';

import { buildSecretURL } from 'utils/URLHelper';

import Icon from 'components/utilities/Icon';
import Title from 'components/utilities/Title';

const propTypes = {
  folders: PropTypes.instanceOf(Immutable.List),
  withTitle: PropTypes.bool,
};

const defaultProps = {
  folders: new Immutable.List(),
  withTitle: true,
};

function SecretListBreadcrumb({ folders, withTitle }) {
  const currentUser = useSelector(state => state.AppUI.currentUser);
  const metadata = useSelector(state => state.Metadata.metadata);

  const breadcrumbURLs = folders.reduce(
    (memo, folderId) =>
      memo.push({
        folderId,
        link: buildSecretURL(
          new Immutable.List([folderId]),
          memo.last() ? memo.last().link : undefined
        ),
      }),
    new Immutable.List()
  );

  let breadcrumb = breadcrumbURLs.reduce((links, { folderId, link }, key) => {
    const folder = metadata[folderId];
    if (!folder) {
      return links;
    }

    return links
      .push(
        <div key={key} className="breadcrumb-item">
          <NavLink
            to={link}
            className="breadcrumb-link"
            activeClassName="breadcrumb-link--active"
            exact
          >
            {folder.title}
          </NavLink>
        </div>
      )
      .push(
        <Icon
          key={`${key}-sep`}
          id="chevron-right"
          className="breadcrumb-item-separator"
        />
      );
  }, new Immutable.List());

  if (withTitle) {
    breadcrumb = breadcrumb
      .unshift(
        <Icon
          key="home-sep"
          id="chevron-right"
          className="breadcrumb-item-separator"
        />
      )
      .unshift(
        <Title
          key="home"
          title={currentUser.username}
          icon="home"
          link="/secrets/"
        />
      );
  }

  return <div className="breadcrumb">{breadcrumb}</div>;
}
SecretListBreadcrumb.propTypes = propTypes;
SecretListBreadcrumb.defaultProps = defaultProps;

export default SecretListBreadcrumb;
