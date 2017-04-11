import React, { PropTypes } from 'react';
import ReactOverlaysModal from 'react-overlays/lib/Modal';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';

function Modal(props) {
  const className = classNames('modal', props.className, {
    'modal--centered': props.centered,
  });

  return (
    <ReactOverlaysModal
      className={className}
      backdropClassName="modal-backdrop"
      show={props.show}
      onHide={props.onClose}
      onBackdropClick={props.onClose}
    >
      <div className="modal-dialog">
        {props.onClose &&
          <button className="modal-dialog-close" onClick={props.onClose}>
            <Icon id="close" size="small" />
          </button>}

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
  centered: PropTypes.bool,
  className: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func,
};
Modal.defaultProps = {
  centered: false,
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
  title: PropTypes.string,
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
