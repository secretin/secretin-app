import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';
import SecretHistoryButton from 'components/secrets/SecretHistoryButton';
import SecretEdit from 'components/secrets/SecretEdit';

class SecretHistory extends Component {
  static propTypes = {
    data: PropTypes.object,
    historyDepth: PropTypes.number,
    historyCount: PropTypes.number,
    modifiedAt: PropTypes.string,
    dispatch: PropTypes.func,
    actions: PropTypes.object,
  };

  render() {
    const { historyDepth, historyCount } = this.props;
    return (
      <div className="secret-history">
        <div className="secret-history-header">
          <div className="secret-history-navigation">
            <SecretHistoryButton
              disabled={historyDepth >= historyCount - 1}
              side="previous"
              onClick={this.props.actions.historyShowOlder}
            />
            <SecretHistoryButton
              disabled={historyDepth <= 0}
              side="next"
              onClick={this.props.actions.historyShowNewer}
            />
          </div>
          <span
            title={moment(this.props.modifiedAt).format('MMM Do, YYYY HH:mm')}
          >
            {moment(this.props.modifiedAt).fromNow()}
          </span>
        </div>
        <div className="secret-history-fields">
          <SecretEdit
            isUpdating={false}
            canUpdate={false}
            data={this.props.data}
          />
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
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ShowSecretUIActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SecretHistory);
