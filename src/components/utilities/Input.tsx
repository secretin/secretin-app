import React, {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { uniqueId } from 'lodash';
import classNames from 'classnames';

import Icon from 'components/utilities/Icon';
import Button from 'components/utilities/Button';
import Dropdown from 'components/utilities/Dropdown';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  name: string;
  value: string;
  label: ReactNode | ReactNode[] | string;
  title: string;
  onChange?: ({ name, value }: { name: string; value: string }) => void;
  placeholder?: string;
  error?: string;
  autoFocus?: boolean;
  autoSelect?: boolean;
  autoComplete?: boolean;
  autoCompleteFromList?: string[];
  disabled?: boolean;
  readOnly?: boolean;
  actions?: ReactNode[];
  size?: 'extra-small' | 'small' | 'base';
  inputProps?: {
    min?: number;
    max?: number;
    step?: number;
  };
  debounce: number;
};

const Input = ({
  type = 'text',
  value = '',
  autoCompleteFromList = [],
  size = 'base',
  debounce = 0,
  autoSelect,
  autoFocus,
  onChange,
  title,
  autoComplete,
  disabled,
  error,
  label,
  placeholder,
  readOnly,
  actions,
  inputProps,
  name,
}: InputProps) => {
  const id = uniqueId(`${name}_input_`);
  const [autoCompleteSelected, setAutoCompleteSelected] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoSelect) {
      setTimeout(() => inputRef.current?.select(), 0);
    }
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [autoSelect, autoFocus]);

  const onTogglePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (autoCompleteSelected) {
      setAutoCompleteSelected(false);
    }

    onChange?.({
      name,
      value: event.target.value,
    });
  };

  const handleAutoCompleteSelect = (value: string) => {
    setAutoCompleteSelected(true);
    onChange?.({
      name,
      value,
    });
  };

  const select = () => {
    inputRef.current?.select();
  };

  const className = classNames(
    'input',
    `input--type-${type}`,
    `input--size-${size}`,
    {
      'input--error': error,
    }
  );

  const filteredAutoCompleteList =
    value.length > 0
      ? autoCompleteFromList.filter(elem =>
          elem.toLowerCase().includes(value.toLowerCase())
        )
      : [];

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id}>
          {label}
          {actions && actions.length > 0 && (
            <span className="input-label-actions">{actions}</span>
          )}
        </label>
      )}

      <div className="input--wrapper">
        <input
          ref={inputRef}
          id={id}
          name={id}
          title={title}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete={autoComplete ? 'on' : 'off'}
          autoFocus={autoFocus}
          disabled={disabled}
          readOnly={readOnly}
          {...inputProps}
        />
        {!autoCompleteSelected && filteredAutoCompleteList.length > 0 && (
          <Dropdown
            id="input--auto-complete-list"
            isOpen={value.length > 0}
            target={<></>}
          >
            <Dropdown.Menu>
              {filteredAutoCompleteList.slice(0, 5).map(elem => (
                <Dropdown.Item
                  key={elem}
                  onClick={() => handleAutoCompleteSelect(elem)}
                >
                  {elem}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
        {type === 'password' && (
          <div className="input--password-show">
            <Button
              title="Show"
              buttonStyle="icon"
              onClick={onTogglePasswordShow}
              tabIndex="-1"
            >
              <Icon id={showPassword ? 'show' : 'hide'} size="small" />
            </Button>
          </div>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
