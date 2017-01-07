import React, { PropTypes } from 'react';

import ShowSecretUIActions from 'actions/ShowSecretUIActions';

import Icon from 'components/utilities/Icon';

const propTypes = {
  secret: PropTypes.any,
};

function SecretListItemWindows({ secret }) {
  return (
    <tr className="secret-list-item">
      <td className="secret-list-item-column--title">
        <a
          onClick={() => ShowSecretUIActions.showSecret({ secret })}
          tabIndex="-1"
        >
          <Icon id={secret.getIcon()} size="base" />
          <span className="text" title={secret.title}>
            {secret.title}
          </span>
        </a>
      </td>
      <td className="secret-list-item-column--last-modified">
        {secret.lastModifiedAt.fromNow()}
        {' - '}
        <span className="muted">{secret.lastModifiedBy}</span>
      </td>
      <td className="secret-list-item-column--shared-with" />
      <td className="secret-list-item-column--actions" />
    </tr>
  );
}
SecretListItemWindows.propTypes = propTypes;

export default SecretListItemWindows;
