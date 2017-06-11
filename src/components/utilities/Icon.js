import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SIZES = {
  small: 18,
  base: 24,
};

class Icon extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.oneOf(['small', 'base']),
    ]),
    className: PropTypes.string,
  };

  static defaultProps = {
    size: 'base',
    className: '',
  };

  render() {
    const { id, size } = this.props;
    const className = classNames(
      'icon',
      `icon--id-${id}`,
      this.props.className,
      {
        [`icon--size-${size}`]: typeof size === 'string',
      }
    );

    return (
      <svg
        className={className}
        width={typeof size === 'string' ? SIZES[size] : size}
        height={typeof size === 'string' ? SIZES[size] : size}
      >
        <use xlinkHref={`#${id}`} />
      </svg>
    );
  }
}

export default Icon;
