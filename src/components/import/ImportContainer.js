import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Title from 'components/utilities/Title';
import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';
import Spinner from 'components/utilities/Spinner';

import * as ImportActions from 'slices/ImportSlice';
import * as MetadataActions from 'slices/MetadataSlice';

import ImportFileChooser from './ImportFileChooser';
import ImportMandatoryFields from './ImportMandatoryFields';

class ImportContainer extends Component {
  static propTypes = {
    importType: PropTypes.string,
    importing: PropTypes.bool,
    importStatus: PropTypes.number,
    importTotal: PropTypes.number,
    success: PropTypes.bool,
    file: PropTypes.string,
    error: PropTypes.string,
    mandatoryFields: PropTypes.object,
    importActions: PropTypes.object,
    metadataActions: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleFileChoosen = this.handleFileChoosen.bind(this);
    this.handleStartParsing = this.handleStartParsing.bind(this);
  }

  handleFileChoosen(file) {
    this.props.importActions.detectType({ file });
  }

  handleStartParsing() {
    this.props.importActions.importSecrets({
      file: this.props.file,
      mandatoryFields: this.props.mandatoryFields,
      type: this.props.importType,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.success !== true || nextProps.success !== this.props.success
    );
  }

  componentDidUpdate() {
    if (this.props.success) {
      this.props.metadataActions.loadMetadata();
      setTimeout(function() {
        this.props.importActions.defaultStore();
      }, 1500);
    }
  }

  render() {
    return (
      <div className="page">
        <div className="page-header">
          <div className="breadcrumb">
            <Title link="/import/" icon="import" title="Import" />
          </div>
        </div>

        <div className="page-content options">
          <span>
            Supported type are <i>secret-in</i>, <i>keepass</i>
          </span>
          {((this.props.success || this.props.importing) &&
            ((this.props.success && (
              <div className="import-progress">
                <Icon id="done" size={120} />
                <div className="import-progress-title">Done!</div>
              </div>
            )) || (
              <div className="import-progress">
                <Spinner />
                {this.props.importTotal !== 0 && (
                  <div className="import-progress-title">
                    {`Importing... ${this.props.importStatus} / ${this.props.importTotal}`}
                  </div>
                )}
              </div>
            ))) || <ImportFileChooser onFileChoosen={this.handleFileChoosen} />}
          {this.props.error !== '' && <span>{this.props.error}</span>}
          {Object.keys(this.props.mandatoryFields).length > 0 && (
            <ImportMandatoryFields
              mandatoryFields={this.props.mandatoryFields}
            />
          )}
          {this.props.importType !== '' && (
            <Button
              buttonStyle="primary"
              className="button button--style-default button--size-base"
              onClick={this.handleStartParsing}
            >
              Import from {this.props.importType}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  importActions: bindActionCreators(ImportActions, dispatch),
  metadataActions: bindActionCreators(MetadataActions, dispatch),
});

const mapStateToProps = state => {
  const {
    error,
    importType,
    importing,
    importStatus,
    importTotal,
    success,
    file,
    mandatoryFields,
  } = state.Import;
  return {
    error,
    importType,
    importing,
    importStatus,
    importTotal,
    success,
    file,
    mandatoryFields,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportContainer);
