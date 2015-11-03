import React, { Component, PropTypes } from 'react';

export default class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }
  handleEnter() {
    this.setState({visible: true});
  }
  handleLeave() {
    this.setState({visible: false});
  }
  render() {
    const tooltip = (
        <div className="tooltip bottom in">
          <div className="tooltip-bottom" role="tooltip">
            <div className="tooltip-inner">
              {this.props.tooltip}
            </div>
          </div>
        </div>
    );
    return (
      <div onMouseEnter={this.handleEnter.bind(this)} onMouseLeave={this.handleLeave.bind(this)}>
        {this.props.children}
        {this.state.visible ? tooltip : <span />}
      </div>
    );
  }
}
Tooltip.propTypes = {
  tooltip: PropTypes.string.isRequired,
};
