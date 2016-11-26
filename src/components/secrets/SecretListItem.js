import React, { PropTypes } from 'react';
import Immutable from 'immutable';
import Link from 'react-router/Link';

import { buildSecretURL } from 'utils/URLHelper';
import AppUIStore from 'stores/AppUIStore';
import MetadataActions from 'actions/MetadataActions';
import ShowSecretUIActions from 'actions/ShowSecretUIActions';
import UserAvatars from 'components/users/UserAvatars';

import Dropdown from 'components/utilities/Dropdown';
import Icon from 'components/utilities/Icon';

const propTypes = {
  secret: PropTypes.any,
  folders: PropTypes.instanceOf(Immutable.List),
};

function SecretListItem({ secret, folders }) {
  const currentUser = AppUIStore.getCurrentUser();
  const users = secret.users.filterNot(user => user.id === currentUser.username);

  return (
    <tr className="secret-list-item">
      <td className="secret-list-item-title">
        {
          secret.type === 'folder' ? (
            <Link to={buildSecretURL(folders.push(secret.id))}>
              <Icon id={secret.getIcon()} size="base" />
              {secret.title}
            </Link>
          ) : (
            <a
              onClick={() => ShowSecretUIActions.showSecret({ secret })}
              tabIndex="-1"
            >
              <Icon id={secret.getIcon()} size="base" />
              {secret.title}
            </a>
          )
        }
      </td>
      <td className="secret-list-item-last-modified">
        {secret.lastModifiedAt.fromNow()}
        {' - '}
        <span className="muted">{secret.lastModifiedBy}</span>
      </td>
      <td className="secret-list-item-last-shared-with">
        {
          users.size > 0 ? (
            <UserAvatars users={users} />
          ) : (
            '––'
          )
        }
      </td>
      <td className="secret-list-item-last-actions">
        <Dropdown id="secret-action" pullRight>
          <Dropdown.Toggle>
            <Icon id="more-vert" size="small" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.MenuItem
              onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: 'details' })}
            >
              Show
            </Dropdown.MenuItem>
            <Dropdown.MenuItem
              onSelect={() => ShowSecretUIActions.showSecret({ secret, tab: 'access' })}
              disabled={!secret.canBeSharedBy(currentUser)}
            >
              Share
            </Dropdown.MenuItem>

            <Dropdown.MenuItem divider />

            <Dropdown.MenuItem
              onSelect={() => MetadataActions.deleteSecret({ secret })}
              disabled={!secret.canBeUpdatedBy(currentUser)}
            >
              Delete
            </Dropdown.MenuItem>
          </Dropdown.Menu>
        </Dropdown>
      </td>
    </tr>
  );
}

SecretListItem.propTypes = propTypes;

export default SecretListItem;
