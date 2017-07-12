import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';
import ImportStore from 'stores/ImportStore';
import SpecialField from './SpecialField';

import ImportActions from 'actions/ImportActions';

class ImportSpecial extends Component {
  static propTypes = {
    special: PropTypes.instanceOf(Immutable.Map),
  };

  static getStores() {
    return [ImportStore];
  }

  static getPropsFromStores() {
    const state = ImportStore.getState();

    return {
      special: state.get('special'),
    };
  }

  render() {
    const keys = Object.keys(this.props.special.toJS());
    const inputs = [];
    keys.forEach(key => {
      inputs.push(
        <SpecialField
          key={key}
          name={key}
          value={this.props.special.get(key)}
          onChange={ImportActions.changeSpecial}
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

export default connectToStores(ImportSpecial);
