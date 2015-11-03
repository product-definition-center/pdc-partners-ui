import React, { Component, PropTypes } from 'react';

import Dialog from './Dialog';
import EditForm from './internal/EditForm';
import MappingList from './internal/MappingList';
import { switchToReady, deletePartner, updatePartner } from '../actions';
import * as constants from '../constants';

export default class DetailView extends Component {
  handleClose(e) {
    this.props.dispatch(switchToReady());
  }
  handleSave(data) {
    this.props.dispatch(updatePartner(this.props.partner.short, data));
  }
  handleDelete(data) {
    this.props.dispatch(deletePartner(this.props.partner.short));
  }
  render() {
    return (
      <Dialog
        header={this.props.partner.name}
        extraCls='modal-lg'
        onClose={this.handleClose.bind(this)}>
        <EditForm
          onSave={this.handleSave.bind(this)}
          onDelete={this.handleDelete.bind(this)}
          {...this.props.partner} />
        <MappingList
          partner={this.props.partner}
          releases={this.props.releases}
          dispatch={this.props.dispatch} />
      </Dialog>
    );
  }
}
