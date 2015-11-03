import '../css/spinner.css';

import React, { Component, PropTypes } from 'react';

export default class Spinner extends Component {
  render() {
    if (this.props.requests === 0) {
      return <div />;
    }
    const request = this.props.requests == 1 ? 'request' : 'requests';
    return (
      <div className='overlay'>
        <div className='spinner-loader'></div>
        <div>Loading …</div>
        <div>({this.props.requests} {request} in progress)</div>
      </div>
    );
  }
}
