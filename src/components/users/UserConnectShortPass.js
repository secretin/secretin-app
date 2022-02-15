import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import Form from 'components/utilities/Form';
import Button from 'components/utilities/Button';
import Input from 'components/utilities/Input';
import { confirm } from 'components/utilities/Confirm';

import * as AppUIActions from 'slices/AppUISlice';

class UserConnectShortPass extends Component {
  static propTypes = {
    savedUsername: PropTypes.string,
    loading: PropTypes.bool,
    error: PropTypes.string,
    onCancel: PropTypes.func,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDisable = this.handleDisable.bind(this);

    this.state = {
      shortpass: '',
    };
  }

  handleChange(e) {
    this.setState({
      shortpass: e.value,
    });
  }

  handleSubmit() {
    this.props.dispatch(
      AppUIActions.shortLogin({ shortpass: this.state.shortpass })
    );
  }

  handleDisable() {
    confirm({
      title: 'Are you sure?',
      text: <span>This will disable your short pass login access.</span>,
      acceptLabel: 'Disable short pass',
      cancelLabel: 'Cancel',
      onAccept: () => {
        this.props.dispatch(AppUIActions.disableShortLogin());
      },
      onCancel: () => ({}),
    });
  }

  render() {
    return (
      <Form
        className="user-connect-form"
        disabled={this.props.loading}
        onSubmit={this.handleSubmit}
      >
        <h2 className="user-connect-title">
          Hello again {this.props.savedUsername}!
        </h2>

        <Input
          label="Shortpass"
          name="shortpass"
          value={this.state.shortpass}
          type="password"
          onChange={this.handleChange}
          error={this.props.error}
          autoFocus
        />

        <Button
          type="button"
          buttonStyle="primary"
          disabled={this.props.loading || isEmpty(this.state.shortpass)}
          onClick={this.handleSubmit}
        >
          Connect
        </Button>

        <a
          className="user-connect-more"
          tabIndex={-1}
          onClick={this.handleDisable}
        >
          Use another account
        </a>
      </Form>
    );
  }
}

export default connect()(UserConnectShortPass);
