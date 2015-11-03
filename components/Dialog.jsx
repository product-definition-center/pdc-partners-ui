import React, { Component, PropTypes } from 'react';

export default class Dialog extends Component {
  render() {
    var saveBtn = <span></span>;
    if (this.props.onSave) {
      saveBtn = <button className="btn btn-primary" type="button" onClick={this.props.onSave}>Save</button>;
    }
    const cls = 'modal-dialog' + (this.props.extraCls ? ' '+this.props.extraCls: '')
    return (
      <div className="modal fade in" role="dialog">
        <div className={cls}>
          <div className="modal-content">
            <div className="modal-header">
              <button className="close" onClick={this.props.onClose}>
                <span>&times;</span>
              </button>
              <h4>{this.props.header}</h4>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              <button className="btn btn-default" type="button" onClick={this.props.onClose}>Close</button>
              {saveBtn}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dialog.propTypes = {
  header: PropTypes.string.isRequired,
  extraCls: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func
};
