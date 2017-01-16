import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { escapeRegExp } from 'lodash';
import Immutable from 'immutable';


import AppUIStore from 'stores/AppUIStore';
import Secret from 'models/Secret';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';
import SecretListRefresh from 'components/secrets/SecretListRefresh';
import SecretListNew from 'components/secrets/SecretListNew';
import SecretListSearch from 'components/secrets/SecretListSearch';
import SecretListItem from 'components/secrets/SecretListItem';
import SecretListFolderInfo from 'components/secrets/SecretListFolderInfo';

import Button from 'components/utilities/Button';
import Title from 'components/utilities/Title';

import NewSecretUIActions from 'actions/NewSecretUIActions';

class SecretList extends Component {

  static propTypes = {
    folder: PropTypes.instanceOf(Secret),
    folders: PropTypes.instanceOf(Immutable.List),
    secrets: PropTypes.instanceOf(Immutable.Map),
    searchQuery: PropTypes.string,
    showAll: PropTypes.bool,
    showMine: PropTypes.bool,
    showShared: PropTypes.bool,
  }

  static defaultProps = {
    folders: new Immutable.List(),
    secrets: new Immutable.Map(),
    searchQuery: '',
    showAll: false,
    showMine: false,
    showShared: false,
  }

  constructor(props) {
    super(props);

    this.onSearch = this.onSearch.bind(this);

    this.state = {
      searchQuery: props.searchQuery,
    };
  }

  onSearch(searchQuery) {
    this.setState({ searchQuery });
  }

  renderList() {
    const fuzzyRegexp = new RegExp(
      this.state.searchQuery.split('').map(c => escapeRegExp(c)).join('.*'),
      'i'
    );

    const filtered = this.props.showAll || this.props.showMine || this.props.showShared;

    let secrets = this.props.secrets
      .filter(secret => fuzzyRegexp.test(secret.title));

    let folders = new Immutable.Map();

    const currentUser = AppUIStore.getCurrentUser();

    if (filtered) {
      secrets.forEach((secret) => {
        const foldersSeq = secret.getIn(['users', currentUser.username, 'folders']).entrySeq();
        foldersSeq.forEach((folder) => {
          folders = folders.setIn([folder[0], 'secrets', secret.id], secret);
          if (folder[0] === 'ROOT') {
            folders = folders.setIn([folder[0], 'name'], '');
            folders = folders.setIn([folder[0], 'root'], true);
          } else {
            folders = folders.setIn([folder[0], 'name'], folder[1].get('name'));
          }
        });
      });

      folders = folders.sortBy(folder => folder.get('name').toLowerCase()).sortBy(folder => !folder.has('root'));
    } else {
      secrets = secrets.sortBy(secret => secret.get('title').toLowerCase());
    }

    return (
      <table className="secret-list-content-table">
        <thead className="secret-list-content-table-header">
          <tr>
            <th className="secret-list-item-column--title" >
              Title
            </th>
            <th className="secret-list-item-column--last-modified" >
              Last modified
            </th>
            <th className="secret-list-item-column--shared-with" >
              Shared with
            </th>
            <th className="secret-list-item-column--actions" />
          </tr>
        </thead>
        {
          filtered ?
            folders.map((folder, id) => (
              <SecretListFolderInfo key={id} folder={folder} />
            )).toArray()
          :
            <tbody className="secret-list-content-table-body">
              {
                secrets.map(secret => (
                  <SecretListItem
                    key={secret.id}
                    secret={secret}
                    folders={this.props.folders}
                  />
                )).toArray()
              }
            </tbody>
        }
      </table>
    );
  }

  renderPlaceholder() {
    let folderId = null;
    if (this.props.folder) {
      folderId = this.props.folder.id;
    }

    if (!this.props.showShared) {
      return (
        <div className="secret-list-placeholder">
          <h1 className="secret-list-placeholder-title">
            You don&apos;t have any secrets, yet
          </h1>
          <p className="secret-list-placeholder-text">
            Start adding some now
          </p>
          <div className="secret-list-placeholder-actions">
            <Button
              onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: true })}
            >
              New folder
            </Button>
            <Button
              onClick={() => NewSecretUIActions.showModal({ folder: folderId, isFolder: false })}
            >
              New secret
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="secret-list-placeholder">
        <h1 className="secret-list-placeholder-title">
          Nobody shared secret with you yet
        </h1>
      </div>
    );
  }

  render() {
    let icon;
    let title;
    let link;
    let filtered = false;
    if (this.props.showAll) {
      icon = 'apps';
      title = 'All';
      link = '/secrets/all/';
      filtered = true;
    } else if (this.props.showMine) {
      icon = 'user';
      title = 'My secrets';
      link = '/secrets/mine/';
      filtered = true;
    } else if (this.props.showShared) {
      icon = 'people';
      title = 'Shared secrets';
      link = '/secrets/shared/';
      filtered = true;
    }
    return (
      <div className="page">
        <div className="page-header">
          {
            filtered ?
              <div className="breadcrumb">
                <Title icon={icon} title={title} link={link} />
              </div> :
              <SecretListBreadcrumb folders={this.props.folders} />
          }
          <SecretListRefresh />
          <SecretListSearch onChange={this.onSearch} />
        </div>

        <div className="page-content">
          <div className="page-content-actions">
            {
              !this.props.showAll && !this.props.showMine && !this.props.showShared &&
                <SecretListNew folder={this.props.folder} />
            }
          </div>
          {
            this.props.secrets.isEmpty() ? this.renderPlaceholder() : this.renderList()
          }
        </div>
      </div>
    );
  }
}

export default new DragDropContext(HTML5Backend)(SecretList);
