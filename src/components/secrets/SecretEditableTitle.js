import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MetadataActions from 'actions/MetadataActions';
import Secret from 'models/Secret';

import Icon from 'components/utilities/Icon';
import Input from 'components/utilities/Input';
import Button from 'components/utilities/Button';

class SecretShow extends Component {
  static propTypes = {
    secret: PropTypes.instanceOf(Secret),
    canUpdate: PropTypes.bool,
    isUpdating: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.secret.title,
      isEditing: false,
      isMouseOver: false,
    };

    this.handleClickApply = this.handleClickApply.bind(this);
    this.handleClickCancel = this.handleClickCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isUpdating && !nextProps.isUpdating) {
      this.setState({
        isEditing: false,
      });
    }
  }

  handleClickApply() {
    MetadataActions.renameSecret({
      secret: this.props.secret,
      newTitle: this.state.title,
    });
  }

  handleClickCancel() {
    this.setState({
      title: this.props.secret.title,
      isEditing: false,
    });
  }

  handleClick() {
    this.setState({
      isEditing: true,
      isMouseOver: false,
    });
  }

  handleChange({ value }) {
    this.setState({
      title: value,
    });
  }

  handleMouseOver() {
    this.setState({
      isMouseOver: true,
    });
  }

  handleMouseOut() {
    this.setState({
      isMouseOver: false,
    });
  }

  render() {
    if (this.state.isEditing) {
      return (
        <div>
          <Input
            ref={ref => {
              this.input = ref;
            }}
            name="newTitle"
            value={this.state.title}
            onChange={this.handleChange}
            type="text"
            readOnly={this.props.isUpdating}
          />
          <Button
            title="Apply"
            buttonStyle="icon"
            onClick={this.handleClickApply}
            tabIndex="-1"
          >
            <Icon id="done" size="small" />
          </Button>
          <Button
            title="Cancel"
            buttonStyle="icon"
            onClick={this.handleClickCancel}
            tabIndex="-1"
          >
            <Icon id="close" size="small" />
          </Button>
        </div>
      );
    }
    let style;
    if (this.state.isMouseOver && this.props.canUpdate) {
      style = {
        textDecorationStyle: 'dashed',
        textDecorationLine: 'underline',
      };
    }
    return (
      <div
        onMouseEnter={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}
      >
        <span
          className="secret-editable-title"
          style={style}
          title="Rename"
          onClick={this.handleClick}
        >
          {this.props.secret.title}
          {this.state.isMouseOver &&
            this.props.canUpdate &&
            <Icon id="edit" size="small" />}
        </span>

      </div>
    );
  }
}

export default SecretShow;
