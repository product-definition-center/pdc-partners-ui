import React, { Component, PropTypes } from 'react';
import Dialog from '../components/Dialog';
import * as constants from '../constants';
import { switchToReady, postPartner } from '../actions';
import EditForm from './internal/EditForm';

export default class CreatePartnerDialog extends Component {
  handleSubmit(data) {
    this.props.dispatch(postPartner(data));
  }

  handleClose(e) {
    e.preventDefault()
    this.props.dispatch(switchToReady());
  }

  render() {
    const partner = {
      short: '',
      name: '',
      binary: false,
      source: false,
      type: 'partner',
      ftp_dir: '',
      rsync_dir: '',
    };
    return (
      <Dialog header="Add partner"
              extraCls="modal-lg"
              onClose={this.handleClose.bind(this)}>
        <EditForm {...partner} onSave={this.handleSubmit.bind(this)} />
      </Dialog>
    );
  }
}
