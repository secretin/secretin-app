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
  const breadcrumbURLs = folders.reduce((memo, folder) => (
    memo.set(
      folder,
      buildSecretURL(
        new Immutable.List([folder]),
        memo.last()
      )
    )
  ), new Immutable.OrderedMap());

  const breadcrumb = breadcrumbURLs.reduce((links, link, folderId) => {
    const folder = MetadataStore.getById(folderId);
    if (!folder) {
      return links;
    }

    return links
      .push(
        <div key={folder} className="secret-list-breadcrumb-item">
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
        <Icon key={`${folder}-sep`} id="chevron-right" />
      );
  }, new Immutable.List());

  return (
    <div className="secret-list-breadcrumb">
      {
        breadcrumb
          .unshift(<Icon key="home-sep" id="chevron-right" />)
          .unshift(
            <div key="home" className="secret-list-breadcrumb-item">
              <Link
                to="/secrets/"
                className="secret-list-breadcrumb-link"
                activeClassName="secret-list-breadcrumb-link--active"
                activeOnlyWhenExact
              >
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
