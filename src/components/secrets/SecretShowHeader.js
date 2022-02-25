import React from 'react';
import PropTypes from 'prop-types';

import SecretHistoryButton from 'components/secrets/SecretHistoryButton';
import SecretEditableTitle from 'components/secrets/SecretEditableTitle';
import Icon from 'components/utilities/Icon';

export const SecretShowHeader = ({
  historyDepth,
  historyCount,
  icon,
  title,
  canEditTitle,
  isUpdating,
  onEditTitle,
  onHistoryPrevious,
  onHistoryNext,
}) => {
  return (
    <div>
      <SecretHistoryButton
        disabled={historyDepth >= historyCount - 1}
        side="previous"
        onClick={onHistoryPrevious}
      />
      <Icon id={icon} size="small" />
      <SecretEditableTitle
        title={title}
        canUpdate={canEditTitle}
        isUpdating={isUpdating}
        onSubmit={newTitle => {
          if (newTitle !== title) {
            onEditTitle(newTitle);
          }
        }}
      />
      <SecretHistoryButton
        disabled={historyDepth <= 0}
        side="next"
        onClick={onHistoryNext}
      />
    </div>
  );
};

SecretShowHeader.propTypes = {
  historyCount: PropTypes.number,
  historyDepth: PropTypes.number,
  canEditTitle: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
  isUpdating: PropTypes.bool,
  onEditTitle: PropTypes.func,
  onHistoryPrevious: PropTypes.func,
  onHistoryNext: PropTypes.func,
};

export default SecretShowHeader;
