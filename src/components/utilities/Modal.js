import React, { PropTypes } from 'react';
import ReactOverlaysModal from 'react-overlays/lib/Modal';

function Modal(props) {
  return (
    <ReactOverlaysModal
      className="modal"
      backdropClassName="modal-backdrop"
      show={props.show}
      onHide={props.onClose}
      onBackdropClick={props.onClose}
    >
      <div className="modal-dialog">
        {props.children}
      </div>
    </ReactOverlaysModal>
  );
}
Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  show: PropTypes.bool,
  onClose: PropTypes.func,
};


Modal.Body = props => (
  <div className="modal-body">
    {props.children}
  </div>
);
Modal.Body.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
};


Modal.Header = props => (
  <div className="modal-header">
    <h2 className="modal-header-title">
      {props.title || props.children}
    </h2>
  </div>
);
Modal.Header.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
};


Modal.Footer = props => (
  <div className="modal-footer">
    {props.children}
  </div>
);
Modal.Footer.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
};


export default Modal;
