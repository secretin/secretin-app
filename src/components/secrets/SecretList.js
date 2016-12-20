import React, { Component, PropTypes } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { escapeRegExp } from 'lodash';
import Immutable from 'immutable';

import Secret from 'models/Secret';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';
import SecretListNew from 'components/secrets/SecretListNew';
import SecretListSearch from 'components/secrets/SecretListSearch';
import SecretListItem from 'components/secrets/SecretListItem';
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
  }

  static defaultProps = {
    folders: new Immutable.List(),
    secrets: new Immutable.Map(),
    searchQuery: '',
    showAll: false,
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

    const secrets = this.props.secrets
      .filter(secret => fuzzyRegexp.test(secret.title))
      .sortBy(secret => secret.get('title').toLowerCase());

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
      </table>
    );
  }

  renderPlaceholder() {
    let folderId = null;
    if (this.props.folder) {
      folderId = this.props.folder.id;
    }

    return (
      <div className="secret-list-placeholder">
        <h1 className="secret-list-placeholder-title">
          {"You don't have any secrets, yet"}
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

  render() {
    return (
      <div className="secret-list">
        <div className="secret-list-header">
          {
            this.props.showAll ?
              <div className="secret-list-breadcrumb">
                <Title icon="apps" title="All" link="/secrets/all/" />
              </div> :
              <SecretListBreadcrumb folders={this.props.folders} />
          }
          <SecretListNew folder={this.props.folder} writable={!this.props.showAll} />
          <SecretListSearch onChange={this.onSearch} />
        </div>

        <div className="secret-list-content">
          {
            this.props.secrets.isEmpty() ? this.renderPlaceholder() : this.renderList()
          }
        </div>
      </div>
    );
  }
}

export default new DragDropContext(HTML5Backend)(SecretList);
