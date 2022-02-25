import React from 'react';
import PropTypes from 'prop-types';

import Button from 'components/utilities/Button';
import Icon from 'components/utilities/Icon';

const SecretHistoryButton = ({ side, disabled, onClick }) => {
  return (
    <div className="secret-history-button">
      {!disabled && (
        <Button
          title={side}
          buttonStyle="icon"
          disabled={disabled}
          onClick={onClick}
        >
          <Icon id={side === 'previous' ? 'import' : 'export'} />
        </Button>
      )}
    </div>
  );
};

SecretHistoryButton.propTypes = {
  disabled: PropTypes.bool,
  side: PropTypes.oneOf('previous', 'next'),
  onClick: PropTypes.func,
};

export default SecretHistoryButton;
