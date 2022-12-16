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
import { injectIntl } from 'react-intl';

class SecretUserListNew extends Component {
  static propTypes = {
    knownFriendList: PropTypes.array,
    secret: PropTypes.instanceOf(Secret),
    errors: PropTypes.object,
    dispatch: PropTypes.func,
    intl: PropTypes.object,
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
      this.props.intl.formatMessage({ id: 'read access' }),
      this.props.intl.formatMessage({ id: 'read and write access' }),
      this.props.intl.formatMessage({ id: 'read, write and share access' }),
    ];

    const rights = accessRights[user.rights];
    const to = user.username;
    const on = secret.title;

    confirm({
      title: this.props.intl.formatMessage({ id: 'Are you sure?' }),
      text: (
        <span>
          {this.props.intl.formatMessage({ id: 'shareWarning' })}
          &nbsp;<b>{rights}</b>&nbsp;
          {this.props.intl.formatMessage({ id: 'to' })}
          &nbsp;<b>{to}</b>&nbsp;
          {this.props.intl.formatMessage({ id: 'on' })}
          &nbsp;<b>{on}</b>.
        </span>
      ),
      acceptLabel: this.props.intl.formatMessage({ id: 'Share the secret' }),
      cancelLabel: this.props.intl.formatMessage({ id: 'Cancel' }),
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
          placeholder={`${this.props.intl.formatMessage({ id: 'login' })}...`}
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
          options={UserRights.map(rights => [
            rights,
            this.props.intl.formatMessage({ id: userRightLabel(rights) }),
          ])}
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

export default connect(mapStateToProps)(injectIntl(SecretUserListNew));
