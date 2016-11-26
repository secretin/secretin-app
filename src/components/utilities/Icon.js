import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

const SIZES = {
  small: 18,
  base: 24,
};

class Icon extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    size: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    size: 'base',
    className: '',
  }

  render() {
    const { id, size } = this.props;
    const className = classNames(
      'icon',
      `icon--id-${id}`,
      `icon--size-${size}`,
      this.props.className
    );

    return (
      <svg
        className={className}
        width={SIZES[size]}
        height={SIZES[size]}
      >
        <use xlinkHref={`#${id}`} />
      </svg>
    );
  }
}

export default Icon;
