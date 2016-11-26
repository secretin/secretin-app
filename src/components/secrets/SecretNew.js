import React, { Component, PropTypes } from 'react';
import connectToStores from 'alt-utils/lib/connectToStores';

import MetadataActions from 'actions/MetadataActions';
import NewSecretUIActions from 'actions/NewSecretUIActions';
import NewSecretUIStore from 'stores/NewSecretUIStore';

import SecretDataRecord from 'models/SecretDataRecord';
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
    data: PropTypes.instanceOf(SecretDataRecord),
  }

  static getStores() {
    return [
      NewSecretUIStore,
    ];
  }

  static getPropsFromStores() {
    return NewSecretUIStore.getState().toObject();
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { folder, isFolder, title, data } = this.props;
    MetadataActions.createSecret({ folder, isFolder, title, data });
  }

  render() {
    return (
      <Modal
        show={this.props.shown}
        onClose={NewSecretUIActions.hideModal}
      >
        <Modal.Header
          title={this.props.isFolder ? 'Add new folder' : 'Add new secret'}
        />

        <Modal.Body>
          <Form
            id="new-secret"
            onSubmit={this.onSubmit}
            disabled={false}
          >
            <Input
              label="Secret title"
              name="title"
              value={this.props.title}
              type="text"
              onChange={NewSecretUIActions.changeTitle}
              autoSelect
              required
            />
            <SecretFields
              fields={this.props.data.fields}
              onChange={NewSecretUIActions.changeField}
            />
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            onClick={NewSecretUIActions.hideModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={this.onSubmit}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default connectToStores(SecretNew);
