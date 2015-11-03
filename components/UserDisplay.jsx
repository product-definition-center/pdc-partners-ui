import React, { Component, PropTypes } from 'react';

export default class UserDisplay extends Component {
  render() {
    if (this.props.state == 'init') {
      return (
        <span>Obtaining token &hellip;</span>
      );
    }
    return (
      <span>
        <span>Logged in as</span> <strong>{this.props.user.username}</strong>
      </span>
    );
  }
}
UserDisplay.propTypes = {
  state: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired
};
