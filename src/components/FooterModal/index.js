import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';
import Welcome from 'components/FooterModal/Welcome';

const propTypes = {
  hideNews: PropTypes.func,
  acknowledgeVersion: PropTypes.func,
  acknowledgedVersion: PropTypes.string,
  news: PropTypes.array,
  showModal: PropTypes.bool,
};

class FooterModal extends Component {
  render() {
    return (
      <Modal
        show={this.props.showModal}
        onClose={
          this.props.acknowledgedVersion === null ? false : this.props.hideNews
        }
      >
        {this.props.acknowledgedVersion === null ? (
          <Welcome />
        ) : (
          <>
            <Modal.Header title="What's new ?" />
            <Modal.Body>
              {this.props.news.map(change => (
                <div key={change.version}>
                  <h2>{change.title}</h2>
                  <p>{change.description}</p>
                </div>
              ))}
            </Modal.Body>
          </>
        )}

        <Modal.Footer>
          {this.props.acknowledgedVersion !== null && (
            <Button
              type="reset"
              buttonStyle="default"
              onClick={this.props.hideNews}
            >
              Close
            </Button>
          )}
          <Button type="submit" onClick={this.props.acknowledgeVersion}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

FooterModal.propTypes = propTypes;

export default FooterModal;
