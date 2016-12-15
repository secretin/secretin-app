import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Link from 'react-router/Link';

import { buildSecretURL } from 'utils/URLHelper';
import MetadataStore from 'stores/MetadataStore';

import Icon from 'components/utilities/Icon';

const propTypes = {
  folders: PropTypes.instanceOf(Immutable.List),
};

const defaultProps = {
  folders: new Immutable.List(),
};

function SecretListBreadcrumb({ folders }) {
  const breadcrumbURLs = folders.reduce((memo, folderId) => (
    memo.push({
      folderId,
      link: buildSecretURL(
        new Immutable.List([folderId]),
        memo.last() ? memo.last().link : undefined,
      ),
    })
  ), new Immutable.List());

  const breadcrumb = breadcrumbURLs.reduce((links, { folderId, link }, key) => {
    const folder = MetadataStore.getById(folderId);
    if (!folder) {
      return links;
    }

    return links
      .push(
        <div key={key} className="secret-list-breadcrumb-item">
          <Link
            to={link}
            className="secret-list-breadcrumb-link"
            activeClassName="secret-list-breadcrumb-link--active"
            activeOnlyWhenExact
          >
            {folder.title}
          </Link>
        </div>
      )
      .push(
        <Icon
          key={`${key}-sep`}
          id="chevron-right"
          className="secret-list-breadcrumb-item-separator"
        />
      );
  }, new Immutable.List());

  return (
    <div className="secret-list-breadcrumb">
      {
        breadcrumb
          .unshift(
            <Icon
              key="home-sep"
              id="chevron-right"
              className="secret-list-breadcrumb-item-separator"
            />
          )
          .unshift(
            <div key="home" className="secret-list-breadcrumb-item">
              <Link
                to="/secrets/"
                className="secret-list-breadcrumb-link"
                activeClassName="secret-list-breadcrumb-link--active"
                activeOnlyWhenExact
              >
                <Icon id="home" size="base" />
                Home
              </Link>
            </div>
          )
      }
    </div>
  );
}
SecretListBreadcrumb.propTypes = propTypes;
SecretListBreadcrumb.defaultProps = defaultProps;

export default SecretListBreadcrumb;
