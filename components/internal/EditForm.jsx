import React, { Component, PropTypes } from 'react';

import HorizontalEntry from './HorizontalEntry';
import HorizontalCheckbox from './HorizontalCheckbox';
import DeleteButton from './DeleteButton';

export default class EditForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shortValid: props.short !== '',
      prettyValid: props.name !== '',
    };
  }

  updateValid() {
    const shortName = this.refs.short.getValue();
    const prettyName = this.refs.name.getValue();
    this.setState({
      shortValid: shortName !== '',
      prettyValid: prettyName !== '',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const shortName = this.refs.short.getValue();
    const prettyName = this.refs.name.getValue();
    const type = this.refs.type.getDOMNode().value;
    const binary = this.refs.binary.getValue();
    const source = this.refs.source.getValue();
    const ftp_dir = this.refs.ftp_dir.getValue();
    const rsync_dir = this.refs.rsync_dir.getValue();
    const data = {short: shortName, name: prettyName, type, binary, source, ftp_dir, rsync_dir};
    if (shortName !== "" && prettyName !== "") {
      this.props.onSave(data);
    }
  }
  render() {
    var deleteBtn = <span />;
    if (this.props.onDelete) {
      deleteBtn = <DeleteButton onClick={this.props.onDelete} />;
    }
    return (
      <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
        <HorizontalEntry
          ref="name"
          label="Name"
          name="name"
          value={this.props.name}
          valid={this.state.prettyValid}
          onChange={this.updateValid.bind(this)} />
        <HorizontalEntry
          valid={this.state.shortValid}
          onChange={this.updateValid.bind(this)}
          ref="short"
          label="Short name"
          name="short"
          value={this.props.short} />
        <div className="form-group">
          <label htmlFor="type" className="col-sm-2 control-label">Type</label>
          <div className="col-sm-10">
              <select ref="type" id="type" className="form-control" defaultValue={this.props.type}>
                <option value="partner">Partner</option>
                <option value="customer">Customer</option>
              </select>
          </div>
        </div>
        <HorizontalCheckbox ref="binary" label="Ship binaries" name="binary" value={this.props.binary} />
        <HorizontalCheckbox ref="source" label="Ship sources" name="source" value={this.props.source} />
        <HorizontalEntry ref="ftp_dir" label="FTP directory" name="ftp_dir" value={this.props.ftp_dir} />
        <HorizontalEntry ref="rsync_dir" label="Rsync directory" name="rsync_dir" value={this.props.rsync_dir} />
        <div className="form-group">
            <div className="col-sm-offset-2 col-sm-5">
                <button className="btn btn-primary">Save</button>
            </div>
            <div className="col-sm-5">
              {deleteBtn}
            </div>
        </div>
      </form>
    );
  }
}
EditForm.propTypes = {
  name: PropTypes.string.isRequired,
  short: PropTypes.string.isRequired,
  ftp_dir: PropTypes.string.isRequired,
  rsync_dir: PropTypes.string.isRequired,
  binary: PropTypes.bool.isRequired,
  source: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
};
