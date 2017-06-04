import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Modal from 'components/utilities/Modal';
import Button from 'components/utilities/Button';

class Confirm extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    text: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
    acceptLabel: PropTypes.string,
    cancelLabel: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleAccept = this.handleAccept.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

    this.promise = new Promise((resolve, reject) => {
      this.accept = resolve;
      this.cancel = reject;
    });

    this.state = {
      used: false,
    };
  }

  handleAccept() {
    this.setState({
      used: true,
    });
    this.accept();
  }

  handleCancel() {
    this.setState({
      used: true,
    });
    this.cancel();
  }

  render() {
    return (
      <Modal show centered onClose={this.promise.reject}>
        {this.props.title &&
          <Modal.Header>
            {this.props.title}
          </Modal.Header>}

        <Modal.Body>
          {this.props.text}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="reset"
            buttonStyle="default"
            onClick={this.handleCancel}
            disabled={this.state.used}
          >
            {this.props.cancelLabel}
          </Button>
          <Button
            buttonStyle="primary"
            onClick={this.handleAccept}
            disabled={this.state.used}
          >
            {this.props.acceptLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export function confirm(confirmProps = {}) {
  const comfirmElement = document.body.appendChild(
    document.createElement('div')
  );

  // eslint-disable-next-line react/no-render-return-value
  const component = ReactDOM.render(
    React.createElement(Confirm, confirmProps),
    comfirmElement
  );

  return component.promise
    .then(confirmProps.onAccept)
    .catch(confirmProps.onCancel)
    .then(() => {
      ReactDOM.unmountComponentAtNode(comfirmElement);
      setTimeout(() => comfirmElement.remove());
    });
}

export default Confirm;
