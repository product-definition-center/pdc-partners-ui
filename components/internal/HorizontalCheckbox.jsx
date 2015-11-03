import React, { Component, PropTypes } from 'react';

export default class HorizontalCheckbox extends Component {
  getValue() {
    return this.refs.input.getDOMNode().checked;
  }
  render() {
    return (
      <div className="form-group">
        <div className="col-sm-offset-2 col-sm-10">
          <div className="checkbox">
            <label>
              <input type="checkbox"
                defaultChecked={this.props.value}
                ref="input" /> {this.props.label}
            </label>
          </div>
        </div>
      </div>
    );
  }
}
HorizontalCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
