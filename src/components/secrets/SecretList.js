import React, { Component, PropTypes } from 'react';
import { escapeRegExp } from 'lodash';
import Immutable from 'immutable';

import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';
import SecretListNew from 'components/secrets/SecretListNew';
import SecretListSearch from 'components/secrets/SecretListSearch';
import SecretListItem from 'components/secrets/SecretListItem';

class SecretList extends Component {

  static propTypes = {
    folder: PropTypes.any,
    folders: PropTypes.instanceOf(Immutable.List),
    secrets: PropTypes.instanceOf(Immutable.Map),
    searchQuery: PropTypes.string,
  }

  static defaultProps = {
    folders: new Immutable.List(),
    secrets: new Immutable.Map(),
    searchQuery: '',
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

  render() {
    const fuzzyRegexp = new RegExp(
      this.state.searchQuery.split('').map(c => escapeRegExp(c)).join('.*'),
      'i'
    );

    const secrets = this.props.secrets
      .filter(secret => fuzzyRegexp.test(secret.title))
      .sortBy(secret => secret.get('title').toLowerCase());

    return (
      <div className="secret-list">
        <div className="secret-list-header">
          <SecretListBreadcrumb folders={this.props.folders} />
          <SecretListNew folder={this.props.folder} />
          <SecretListSearch onChange={this.onSearch} />
        </div>

        <div className="secret-list-content">
          <table className="secret-list-content-table">
            <thead className="secret-list-content-table-header">
              <tr>
                <th className="secret-list-content-table-column--title" >
                  Title
                </th>
                <th className="secret-list-content-table-column--last-modified" >
                  Last modified
                </th>
                <th className="secret-list-content-table-column--shared-with" >
                  Shared with
                </th>
                <th className="secret-list-content-table-column--actions" />
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
        </div>
      </div>
    );
  }
}

export default SecretList;
