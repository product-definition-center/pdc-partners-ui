import React, { Component, PropTypes } from 'react';

import Tooltip from './Tooltip';

export default class DeleteButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      armed: false,
    };
  }
  handleClick(e) {
    e.preventDefault();
    if (this.state.armed) {
      this.props.onClick(e);
    } else {
      this.setState({armed: true});
    }
  }
  handleBlur(e) {
    e.preventDefault();
    this.setState({armed: false});
  }
  render() {
    const text = this.state.armed ? 'Yes, I\'m sure' : 'Delete';
    const title = 'Removing a partner is irreversible. The mapping will be removed as well.';
    return (
      <Tooltip tooltip={title}>
        <button className="btn btn-danger" type="button"
          onClick={this.handleClick.bind(this)}
          onBlur={this.handleBlur.bind(this)}>
          {text}
        </button>
      </Tooltip>
    );
  }
}
DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
