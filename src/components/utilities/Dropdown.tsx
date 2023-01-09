import React, { useCallback, useState } from 'react';
import { PopoverProps } from 'react-bootstrap';

import { Popover } from 'react-tiny-popover';

type DropdownProps = PopoverProps & {
  children?: React.ReactElement;
  target?: React.ReactElement;
  isOpen?: boolean;
};

const Dropdown = ({ children, target, ...props }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  return (
    <Popover
      isOpen={isOpen}
      onClickOutside={() => setIsOpen(false)}
      positions={['bottom', 'top']}
      align="end"
      content={<div className="dropdown">{children}</div>}
      containerStyle={{ zIndex: '11' }}
      {...props}
    >
      <button onClick={toggle} className="dropdown-toggle">
        {target}
      </button>
    </Popover>
  );
};

type DropDownMenuProps = React.HTMLAttributes<HTMLUListElement>;
Dropdown.Menu = ({ children, ...props }: DropDownMenuProps) => (
  <ul className="dropdown-menu dropdown-menu-right" {...props}>
    {children}
  </ul>
);

type DropDownItemProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
Dropdown.Item = ({ children, ...props }: DropDownItemProps) => (
  <li className="dropdown-menu-item">
    <button {...props}>{children}</button>
  </li>
);

Dropdown.Divider = () => <li className="divider" />;

export default Dropdown;
