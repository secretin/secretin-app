import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext, DragLayer } from 'react-dnd';
import { FormattedMessage } from 'react-intl';

import Secret from 'models/Secret';

import SecretListContent from 'components/secrets/SecretListContent';
import SecretListBreadcrumb from 'components/secrets/SecretListBreadcrumb';
import SecretListRefresh from 'components/secrets/SecretListRefresh';
import SecretListNew from 'components/secrets/SecretListNew';
import SecretListSearch from 'components/secrets/SecretListSearch';
import UserConnectProgress from 'components/users/UserConnectProgress';

import Title from 'components/utilities/Title';

class SecretList extends Component {
  static propTypes = {
    folder: PropTypes.instanceOf(Secret),
    folders: PropTypes.array,
    secrets: PropTypes.array,
    searchQuery: PropTypes.string,
    isDragging: PropTypes.bool,
    showAll: PropTypes.bool,
    showMine: PropTypes.bool,
    showShared: PropTypes.bool,
    status: PropTypes.string,
  };

  static defaultProps = {
    folders: [],
    secrets: {},
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

  render() {
    let icon;
    let title;
    let link;
    let filtered = false;
    if (this.props.showAll) {
      icon = 'apps';
      title = <FormattedMessage id="all" />;
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
          {filtered ? (
            <div className="breadcrumb">
              <Title icon={icon} title={title} link={link} />
            </div>
          ) : (
            <SecretListBreadcrumb folders={this.props.folders} />
          )}
          <SecretListRefresh />
          <SecretListSearch onChange={this.onSearch} />
        </div>

        <UserConnectProgress />
        <div className="page-content">
          <div className="page-content-actions">
            <SecretListNew
              showAddFolder={
                !this.props.showAll &&
                !this.props.showMine &&
                !this.props.showShared
              }
              folder={this.props.folder}
            />
          </div>
          <div className="secret-list-content-table-header">
            <div>
              <div className="secret-list-item-column--title">Title</div>
              <div className="secret-list-item-column--last-modified">
                Last modified
              </div>
              <div className="secret-list-item-column--shared-with">
                Shared with
              </div>
              <div className="secret-list-item-column--actions" />
            </div>
          </div>
          <SecretListContent
            filtered={filtered}
            secrets={this.props.secrets}
            folders={this.props.folders}
            isDragging={this.props.isDragging}
            searchQuery={this.state.searchQuery}
            endDecrypt={this.props.status === null}
          />
        </div>
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
