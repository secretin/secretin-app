import React, { Component, PropTypes } from 'react';
import Mousetrap from 'mousetrap';

class SecretListSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
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
          placeholder="Search..."
          onChange={this.onChange}
          onKeyDown={this.blur}
        />
      </div>
    );
  }
}

export default SecretListSearch;
