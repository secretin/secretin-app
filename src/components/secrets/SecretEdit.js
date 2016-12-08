import React, { Component, PropTypes } from 'react';

import Secret from 'models/Secret';

import SecretFields from 'components/secrets/SecretFields';

class SecretEdit extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    isUpdating: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    if (!this.props.secret.data) {
      return <pre>Loading...</pre>;
    }

    return (
      <form
        className="secret-edit"
        onSubmit={this.onSubmit}
      >
        <SecretFields
          fields={this.props.secret.getIn(['data', 'fields'])}
          showCopy
        />
      </form>
    );
  }
}

export default SecretEdit;
