import React, { Component, PropTypes } from 'react';
import Mapping from './Mapping';

function releaseCmp(mapping, releases) {
  return function (x, y) {
    if (mapping.hasOwnProperty(x) && mapping.hasOwnProperty(y)) {
      /* Both releases have mapping, sort by name */
      return x.localeCompare(y);
    }
    if (mapping.hasOwnProperty(x)) {
      /* Only x has some mapping */
      return -1;
    }
    if (mapping.hasOwnProperty(y)) {
      /* Only y has some mapping */
      return 1;
    }
    /* No release has mapping */
    return x.localeCompare(y);
  };
}

export default class MappingList extends Component {
  render() {
    var releases = Object.keys(this.props.releases).sort(releaseCmp(this.props.partner.mapping,
                                                                    this.props.releases));
    return (
      <div>
        <h3>Mappings</h3>
        {releases.map(this.renderMapping.bind(this))}
      </div>
    );
  }

  renderMapping(release_id) {
    return <Mapping partner={this.props.partner.mapping}
                    partnerName={this.props.partner.short}
                    dispatch={this.props.dispatch}
                    release_id={release_id}
                    key={release_id}
                    variants={this.props.releases[release_id]} />;
  }
}
