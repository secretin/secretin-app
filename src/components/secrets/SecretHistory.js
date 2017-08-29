import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';

import SecretDataRecord from 'models/SecretDataRecord';

import HistorySecretUIActions from 'actions/HistorySecretUIActions';
import HistorySecretUIStore from 'stores/HistorySecretUIStore';

import SecretFields from 'components/secrets/SecretFields';

class SecretHistory extends Component {
  static propTypes = {
    data: PropTypes.instanceOf(SecretDataRecord),
    canUpdate: PropTypes.bool,
    lastModifiedAt: PropTypes.string,
    lastModifiedBy: PropTypes.string,
  };

  static getStores() {
    return [HistorySecretUIStore];
  }

  static getPropsFromStores() {
    const {
      data,
      lastModifiedAt,
      lastModifiedBy,
    } = HistorySecretUIStore.getHistoryData();
    return {
      data,
      lastModifiedAt,
      lastModifiedBy,
    };
  }

  handlePrevious() {
    HistorySecretUIActions.changeHistory(1);
  }

  handleNext() {
    HistorySecretUIActions.changeHistory(-1);
  }

  render() {
    if (!this.props.data) {
      return <pre>Loading...</pre>;
    }

    return (
      <div className="secret-edit">
        <div className="secret-history">
          <span onClick={this.handlePrevious}>Previous</span>At{' '}
          {this.props.lastModifiedAt} by {this.props.lastModifiedBy}
          <span onClick={this.handleNext}>Next</span>
        </div>
        <SecretFields
          fields={this.props.data.get('fields')}
          onChange={
            this.props.canUpdate ? HistorySecretUIActions.changeField : () => {}
          }
          canUpdate={false}
        />
      </div>
    );
  }
}

export default connectToStores(SecretHistory);
