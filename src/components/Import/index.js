import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import connectToStores from 'alt-utils/lib/connectToStores';

import Title from 'components/utilities/Title';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';
import Spinner from 'components/utilities/Spinner';

import ImportStore from 'stores/ImportStore';
import ImportActions from 'actions/ImportActions';
import MetadataActions from 'actions/MetadataActions';

import FileChooser from './FileChooser';
import ImportSpecial from './Special';

class ImportContainer extends Component {
  static propTypes = {
    importType: PropTypes.string,
    importing: PropTypes.bool,
    importStatus: PropTypes.number,
    importTotal: PropTypes.number,
    success: PropTypes.bool,
    file: PropTypes.string,
    error: PropTypes.string,
    special: PropTypes.instanceOf(Immutable.Map),
  };

  static getStores() {
    return [ImportStore];
  }

  static getPropsFromStores() {
    const state = ImportStore.getState();

    return {
      error: state.get('error'),
      importType: state.get('importType'),
      importing: state.get('importing'),
      importStatus: state.get('importStatus'),
      importTotal: state.get('importTotal'),
      success: state.get('success'),
      file: state.get('file'),
      special: state.get('special'),
    };
  }

  constructor(props) {
    super(props);

    this.handleFileChoosen = this.handleFileChoosen.bind(this);
    this.handleStartParsing = this.handleStartParsing.bind(this);
  }

  handleFileChoosen(file) {
    ImportActions.detectType({ file });
  }

  handleStartParsing() {
    ImportActions.importSecrets({
      file: this.props.file,
      special: this.props.special,
      type: this.props.importType,
    });
  }

  render() {
    if (this.props.success) {
      MetadataActions.loadMetadata();
      setTimeout(function() {
        ImportActions.defaultStore();
      }, 1500);
    }
    return (
      <div className="page">
        <div className="page-header">
          <div className="breadcrumb">
            <Title link="/import/" icon="import" title="Import" />
          </div>
        </div>

        <div className="page-content options">
          <span>Supported type are <i>secret-in</i>, <i>keepass</i></span>
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
          {this.props.error !== '' && <span>{this.props.error}</span>}
          {this.props.special.size > 0 &&
            <ImportSpecial special={this.props.special} />}
          {this.props.importType !== '' &&
            <Button
              buttonStyle="primary"
              className="button button--style-default button--size-base"
              onClick={this.handleStartParsing}
            >
              Import from {this.props.importType}
            </Button>}
        </div>
      </div>
    );
  }
}

export default connectToStores(ImportContainer);
