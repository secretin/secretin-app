import React from 'react';

import Tab from 'react-bootstrap/Tab';
import { default as BootstrapTabs } from 'react-bootstrap/Tabs';
import type { TabsProps } from 'react-bootstrap/Tabs';

const Tabs = (props: TabsProps) => (
  <BootstrapTabs className="tabs" {...props}>
    {props.children}
  </BootstrapTabs>
);

export { Tabs, Tab };
