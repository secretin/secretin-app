import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import QRCodeShow from 'components/QRCodeShow';
import Title from 'components/utilities/Title';
import BootstrapPanel from 'react-bootstrap/lib/Panel';
import Checkbox from 'components/utilities/Checkbox';
import Button from 'components/utilities/Button';

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
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      keepass: ''
    };
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    const options = this.props.options;
    return (
      <div className="secret-list-container">
        <div className="secret-list">
          <div className="secret-list-header">
            <div className="secret-list-breadcrumb">
              <Title link="/options/" icon="gear" title="Options" />
            </div>
          </div>
          <QRCodeShow />
          <div className="secret-list-content">
            <BootstrapPanel
              header={(<h3>Security</h3>)}
            >
              <Checkbox
                checked={options.get('totp')}
                onChange={OptionsActions.toggleTotp}
              >
                Activate TOTP
              </Checkbox>
            </BootstrapPanel>
            <BootstrapPanel
              header={(<h3>Import</h3>)}
            >
              Keepass :
              <textarea
                name="keepass"
                cols={50}
                rows={10}
                onChange={this.handleChange}
                value={this.state.keepass}
              />
              <Button
                type="button"
                buttonStyle="primary"
                onClick={() => {
                  OptionsActions.importKeepass(this.state.keepass);
                }}
              >
                Import
              </Button>
            </BootstrapPanel>
          </div>
        </div>
      </div>
    );
  }
}
export default connectToStores(OptionsContainer);
