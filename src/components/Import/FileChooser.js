import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, DropTarget } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';

import Icon from 'components/utilities/Icon';

class FileChooser extends Component {
  static propTypes = {
    onFileChoosen: PropTypes.func,
    connectDropTarget: PropTypes.func,
  };
  constructor(props) {
    super(props);

    this.handleFileInputChange = this.handleFileInputChange.bind(this);
  }

  handleFileInputChange(e) {
    this.props.onFileChoosen(e.target.files[0]);
  }

  render() {
    return this.props.connectDropTarget(
      <div className="import-drop-zone">
        <Icon id="upload" size={120} />
        <div className="import-drop-zone-label">
          <input
            id="import-drop-zone-input"
            className="import-drop-zone-input"
            type="file"
            onChange={this.handleFileInputChange}
          />
          <label htmlFor="import-drop-zone-input">Choose a file</label>
          <span> or drag it here.</span>
        </div>
      </div>
    );
  }
}

const itemTarget = {
  drop(props, monitor) {
    props.onFileChoosen(monitor.getItem().files[0]);
  },
};

function itemTargetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

const FileChooserTarget = new DropTarget(
  NativeTypes.FILE,
  itemTarget,
  itemTargetCollect
)(FileChooser);

export default new DragDropContext(HTML5Backend)(FileChooserTarget);
