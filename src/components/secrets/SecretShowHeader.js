import React from 'react';
import PropTypes from 'prop-types';

import SecretEditableTitle from 'components/secrets/SecretEditableTitle';
import Icon from 'components/utilities/Icon';

export const SecretShowHeader = ({
  icon,
  title,
  canEditTitle,
  isUpdating,
  onEditTitle,
}) => {
  return (
    <div>
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
    </div>
  );
};

SecretShowHeader.propTypes = {
  canEditTitle: PropTypes.bool,
  title: PropTypes.string,
  icon: PropTypes.string,
  isUpdating: PropTypes.bool,
  onEditTitle: PropTypes.func,
};

export default SecretShowHeader;
