import React, { Component, PropTypes } from 'react';

import { toggleMapping } from '../../actions';
import TogglableCell from './TogglableCell';
import Icon from './Icon';


export default class Mapping extends Component {
  handleToggle(variant, arch, which) {
    this.props.dispatch(toggleMapping(this.props.partnerName,
                                      this.props.release_id,
                                      variant,
                                      arch,
                                      which));
  }
  renderCell(variant, arch) {
    const key = variant + '-' + arch;
    if (this.props.variants[variant].indexOf(arch) === -1) {
      return <td key={key}><Icon name="ban-circle" /></td>;
    }
    var enabled = false;
    if (this.props.release_id in this.props.partner) {
      if (variant in this.props.partner[this.props.release_id]) {
        enabled = this.props.partner[this.props.release_id][variant].indexOf(arch) !== -1;
      }
    }
    return <TogglableCell key={key} initial={enabled} onClick={() => this.handleToggle(variant, arch, !enabled)} />;
  }
  renderRow(arches, variant) {
    return (
      <tr key={variant}>
        <th>{variant}</th>
        {arches.map(arch => this.renderCell(variant, arch))}
      </tr>
    );
  }
  render() {
    var arches = new Set();
    for (const variant in this.props.variants) {
      this.props.variants[variant].forEach(x => arches.add(x));
    }
    arches = [...arches].sort();
    const variants = Object.keys(this.props.variants).sort();
    var cls = 'panel-collapse collapse';
    if (this.props.partner.hasOwnProperty(this.props.release_id)) {
      cls += ' in';
    }
    const ident = this.props.release_id.replace(/[.@]/g, '-');
    return (
      <div className="panel panel-default">
          <div className="panel-heading" data-toggle="collapse" data-target={'#' + ident}>
              <h4 className="panel-title">{this.props.release_id}</h4>
          </div>

          <div className={cls} id={ident}>
              <div className="panel-body">
                  <table className="table table-striped mapping-table">
                      <thead>
                          <tr>
                              <th>Variant</th>
                              {arches.map(x => <th key={x}>{x}</th>)}
                          </tr>
                      </thead>
                      <tbody>
                        {variants.map(x => this.renderRow(arches, x))}
                      </tbody>
                  </table>

                  <ul>
                      <li><small>Changes to the table are automatically saved.</small></li>
                      <li>
                        <small>Trees marked with <Icon name="ban-circle" /> are not shipped in the release.</small>
                      </li>
                  </ul>

              </div>
          </div>
      </div>
    );
  }
}
