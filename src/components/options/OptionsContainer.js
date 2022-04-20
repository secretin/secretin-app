import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import ShortLoginShow from 'components/options/ShortLoginShow';
import QRCodeShow from 'components/options/QRCodeShow';
import RescueCodesShow from 'components/options/RescueCodesShow';
import ChangePasswordShow from 'components/options/ChangePasswordShow';
import Title from 'components/utilities/Title';
import Checkbox from 'components/utilities/Checkbox';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

import * as OptionsActions from 'slices/OptionsSlice';

class OptionsContainer extends Component {
  static propTypes = {
    options: PropTypes.object,
    newPass: PropTypes.object,
    isOnline: PropTypes.bool,
    actions: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.onChangeTimeToClose = this.onChangeTimeToClose.bind(this);
    this.onChangeDefaultUsername = this.onChangeDefaultUsername.bind(this);
    this.onSaveDefaultUsername = this.onSaveDefaultUsername.bind(this);
    this.state = {
      defaultUsername: props.options.defaultUsername,
    };
  }

  onChangeDefaultUsername({ value }) {
    this.setState({ defaultUsername: value });
  }

  onChangeTimeToClose({ value }) {
    this.props.actions.changeTimeToClose({
      timeToClose: value === '' ? -1 : parseInt(value, 10) || 0,
    });
  }

  onSaveDefaultUsername() {
    this.props.actions.changeDefaultUsername({
      defaultUsername: this.state.defaultUsername,
    });
  }

  render() {
    const {
      options,
      isOnline,
      options: { defaultUsername = '' },
    } = this.props;
    return (
      <div className="page">
        <div className="page-header">
          <div className="breadcrumb">
            <Title link="/options/" icon="gear" title="Options" />
          </div>
        </div>

        <div className="page-content options">
          <div className="options-section">
            <h3 className="options-section-title">Experience</h3>
            <div className="options-section-item">
              <Input
                name="defaultUsername"
                label="Default username"
                size="small"
                value={this.state.defaultUsername}
                onChange={this.onChangeDefaultUsername}
                disabled={!isOnline}
              />
              <div className="options-section-subitem-save">
                <Button
                  type="button"
                  buttonStyle={
                    this.state.defaultUsername === defaultUsername
                      ? 'default'
                      : 'primary'
                  }
                  onClick={this.onSaveDefaultUsername}
                  size="small"
                  disabled={
                    !isOnline || this.state.defaultUsername === defaultUsername
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="options-section">
            <h3 className="options-section-title">Security</h3>

            <div className="options-section-item">
              <QRCodeShow />
              <Checkbox
                checked={options.totp}
                onChange={this.props.actions.toggleTotp}
                disabled={!isOnline}
              >
                Activate two-factor authentication
              </Checkbox>
              {options.totp && (
                <div className="options-section-subitem">
                  <RescueCodesShow />
                  <Button
                    size="small"
                    buttonStyle="default"
                    onClick={this.props.actions.showRescueCodes}
                  >
                    Generate rescue Codes
                  </Button>
                </div>
              )}
            </div>

            <div className="options-section-item">
              <ShortLoginShow />
              <Checkbox
                checked={options.shortLogin}
                onChange={this.props.actions.toggleShortLogin}
                disabled={!isOnline}
              >
                Activate ShortLogin
              </Checkbox>
            </div>

            <div className="options-section-item">
              <Checkbox
                checked={options.timeToClose !== 0}
                onChange={this.props.actions.toggleAutoLogout}
                disabled={!isOnline}
              >
                Activate auto logout
              </Checkbox>

              {(options.timeToClose === -1 || options.timeToClose > 0) && (
                <div className="options-section-subitem">
                  {'Disconnect me after '}
                  <Input
                    name="timeToClose"
                    label=""
                    size="small"
                    value={
                      options.timeToClose === -1
                        ? ''
                        : options.timeToClose.toString()
                    }
                    onChange={this.onChangeTimeToClose}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 60,
                      step: 5,
                    }}
                    disabled={!isOnline}
                  />
                  <b> min</b>
                </div>
              )}
            </div>
          </div>
          <div className="options-section">
            <div className="options-section-item">
              <ChangePasswordShow />
              <Button
                type="button"
                buttonStyle="warning"
                onClick={this.props.actions.showChangePassword}
                disabled={!isOnline}
              >
                Change master password
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(OptionsActions, dispatch),
});

const mapStateToProps = state => {
  const { options } = state.Options;
  const { online } = state.AppUI;
  return {
    options,
    isOnline: online,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsContainer);
