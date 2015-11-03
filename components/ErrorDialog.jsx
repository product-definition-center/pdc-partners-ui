import React, { Component, PropTypes } from 'react';
import Dialog from '../components/Dialog';
import { switchToReady } from '../actions';

export default class ErrorDialog extends Component {
  handleClose(e) {
    e.preventDefault()
    this.props.dispatch(switchToReady());
  }

  render() {
    const title = 'Error: ' + this.props.error.error.message;
    var detail = this.props.error.hasOwnProperty('json') ? this.props.error.json : {};
    return (
      <Dialog header={title}
        extraCls='error-dialog'
        onClose={this.handleClose.bind(this)}>
        <p><code>{this.props.error.error.response.url}</code></p>
        <dl>
          {Object.keys(detail).map(this.renderDetail.bind(this))}
        </dl>
      </Dialog>
    );
  }

  renderDetail(key) {
    return (
      <div key={key}>
        <dt>{key}</dt>
        <dd>
          <ul>
            {this.props.error.json[key].map(item => <li key={item}>{item}</li>)}
          </ul>
        </dd>
      </div>
    );
  }
}
