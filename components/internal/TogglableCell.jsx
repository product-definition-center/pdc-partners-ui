import React, { Component, PropTypes } from 'react';
import Icon from './Icon';

export default class TogglableCell extends Component {
  render() {
    return (
      <td className="clickable" onClick={this.props.onClick}>
        <Icon name={this.props.initial ? "ok" : "remove"} />
      </td>
    );
  }
}
TogglableCell.propTypes = {
  initial: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
