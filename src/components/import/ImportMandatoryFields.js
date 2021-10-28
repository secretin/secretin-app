import React, { Component } from 'react';
import { connect, bindActionCreators } from 'react-redux';
import PropTypes from 'prop-types';

import ImportMandatoryField from './ImportMandatoryField';

import * as ImportActions from 'slices/ImportSlice';

class ImportersMandatoryFields extends Component {
  static propTypes = {
    mandatoryFields: PropTypes.object,
    actions: PropTypes.object,
  };

  render() {
    const keys = Object.keys(this.props.mandatoryFields);
    const inputs = [];
    keys.forEach(key => {
      inputs.push(
        <ImportMandatoryField
          key={key}
          field={this.props.mandatoryFields[key]}
          onChange={this.props.actions.changeMandatoryField}
        />
      );
    });
    return <div>{inputs}</div>;
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ImportActions, dispatch),
});

const mapStateToProps = state => {
  const { mandatoryFields } = state.Import;
  return {
    mandatoryFields,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportersMandatoryFields);
