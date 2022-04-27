import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { escapeRegExp, set } from 'lodash';
import { List, AutoSizer } from 'react-virtualized';

import SecretListItem from 'components/secrets/SecretListItem';
import SecretListFolderInfo from 'components/secrets/SecretListFolderInfo';
import SecretListItemFolderSecret from 'components/secrets/SecretListItem/Secret';

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
    let sortedFolderRows = [];

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
      let sortedFolders = Object.entries(filteredFolders).map(
        ([id, folder]) => ({
          ...folder,
          id,
        })
      );
      sortedFolders.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      sortedFolders.sort((a, b) => a.root);
      sortedFolderRows = sortedFolders
        .map(folder => {
          const secrets = Object.values(folder.secrets);
          secrets.sort((a, b) => {
            if (a.title === null) return 1;
            if (b.title === null) return -1;
            return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
          });
          return [
            { rowType: 'header', rowData: folder },
            ...secrets.map(secret => ({ rowType: 'row', rowData: secret })),
          ];
        })
        .flat();
    } else {
      filteredSecrets.sort((a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      );
    }

    const renderFilteredRow = ({ index, key, style }) => {
      const { rowType, rowData } = sortedFolderRows[index];
      if (rowType === 'header') {
        return (
          <div key={key} style={style}>
            <SecretListFolderInfo key={rowData.id} folder={rowData} />
          </div>
        );
      }

      return (
        <div key={key} style={style}>
          <SecretListItemFolderSecret key={rowData.id} secret={rowData} />
        </div>
      );
    };

    const renderStandardRow = ({ index, key, style }) => {
      const secret = filteredSecrets[index];
      return (
        <div key={key} style={style}>
          <SecretListItem
            key={secret.id}
            secret={secret}
            folders={this.props.folders}
          />
        </div>
      );
    };

    const getRowHeight = ({ index }) => {
      if (this.props.filtered && sortedFolderRows[index].rowType === 'header') {
        const folder = sortedFolderRows[index].rowData;
        if (folder.root) return 0;
        return 75;
      }
      return 50;
    };

    return (
      <div className={className}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                width={width}
                height={height}
                rowHeight={getRowHeight}
                rowRenderer={
                  this.props.filtered ? renderFilteredRow : renderStandardRow
                }
                rowCount={
                  this.props.filtered
                    ? sortedFolderRows.length
                    : filteredSecrets.length
                }
              />
            );
          }}
        </AutoSizer>
      </div>
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
