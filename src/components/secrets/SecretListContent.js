import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { escapeRegExp, set } from 'lodash';

import SecretListItem from 'components/secrets/SecretListItem';
import SecretListFolderInfo from 'components/secrets/SecretListFolderInfo';

class SecretListContent extends Component {
  static propTypes = {
    filtered: PropTypes.bool,
    secrets: PropTypes.array,
    isDragging: PropTypes.bool,
    folders: PropTypes.array,
    searchQuery: PropTypes.string,
    endDecrypt: PropTypes.bool,
    currentUser: PropTypes.object,
    allFolders: PropTypes.array,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.endDecrypt ||
      nextProps.searchQuery !== this.props.searchQuery ||
      nextProps.filtered !== this.props.filtered ||
      nextProps.folders.length !== this.props.folders.length
    );
  }

  render() {
    const { allFolders, currentUser } = this.props;
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

    let filteredFolders = {};
    let sortedFolders = [];

    const getUser = (users, username) =>
      users.find(user => user.id === username);

    if (this.props.filtered) {
      filteredSecrets.forEach(secret => {
        let folder = 'ROOT';
        const user = getUser(secret.users, currentUser.username);
        if (user) folder = Object.keys(user.folders)[0];
        if (typeof folder === 'undefined') {
          folder = 'ROOT';
        }
        set(filteredFolders, `${folder}.secrets.${secret.id}`, secret);
        if (folder === 'ROOT') {
          filteredFolders[folder].name = '';
          filteredFolders[folder].root = true;
        } else {
          let root = false;
          let breadcrumb = [];
          let fullName = [];
          let currentFolder = folder;
          while (!root) {
            const currentFolderDetails = allFolders.find(
              fold => fold.id === currentFolder
            );
            fullName.unshift(currentFolderDetails.title);
            root = Object.keys(
              getUser(currentFolderDetails.users, currentUser.username).folders
            ).includes('ROOT');

            breadcrumb.unshift(currentFolder);
            currentFolder = Object.keys(
              getUser(currentFolderDetails.users, currentUser.username).folders
            )[0];
          }
          filteredFolders[folder].name = fullName.join('/');
          filteredFolders[folder].breadcrumb = breadcrumb;
        }
      });
      sortedFolders = Object.entries(filteredFolders).map(([id, folder]) => ({
        ...folder,
        id,
      }));
      sortedFolders.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      sortedFolders.sort((a, b) => a.root);
    } else {
      filteredSecrets.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
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
          sortedFolders.map(folder => (
            <SecretListFolderInfo key={folder.id} folder={folder} />
          ))
        ) : (
          <tbody className="secret-list-content-table-body">
            {filteredSecrets.map(secret => (
              <SecretListItem
                key={secret.id}
                secret={secret}
                folders={this.props.folders}
              />
            ))}
          </tbody>
        )}
      </table>
    );
  }
}

const mapStateToProps = state => {
  const { currentUser } = state.AppUI;
  const allFolders =
    Object.values(state.Metadata.metadata).filter(
      secret => secret.type === 'folder'
    ) || [];

  return {
    currentUser,
    allFolders,
  };
};

export default connect(mapStateToProps)(SecretListContent);
