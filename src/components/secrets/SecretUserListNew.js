import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as MetadataActions from 'slices/MetadataSlice';

import Secret from 'models/Secret';
import User, { UserRights, userRightLabel } from 'models/User';

import { confirm } from 'components/utilities/Confirm';
import Input from 'components/utilities/Input';
import Select from 'components/utilities/Select';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

class SecretUserListNew extends Component {
  static propTypes = {
    knownFriendList: PropTypes.array,
    secret: PropTypes.instanceOf(Secret),
    errors: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      user: new User(),
    };
  }

  handleChange({ name, value }) {
    this.setState({
      user: this.state.user.merge({ [name]: value }),
    });
  }

  handleSubmit() {
    const { secret } = this.props;
    const { user } = this.state;
    const accessRights = [
      'read access',
      'read and write access',
      'read, write and share access',
    ];

    const rights = accessRights[user.rights];
    const to = user.username;
    const on = secret.title;

    confirm({
      title: 'Are you sure?',
      text: (
        <span>
          You are about to give <b>{rights}</b> to <b>{to}</b> on <b>{on}</b>.
        </span>
      ),
      acceptLabel: 'Share the secret',
      cancelLabel: 'Cancel',
      onAccept: () => {
        this.props.dispatch(
          MetadataActions.createSecretUserRights({
            secret: this.props.secret,
            user: this.state.user,
            rights: this.state.user.rights,
          })
        );
        this.setState({
          user: new User(),
        });
      },
      onCancel: () => ({}),
    });
  }

  render() {
    return (
      <div className="secret-users-list-new">
        <Input
          name="username"
          placeholder="User name..."
          value={this.state.user.username}
          size="small"
          onChange={this.handleChange}
          autoCompleteFromList={this.props.knownFriendList}
          error={this.props.errors.username}
        />
        <Select
          name="rights"
          value={this.state.user.rights}
          size="small"
          onChange={this.handleChange}
          options={UserRights.map(rights => [rights, userRightLabel(rights)])}
        />
        <Button
          buttonStyle="icon"
          onClick={this.handleSubmit}
          disabled={!this.state.user.isValid()}
          size="small"
          iconOnly
        >
          <Icon id="add" />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { knownFriendList } = state.Metadata;
  return {
    knownFriendList,
  };
};

export default connect(mapStateToProps)(SecretUserListNew);
