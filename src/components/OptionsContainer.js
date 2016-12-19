import React from 'react';
import Title from 'components/utilities/Title';

function OptionsContainer() {
  return (
    <div className="secret-list-container">
      <div className="secret-list">
        <div className="secret-list-header">
          <div className="secret-list-breadcrumb">
            <Title link="/options/" icon="gear" title="Options" />
          </div>
        </div>
        <div className="secret-list-content">
          TOTP
        </div>
      </div>
    </div>
  );
}

export default OptionsContainer;
