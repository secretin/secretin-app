import React from 'react';
import { Dropdown } from 'react-bootstrap';

Dropdown.Item = function DropdownMenuItem(props) {
  return <Dropdown.Item className="dropdown-menu-item" {...props} />;
};

export default Dropdown;
