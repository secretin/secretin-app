import React from 'react';
import Dropdown from 'react-bootstrap/lib/Dropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';

Dropdown.MenuItem = function DropdownMenuItem(props) {
  return <MenuItem className="dropdown-menu-item" {...props} />;
};

export default Dropdown;
