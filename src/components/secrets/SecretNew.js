import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import * as MetadataActions from 'slices/MetadataSlice';
import * as NewSecretUIActions from 'slices/NewSecretUISlice';

import SecretFields from 'components/secrets/SecretFields';
import Modal from 'components/utilities/Modal';
import Form from 'components/utilities/Form';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

class SecretNew extends Component {
  static propTypes = {
    shown: PropTypes.bool,
    folder: PropTypes.string,
    isFolder: PropTypes.bool,
    title: PropTypes.string,
    data: PropTypes.object,
    newSecretActions: PropTypes.object,
    metadataActions: PropTypes.object,
    isLoading: PropTypes.bool,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { folder, isFolder, title, data } = this.props;
    this.props.metadataActions.createSecret({
      folder: folder?.id,
      isFolder,
      title,
      data,
    });
  }

  render() {
    const { isFolder } = this.props;
    return (
      <Modal
        show={this.props.shown}
        onClose={this.props.newSecretActions.hideModal}
      >
        <Modal.Header
          title={
            isFolder
              ? this.props.intl.formatMessage({ id: 'create folder title' })
              : this.props.intl.formatMessage({ id: 'create secret title' })
          }
        />

        <Modal.Body>
          <Form id="new-secret" onSubmit={this.onSubmit} disabled={false}>
            <Input
              label={
                isFolder
                  ? this.props.intl.formatMessage({ id: 'Folder title' })
                  : this.props.intl.formatMessage({ id: 'Secret title' })
              }
              name="title"
              value={this.props.title}
              type="text"
              onChange={this.props.newSecretActions.changeTitle}
              autoSelect
              required
            />
            {!isFolder && (
              <SecretFields
                fields={this.props.data.fields}
                onChange={this.props.newSecretActions.changeField}
                isNew
                canUpdate
              />
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={this.props.newSecretActions.hideModal}
          >
            <FormattedMessage id="Cancel" />
          </Button>
          <Button
            type="submit"
            onClick={this.onSubmit}
            disabled={this.props.isLoading}
          >
            {isFolder ? (
              <FormattedMessage id="add folder button" />
            ) : (
              <FormattedMessage id="add secret button" />
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  newSecretActions: bindActionCreators(NewSecretUIActions, dispatch),
  metadataActions: bindActionCreators(MetadataActions, dispatch),
});

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.NewSecretUI,
    isLoading: state.AppUI.loading,
    folder: ownProps.folder,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SecretNew));
