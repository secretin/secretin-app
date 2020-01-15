import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import classNames from 'classnames';
import { escapeRegExp } from 'lodash';
import AppUIStore from 'stores/AppUIStore';
import MetadataStore from 'stores/MetadataStore';

import SecretListItem from 'components/secrets/SecretListItem';
import SecretListFolderInfo from 'components/secrets/SecretListFolderInfo';

class SecretListContent extends Component {
  static propTypes = {
    filtered: PropTypes.bool,
    secrets: PropTypes.instanceOf(Immutable.Map),
    isDragging: PropTypes.bool,
    folders: PropTypes.instanceOf(Immutable.List),
    searchQuery: PropTypes.string,
    endDecrypt: PropTypes.bool,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.endDecrypt ||
      nextProps.searchQuery !== this.props.searchQuery ||
      nextProps.filtered !== this.props.filtered ||
      nextProps.folders.size !== this.props.folders.size
    );
  }

  render() {
    const className = classNames('secret-list-content-table', {
      'secret-list-content-table--is-dragging': this.props.isDragging,
    });
    const fuzzyRegexp = new RegExp(
      this.props.searchQuery
        .split('')
        .map(c => escapeRegExp(c))
        .join('.*'),
      'i'
    );

    let filteredSecrets = this.props.secrets.filter(secret =>
      fuzzyRegexp.test(secret.title)
    );

    let filteredFolders = new Immutable.Map();

    const currentUser = AppUIStore.getCurrentUser();

    if (this.props.filtered) {
      const allFolders = MetadataStore.getAllFolders();
      filteredSecrets.forEach(secret => {
        let folderSeq = secret
          .getIn(['users', currentUser.username, 'folders'])
          .entrySeq()
          .first();
        if (typeof folderSeq === 'undefined') {
          folderSeq = ['ROOT'];
        }
        filteredFolders = filteredFolders.setIn(
          [folderSeq[0], 'secrets', secret.id],
          secret
        );
        if (folderSeq[0] === 'ROOT') {
          filteredFolders = filteredFolders.setIn([folderSeq[0], 'name'], '');
          filteredFolders = filteredFolders.setIn([folderSeq[0], 'root'], true);
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
          filteredFolders = filteredFolders.setIn(
            [folderSeq[0], 'name'],
            breadcrumb.join('/')
          );
          filteredFolders = filteredFolders.setIn(
            [folderSeq[0], 'breadcrumb'],
            breadcrumb
          );
        }
      });

      filteredFolders = filteredFolders
        .sortBy(folder => folder.get('name').toLowerCase())
        .sortBy(folder => !folder.has('root'));
    } else {
      filteredSecrets = filteredSecrets.sortBy(secret =>
        secret.get('title').toLowerCase()
      );
    }

    return (
      <table className={className}>
        <thead className="secret-list-content-table-header">
          <tr>
            <th className="secret-list-item-column--title">Title</th>
            <th className="secret-list-item-column--last-modified">
              Last modified
            </th>
            <th className="secret-list-item-column--shared-with">
              Shared with
            </th>
            <th className="secret-list-item-column--actions" />
          </tr>
        </thead>
        {this.props.filtered ? (
          filteredFolders
            .map((folder, id) => (
              <SecretListFolderInfo key={id} folder={folder} />
            ))
            .toArray()
        ) : (
          <tbody className="secret-list-content-table-body">
            {filteredSecrets
              .map(secret => (
                <SecretListItem
                  key={secret.id}
                  secret={secret}
                  folders={this.props.folders}
                />
              ))
              .toArray()}
          </tbody>
        )}
      </table>
    );
  }
}

export default SecretListContent;
