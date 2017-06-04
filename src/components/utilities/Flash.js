import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';

const propTypes = {
  type: PropTypes.oneOf(['info']),
  children: PropTypes.node,
};

const defaultProps = {
  type: 'info',
};

function Flash({ type, children }) {
  const className = classNames('flash', `flash--type-${type}`);

  return (
    <div className={className}>
      <div className="flash-icon">
        <Icon id={type} size="small" />
      </div>
      <div className="flash-content">
        {children}
      </div>
    </div>
  );
}
Flash.propTypes = propTypes;
Flash.defaultProps = defaultProps;

export default Flash;
