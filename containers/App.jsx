import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';


import * as actions from '../actions';
import PartnerList from '../components/PartnerList';
import CreatePartnerButton from '../components/CreatePartnerButton';
import CreatePartnerDialog from '../components/CreatePartnerDialog';
import UserDisplay from '../components/UserDisplay';
import DetailView from '../components/DetailView';
import Spinner from '../components/Spinner';
import ErrorDialog from '../components/ErrorDialog';
import * as constants from '../constants';

export default class App extends Component {
  render() {
    const { dispatch } = this.props;
    const state = this.props.state;
    const maybePartner = this.props.partners.filter(x => x.short == this.props.selected);
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h1>Partners</h1>
          </div>
          <div className="col-md-3 user">
            <UserDisplay state={this.props.state} user={this.props.user} />
          </div>
          <div className="col-md-3 text-right add-btn">
            <CreatePartnerButton state={this.props.state} onClick={() => dispatch(actions.switchToAdd())} />
          </div>
        </div>
        <PartnerList partners={this.props.partners} dispatch={dispatch} />
        {state === constants.STATE_NEW_DIALOG ? <CreatePartnerDialog state={this.props} dispatch={dispatch} /> : ''}
        {state === constants.STATE_DETAIL ? <DetailView partner={maybePartner[0]} dispatch={dispatch} releases={this.props.releases} /> : ''}
        <Spinner requests={this.props.loading} />
        {state === constants.STATE_ERROR ? <ErrorDialog dispatch={dispatch} error={this.props.error} /> : ''}
      </div>
    );
  }
}

function select(state) {
  return state;
}

export default connect(select)(App);
