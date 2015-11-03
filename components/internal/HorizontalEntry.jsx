import React, { Component, PropTypes } from 'react';

export default class HorizontalEntry extends Component {
  getValue() {
    return this.refs.input.getDOMNode().value;
  }
  handleChange(e) {
    if (this.props.hasOwnProperty('onChange')) {
      this.props.onChange(e);
    }
  }
  render() {
    const valid = this.props.hasOwnProperty('valid') ? this.props.valid : true;
    return (
      <div className={"form-group" + (valid === false ? ' has-error' : '')}>
        <label htmlFor={this.props.name} className="col-sm-2 control-label">{this.props.label}</label>
        <div className="col-sm-10">
          <input type="text" className="form-control"
            ref="input"
            id={this.props.name}
            defaultValue={this.props.value}
            onChange={this.handleChange.bind(this)} />
        </div>
      </div>
    );
  }
}
HorizontalEntry.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  valid: PropTypes.bool,
  onChange: PropTypes.func,
};
