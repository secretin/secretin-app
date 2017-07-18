import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';
import ImportStore from 'stores/ImportStore';
import ImportMandatoryField from './ImportMandatoryField';

import ImportActions from 'actions/ImportActions';

class ImportersMandatoryFields extends Component {
  static propTypes = {
    mandatoryFields: PropTypes.instanceOf(Immutable.Map),
  };

  static getStores() {
    return [ImportStore];
  }

  static getPropsFromStores() {
    const state = ImportStore.getState();

    return {
      mandatoryFields: state.get('mandatoryFields'),
    };
  }

  render() {
    const keys = Object.keys(this.props.mandatoryFields.toJS());
    const inputs = [];
    keys.forEach(key => {
      inputs.push(
        <ImportMandatoryField
          key={key}
          field={this.props.mandatoryFields.get(key)}
          onChange={ImportActions.changeMandatoryField}
        />
      );
    });
    return (
      <div>
        {inputs}
      </div>
    );
  }
}

export default connectToStores(ImportersMandatoryFields);
