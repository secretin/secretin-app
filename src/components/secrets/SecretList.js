import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragLayer } from 'react-dnd';
import { escapeRegExp } from 'lodash';
import Immutable from 'immutable';
import classNames from 'classnames';

import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';
import Secret from 'models/Secret';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';
import SecretListRefresh from 'components/secrets/SecretListRefresh';
import SecretListNew from 'components/secrets/SecretListNew';
import SecretListSearch from 'components/secrets/SecretListSearch';
import SecretListItem from 'components/secrets/SecretListItem';
import SecretListFolderInfo from 'components/secrets/SecretListFolderInfo';
import UserConnectProgress from 'components/users/UserConnectProgress';

import Button from 'components/utilities/Button';
import Title from 'components/utilities/Title';

import NewSecretUIActions from 'actions/NewSecretUIActions';

class SecretList extends Component {
  static propTypes = {
    folder: PropTypes.instanceOf(Secret),
    folders: PropTypes.instanceOf(Immutable.List),
    secrets: PropTypes.instanceOf(Immutable.Map),
    searchQuery: PropTypes.string,
    isDragging: PropTypes.bool,
    showAll: PropTypes.bool,
    showMine: PropTypes.bool,
    showShared: PropTypes.bool,
  };

  static defaultProps = {
    folders: new Immutable.List(),
    secrets: new Immutable.Map(),
    searchQuery: '',
    showAll: false,
    showMine: false,
    showShared: false,
  };

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
    const className = classNames('secret-list-content-table', {
      'secret-list-content-table--is-dragging': this.props.isDragging,
    });
    const fuzzyRegexp = new RegExp(
      this.state.searchQuery.split('').map(c => escapeRegExp(c)).join('.*'),
      'i'
    );

    const filtered =
      this.props.showAll || this.props.showMine || this.props.showShared;

    let secrets = this.props.secrets.filter(secret =>
      fuzzyRegexp.test(secret.title)
    );

    let folders = new Immutable.Map();

    const currentUser = AppUIStore.getCurrentUser();

    if (filtered) {
      const allFolders = MetadataStore.getAllFolders();
      secrets.forEach(secret => {
        const folderSeq = secret
          .getIn(['users', currentUser.username, 'folders'])
          .entrySeq()
          .first();
        folders = folders.setIn([folderSeq[0], 'secrets', secret.id], secret);
        if (folderSeq[0] === 'ROOT') {
          folders = folders.setIn([folderSeq[0], 'name'], '');
          folders = folders.setIn([folderSeq[0], 'root'], true);
        } else {
          let root = false;
          let breadcrumb = Immutable.List();
          let currentFolder = folderSeq;
          while (!root) {
            root = allFolders
              .getIn([
                currentFolder[0],
                'users',
                currentUser.username,
                'folders',
              ])
              .has('ROOT');
            breadcrumb = breadcrumb.unshift(currentFolder[0]);
            currentFolder = allFolders
              .getIn([
                currentFolder[0],
                'users',
                currentUser.username,
                'folders',
              ])
              .entrySeq()
              .first();
          }
          folders = folders.setIn([folderSeq[0], 'name'], breadcrumb.join('/'));
          folders = folders.setIn([folderSeq[0], 'breadcrumb'], breadcrumb);
        }
      });

      folders = folders
        .sortBy(folder => folder.get('name').toLowerCase())
        .sortBy(folder => !folder.has('root'));
    } else {
      secrets = secrets.sortBy(secret => secret.get('title').toLowerCase());
    }

    return (
      <table className={className}>
        <thead className="secret-list-content-table-header">
          <tr>
            <th className="secret-list-item-column--title">
              Title
            </th>
            <th className="secret-list-item-column--last-modified">
              Last modified
            </th>
            <th className="secret-list-item-column--shared-with">
              Shared with
            </th>
            <th className="secret-list-item-column--actions" />
          </tr>
        </thead>
        {filtered
          ? folders
              .map((folder, id) =>
                <SecretListFolderInfo key={id} folder={folder} />
              )
              .toArray()
          : <tbody className="secret-list-content-table-body">
              {secrets
                .map(secret =>
                  <SecretListItem
                    key={secret.id}
                    secret={secret}
                    folders={this.props.folders}
                  />
                )
                .toArray()}
            </tbody>}
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
              onClick={() =>
                NewSecretUIActions.showModal({
                  folder: folderId,
                  isFolder: true,
                })}
            >
              New folder
            </Button>
            <Button
              onClick={() =>
                NewSecretUIActions.showModal({
                  folder: folderId,
                  isFolder: false,
                })}
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
          {filtered
            ? <div className="breadcrumb">
                <Title icon={icon} title={title} link={link} />
              </div>
            : <SecretListBreadcrumb folders={this.props.folders} />}
          <SecretListRefresh />
          <SecretListSearch onChange={this.onSearch} />
        </div>

        {AppUIStore.isLoading()
          ? <UserConnectProgress status={AppUIStore.getState().get('status')} />
          : <div className="page-content">
              {!this.props.showAll &&
                !this.props.showMine &&
                !this.props.showShared &&
                <div className="page-content-actions">
                  <SecretListNew folder={this.props.folder} />
                </div>}
              {this.props.secrets.isEmpty()
                ? this.renderPlaceholder()
                : this.renderList()}
            </div>}
      </div>
    );
  }
}

function layerCollect(monitor) {
  return {
    isDragging: monitor.isDragging(),
  };
}

export default new DragDropContext(HTML5Backend)(
  DragLayer(layerCollect)(SecretList)
);
