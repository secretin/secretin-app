import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';

import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';
import SecretHistoryButton from 'components/secrets/SecretHistoryButton';
import SecretEdit from 'components/secrets/SecretEdit';

class SecretHistory extends Component {
  static propTypes = {
    data: PropTypes.object,
    historyDepth: PropTypes.number,
    historyCount: PropTypes.number,
    modifiedAt: PropTypes.string,
    isLatest: PropTypes.bool,
    isOldest: PropTypes.bool,
    dispatch: PropTypes.func,
    actions: PropTypes.object,
  };

  render() {
    const {
      historyDepth,
      historyCount,
      modifiedAt,
      isLatest,
      isOldest,
      data,
    } = this.props;
    const { historyShowOlder, historyShowNewer } = this.props.actions;
    const color = isLatest ? '#1abc9c' : '#afafaf';
    return (
      <div className="secret-history">
        <div
          className="secret-history-header"
          style={{
            backgroundColor: color,
            borderColor: color,
          }}
        >
          <div className="secret-history-navigation">
            <SecretHistoryButton
              disabled={historyDepth >= historyCount - 1}
              side="previous"
              onClick={historyShowOlder}
            />
            <SecretHistoryButton
              disabled={historyDepth <= 0}
              side="next"
              onClick={historyShowNewer}
            />
          </div>
          <span
            style={{ color: 'white', fontWeight: '600' }}
            title={moment(modifiedAt).format('MMM Do, YYYY HH:mm')}
          >
            {isLatest && <FormattedMessage id="latest" />}
            {isOldest && <FormattedMessage id="oldest" />}{' '}
            {moment(modifiedAt).fromNow()}
          </span>
        </div>
        <div className="secret-history-fields">
          <SecretEdit isUpdating={false} canUpdate={false} data={data} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { secret, historyDepth } = state.ShowSecretUI;
  return {
    data: secret?.history[historyDepth]?.secret,
    modifiedAt: secret?.history[historyDepth]?.lastModifiedAt,
    historyCount: secret?.history.length,
    historyDepth,
    isLatest: historyDepth === 0,
    isOldest: historyDepth + 1 >= secret?.history.length,
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ShowSecretUIActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SecretHistory);
