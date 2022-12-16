import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Mousetrap from 'mousetrap';
import { injectIntl } from 'react-intl';

class SecretListSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.focus = this.focus.bind(this);
    this.blur = this.blur.bind(this);
  }

  componentDidMount() {
    Mousetrap.bind('mod+f', this.focus);
  }

  componentWillUnmount() {
    Mousetrap.unbind('mod+f', this.focus);
  }

  onChange(e) {
    this.props.onChange(e.target.value);
  }

  focus(e) {
    if (this.searchInput === document.activeElement) {
      return;
    }
    this.searchInput.focus();
    e.preventDefault();
  }

  blur(e) {
    if (e.key === 'Escape' && e.target.value === '') {
      this.searchInput.blur();
    }
  }

  render() {
    return (
      <div className="input input--type-search input--size-small">
        <input
          ref={ref => {
            this.searchInput = ref;
          }}
          type="search"
          placeholder={this.props.intl.formatMessage({ id: 'search' })}
          onChange={this.onChange}
          onKeyDown={this.blur}
        />
      </div>
    );
  }
}

export default injectIntl(SecretListSearch);
