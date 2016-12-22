import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import copyToClipboard from 'copy-to-clipboard';

import Secret from 'models/Secret';

import Select from 'components/utilities/Select';
import Button from 'components/utilities/Button';

class WindowsSecretEdit extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
  }

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    if (this.props.secret.data) {
      this.state = {
        windowsPassword: this.props.secret.data.last().value,
      };
    } else {
      this.state = {
        windowsPassword: '',
      };
    }
  }

  handleChange({ value }) {
    this.setState({
      windowsPassword: value,
    });
  }

  handleClick() {
    copyToClipboard(this.state.windowsPassword, { debug: true });
  }

  render() {
    return (
      <div className="secret-edit">
        <Select
          label="Passwords"
          value={this.state.windowsPassword}
          options={
            this.props.secret.data.reverse().map(password => ([
              password.value,
              `${moment(password.date).format('dddd DD MMMM YYYY')}`,
            ])).toList()
          }
          onChange={this.handleChange}
          actions={[]}
        />
        <Button
          onClick={this.handleClick}
        >
          Copy
        </Button>
      </div>
    );
  }
}

export default WindowsSecretEdit;
