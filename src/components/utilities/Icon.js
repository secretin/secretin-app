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
  }

  static defaultProps = {
    size: 'base',
  }

  render() {
    const { id, size } = this.props;
    const className = classNames(
      'icon',
      `icon--id-${id}`,
      `icon--size-${size}`
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
