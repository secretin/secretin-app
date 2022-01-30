import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import copyToClipboard from 'copy-to-clipboard';

import Select from 'components/utilities/Select';
import Button from 'components/utilities/Button';

class WindowsSecretEdit extends Component {
  static propTypes = {
    data: PropTypes.object,
    canUpdate: PropTypes.bool,
  };

  handleClick = () => {
    copyToClipboard(this.select.getValue(), { debug: true });
  };

  render() {
    if (!this.props.data) {
      return <pre>Loading...</pre>;
    }

    const options = this.props.data.fields
      // TODO : figure out sorting
      // .sortBy(password => password.date)
      .reverse()
      .map(password => [
        password.content,
        moment(password.date).format('dddd DD MMMM YYYY'),
      ]);

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
          <Button onClick={this.handleClick}>Copy</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { data } = state.EditSecretUI;
  return {
    data,
  };
};

export default connect(mapStateToProps)(WindowsSecretEdit);
