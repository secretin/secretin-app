import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import ShortLoginShow from 'components/options/ShortLoginShow';
import QRCodeShow from 'components/options/QRCodeShow';
import Title from 'components/utilities/Title';
import Checkbox from 'components/utilities/Checkbox';

import OptionsActions from 'actions/OptionsActions';

import OptionsStore from 'stores/OptionsStore';

class OptionsContainer extends Component {
  static propTypes = {
    options: PropTypes.instanceOf(Immutable.Map),
  }

  static getStores() {
    return [
      OptionsStore,
    ];
  }

  static getPropsFromStores() {
    return {
      options: OptionsStore.getOptions(),
    };
  }

  constructor(props) {
    super(props);

    this.handleChangeDelay = this.handleChangeDelay.bind(this);
    this.handleClickMinus = this.handleClickMinus.bind(this);
    this.handleClickPlus = this.handleClickPlus.bind(this);
    this.confirmChangeDelay = this.confirmChangeDelay.bind(this);

    this.confirmDelayTimeout = null;

    this.state = {
      delay: props.options.get('timeToClose') ? props.options.get('timeToClose') : 30,
    };
  }

  componentWillReceiveProps(nextProps) {
    const newDelay = nextProps.options.get('timeToClose');
    if (newDelay && newDelay !== this.state.delay) {
      this.setState({
        delay: newDelay,
      });
    }
  }

  handleChangeDelay(event) {
    clearTimeout(this.confirmDelayTimeout);
    this.setState({
      delay: parseInt(event.target.value, 10),
    });
    this.confirmDelayTimeout = setTimeout(this.confirmChangeDelay, 800);
  }

  handleClickPlus() {
    clearTimeout(this.confirmDelayTimeout);
    this.setState({
      delay: parseInt(this.state.delay, 10) + 1,
    });
    this.confirmDelayTimeout = setTimeout(this.confirmChangeDelay, 800);
  }

  handleClickMinus() {
    clearTimeout(this.confirmDelayTimeout);
    this.setState({
      delay: parseInt(this.state.delay, 10) - 1,
    });
    this.confirmDelayTimeout = setTimeout(this.confirmChangeDelay, 800);
  }

  confirmChangeDelay() {
    OptionsActions.changeDelay(this.state.delay);
  }

  render() {
    const options = this.props.options;
    return (
      <div className="page">
        <div className="page-header">
          <div className="breadcrumb">
            <Title link="/options/" icon="gear" title="Options" />
          </div>
        </div>

        <div className="page-content options">
          <div className="options-section">
            <h3 className="options-section-title">
              Security
            </h3>

            <div className="options-section-item">
              <QRCodeShow />
              <Checkbox
                checked={options.get('totp')}
                onChange={OptionsActions.toggleTotp}
              >
                Activate two-factor authentication
              </Checkbox>
            </div>

            <div className="options-section-item">
              <ShortLoginShow />
              <Checkbox
                checked={options.get('shortLogin')}
                onChange={OptionsActions.toggleShortLogin}
              >
                Activate ShortLogin
              </Checkbox>
            </div>

            <div className="options-section-item">
              <p>Disconnecting delay : <b>{options.get('timeToClose')} min</b></p>
              <div>
                <button onClick={this.handleClickMinus}>-</button>
                <input
                  value={this.state.delay}
                  onChange={this.handleChangeDelay}
                  id="delay"
                  type="range"
                  min="0"
                  max="60"
                />
                <button onClick={this.handleClickPlus}>+</button>
                <p>{this.state.delay !== options.get('timeToClose') && this.state.delay}</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    );
  }
}
export default connectToStores(OptionsContainer);
