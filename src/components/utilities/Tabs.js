import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTabs from 'react-bootstrap/lib/Tabs';
import BootstrapTab from 'react-bootstrap/lib/Tab';

const propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

const Tabs = props => (
  <BootstrapTabs className="tabs" animation={false} {...props}>
    {props.children}
  </BootstrapTabs>
);
Tabs.propTypes = propTypes;

const Tab = BootstrapTab;

export { Tabs, Tab };
