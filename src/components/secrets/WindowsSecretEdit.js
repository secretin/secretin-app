import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectToStores from 'alt-utils/lib/connectToStores';
import moment from 'moment';
import copyToClipboard from 'copy-to-clipboard';

import SecretDataRecord from 'models/SecretDataRecord';
import EditSecretUIStore from 'stores/EditSecretUIStore';
import Select from 'components/utilities/Select';
import Button from 'components/utilities/Button';

class WindowsSecretEdit extends Component {
  static propTypes = {
    data: PropTypes.instanceOf(SecretDataRecord),
    canUpdate: PropTypes.bool,
  };

  static getStores() {
    return [EditSecretUIStore];
  }

  static getPropsFromStores() {
    return { data: EditSecretUIStore.getState().get('data') };
  }

  handleClick = () => {
    copyToClipboard(this.select.getValue(), { debug: true });
  };

  render() {
    if (!this.props.data) {
      return <pre>Loading...</pre>;
    }

    const options = this.props.data.fields
      .sortBy(password => password.date)
      .reverse()
      .map(password => [
        password.content,
        moment(password.date).format('dddd DD MMMM YYYY'),
      ])
      .toList();

    return (
      <div className="secret-edit">
        <div className="secret-field">
          <Select
            label="Passwords"
            ref={ref => {
              this.select = ref;
            }}
            options={options}
          />
          <Button onClick={this.handleClick}>
            Copy
          </Button>
        </div>
      </div>
    );
  }
}

export default connectToStores(WindowsSecretEdit);
