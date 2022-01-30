import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as EditSecretUIActions from 'slices/EditSecretUISlice';

import SecretFields from 'components/secrets/SecretFields';

class SecretEdit extends Component {
  static propTypes = {
    data: PropTypes.object,
    canUpdate: PropTypes.bool,
    actions: PropTypes.object,
  };

  render() {
    if (!this.props.data) {
      return <pre>Loading...</pre>;
    }

    return (
      <div className="secret-edit">
        <SecretFields
          fields={this.props.data.fields}
          onChange={
            this.props.canUpdate ? this.props.actions.changeField : () => {}
          }
          canUpdate={this.props.canUpdate}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(EditSecretUIActions, dispatch),
});

const mapStateToProps = state => {
  const { data } = state.EditSecretUI;
  return {
    data,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SecretEdit);
