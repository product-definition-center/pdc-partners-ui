import React, { Component, PropTypes } from 'react';
import * as constants from '../constants';

export default class CreatePartnerButton extends Component {
  handleClick(e) {
    e.preventDefault()
    console.log('Create button clicked');
  }
  render() {
    var cls = "btn btn-lg btn-primary";
    if (this.props.state == constants.STATE_INIT) {
      cls += ' disabled'
    }
    return (
      <button className={cls} type="button" onClick={this.props.onClick}>
        Add
      </button>
    );
  }
}
CreatePartnerButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};
