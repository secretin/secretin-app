import React, { Component, PropTypes } from 'react';
import { uniqueId } from 'lodash';

class Form extends Component {
  static propTypes = {
    id: PropTypes.string,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.string,
    ]),
  }

  static defaultProps = {
    disabled: false,
    onSubmit: () => ({}),
  }

  constructor(props) {
    super(props);

    this.id = props.id || uniqueId('form_');
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.props.disabled) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <form
        id={this.id}
        className="form"
        onSubmit={this.onSubmit}
      >
        <input type="submit" style={{ display: 'none' }} />
        {this.props.children}
      </form>
    );
  }
}

export default Form;
