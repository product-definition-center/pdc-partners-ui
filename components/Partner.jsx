import React, { Component, PropTypes } from 'react';
import { switchToDetail } from '../actions';

export default class Partner extends Component {
  handleClick(e) {
    e.preventDefault();
    this.props.dispatch(switchToDetail(this.props.short));
  }
  render() {
    return (
      <button className="list-group-item" type="button" onClick={this.handleClick.bind(this)}>
        {this.props.name}
      </button>
    );
  }
}
Partner.propTypes = {
  dispatch: PropTypes.func.isRequired,
}
