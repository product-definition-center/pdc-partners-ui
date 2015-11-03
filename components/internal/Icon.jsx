import React, { Component, PropTypes } from 'react';

export default class Icon extends Component {
  render() {
    const cls = "glyphicon glyphicon-" + this.props.name;
    return <span className={cls}></span>;
  }
}
Icon.propTypes = {
  name: PropTypes.string.isRequired
};
