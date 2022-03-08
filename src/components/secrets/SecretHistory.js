import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as ShowSecretUIActions from 'slices/ShowSecretUISlice';
import SecretHistoryButton from 'components/secrets/SecretHistoryButton';
import SecretEdit from 'components/secrets/SecretEdit';

class SecretHistory extends Component {
  static propTypes = {
    data: PropTypes.object,
    historyDepth: PropTypes.number,
    historyCount: PropTypes.number,
    dispatch: PropTypes.func,
    actions: PropTypes.object,
  };

  render() {
    const { historyDepth, historyCount } = this.props;
    return (
      <div className="secret-history">
        <div className="secret-history-header">
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
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ShowSecretUIActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SecretHistory);
