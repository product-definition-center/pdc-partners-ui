import React, { Component, PropTypes } from 'react';
import Partner from './Partner';

function cmp (a, b) {
  return a.name.localeCompare(b.name);
}

export default class PartnerList extends Component {
  render() {
    const partners = [...this.props.partners].sort(cmp);
    return (
      <div className="list-group">
          {partners.map(this.renderPartner.bind(this))}
      </div>
    );
  }

  renderPartner(partner) {
    return (
      <Partner key={partner.short} dispatch={this.props.dispatch} {...partner} />
    );
  }
}
