import React, { Component, PropTypes } from 'react';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';
import Spinner from 'components/utilities/Spinner';

import OptionsStore from 'stores/OptionsStore';
import OptionsActions from 'actions/OptionsActions';
import MetadataActions from 'actions/MetadataActions';

import FileChooser from './FileChooser';

class ImportKeepassShow extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    importing: PropTypes.bool,
    importStatus: PropTypes.number,
    importTotal: PropTypes.number,
    success: PropTypes.bool,
  };

  static defaultProps = {
    shown: false,
    importing: false,
    success: false,
    errors: new Immutable.Map(),
  };

  static getStores() {
    return [OptionsStore];
  }

  static getPropsFromStores() {
    const state = OptionsStore.getState().getIn(['import', 'keepass']);

    return {
      errors: state.get('errors'),
      shown: state.get('shown'),
      importing: state.get('importing'),
      importStatus: state.get('importStatus'),
      importTotal: state.get('importTotal'),
      success: state.get('success'),
    };
  }

  constructor(props) {
    super(props);

    this.handleFileChoosen = this.handleFileChoosen.bind(this);
  }

  componentWillUnmount() {
    OptionsActions.hideImportKeepass();
  }

  handleFileChoosen(file) {
    OptionsActions.importKeepass({ file });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={
          !this.props.importing ? OptionsActions.hideImportKeepass : undefined
        }
      >
        <Modal.Header>
          <span className="text">
            Import from Keepass
          </span>
        </Modal.Header>

        <Modal.Body>
          {((this.props.success || this.props.importing) &&
            ((this.props.success &&
              <div className="import-progress">
                <Icon id="done" size={120} />
                <div className="import-progress-title">
                  Done!
                </div>
              </div>) ||
              <div className="import-progress">
                <Spinner />
                {this.props.importTotal !== 0 &&
                  <div className="import-progress-title">
                    Importing...
                    {' '}
                    {this.props.importStatus}
                    {' '}
                    /
                    {' '}
                    {this.props.importTotal}
                  </div>}
              </div>)) ||
            <FileChooser onFileChoosen={this.handleFileChoosen} />}
        </Modal.Body>

        <Modal.Footer>
          {this.props.success
            ? <Button
                buttonStyle="primary"
                className="button button--style-default button--size-base"
                to="/"
                onClick={MetadataActions.loadMetadata}
              >
                Return to Home
              </Button>
            : <Button
                type="reset"
                buttonStyle="default"
                onClick={OptionsActions.hideImportKeepass}
                disabled={this.props.importing}
              >
                Close
              </Button>}
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(ImportKeepassShow);
