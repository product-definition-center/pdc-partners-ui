import { combineReducers } from 'redux';
import * as actions from './actions';
import * as constants from './constants';

/*
 * The `state` part of the actual store models which view is currently on. The
 * client always starts in INIT mode. Once username is loaded, it switches to
 * READY. User can then switch to NEW_DIALOG or DETAIL and back to READY.
 *
 * Any time a request fails, the ERROR state is activated. It can be dismissed
 * by going back to READY.
 */

function state(state = constants.STATE_INIT, action) {
  switch (action.type) {
    case actions.SWITCH_TO_READY:
      return constants.STATE_READY;
    case actions.SWITCH_TO_ADD:
      return constants.STATE_NEW_DIALOG;
    case actions.SWITCH_TO_DETAIL:
      return constants.STATE_DETAIL;
    case actions.SWITCH_TO_ERROR:
      return constants.STATE_ERROR;
    default:
      return state;
  }
}

/*
 * Detail page always shows details of a particular partner. This part of the
 * store keeps the short name of the partner.
 */

function selected(state = null, action) {
  switch (action.type) {
    case actions.SWITCH_TO_DETAIL:
      return action.short_name;
    default:
      return state;
  }
}

/*
 * There is only one thing that can happen with releases - they can be loaded.
 * The releases are stored as a mapping {'release_id: {'variant': ['arch']}}.
 */

function releases(state = {}, action) {
  switch (action.type) {
    case actions.RECEIVE_RELEASES:
      var copy = Object.assign({}, state);
      action.data.forEach(function (obj) {
        const { release, uid, arches } = obj;
        if (!copy.hasOwnProperty(release)) {
          copy[release] = {};
        }
        copy[release][uid] = arches;
      });
      return copy;
    default:
      return state;
  }
}

/*
 * To show a loading screen, this keeps track of how many requests are
 * currently in progress. Most actions come in REQUEST_/RECEIVE_ pairs.
 * However, on request failure anything can be ended by SWITCH_TO_ERROR action.
 */

function loading(state = 0, action) {
  switch (action.type) {
    case actions.CREATE_PARTNER:
    case actions.REQUEST_TOKEN:
    case actions.REQUEST_USERNAME:
    case actions.REQUEST_RELEASES:
    case actions.REQUEST_PARTNERS:
    case actions.REQUEST_MAPPING:
    case actions.REQUEST_TOGGLE_MAPPING:
    case actions.REQUEST_PARTNER_DELETE:
    case actions.REQUEST_PARTNER_UPDATE:
      return state + 1;
    case actions.RECEIVE_PARTNERS:
    case actions.RECEIVE_USERNAME:
    case actions.RECEIVE_TOKEN:
    case actions.RECEIVE_RELEASES:
    case actions.RECEIVE_MAPPING:
    case actions.ENABLE_MAPPING:
    case actions.DISABLE_MAPPING:
    case actions.RECEIVE_PARTNER_DELETE:
    case actions.RECEIVE_PARTNER_UPDATE:
    case actions.SWITCH_TO_ERROR:
      return state - 1;
    default:
      return state;
  }
}

/*
 * Helper function to switch the mapping.
 */

function toggle(partner, release, variant, arch) {
  if (!partner.mapping.hasOwnProperty(release)) {
    partner.mapping[release] = {};
  }
  if (!partner.mapping[release].hasOwnProperty(variant)) {
    partner.mapping[release][variant] = [];
  }
  if (partner.mapping[release][variant].indexOf(arch) === -1) {
    partner.mapping[release][variant].push(arch)
  }
}

/*
 * This is the most complicated reducer. It handles receiving partners from
 * server (either initial load or when a new one is created), receiving mapping
 * or toggling of it.
 */

function partners(state = [], action) {
  switch (action.type) {
    case actions.RECEIVE_PARTNERS:
      /* When partners are received, we just need to add empty mapping to them.
       * If this is initial load, the mappings will be loaded shortly; if it is
       * create, there can be none anyway.
       */
      var copy = [...state];
      action.data.forEach(obj => {
        obj.mapping = {};
        copy.push(obj)
      });
      return copy;

    case actions.RECEIVE_PARTNER_UPDATE:
      /* Updating partner can only change the fields, not the mapping. We can
       * reuse the old mapping.
       */
      const partner = state.filter(x => x.short === action.partner)[0];
      const rest = state.filter(x => x.short !== action.partner);
      action.data.mapping = partner.mapping;
      return [...rest, action.data];

    case actions.RECEIVE_MAPPING: {
      /* The mappings are recived as a list from the API. We need to go through
       * it and toggle each partner appropriately.
       * This is quite likely really slow.
       */
      var copy = JSON.parse(JSON.stringify(state));
      copy.forEach(partner => {
        action.data.forEach(function (mapping) {
          if (mapping.partner === partner.short) {
            toggle(partner, mapping.variant_arch.release, mapping.variant_arch.variant, mapping.variant_arch.arch);
          }
        });
      });
      return copy;
    }

    case actions.RECEIVE_PARTNER_DELETE:
      return state.filter(x => x.short !== action.partner);

    case actions.ENABLE_MAPPING: {
      const partner = state.filter(x => x.short === action.partner)[0];
      const rest = state.filter(x => x.short !== action.partner);
      var partnerCopy = JSON.parse(JSON.stringify(partner));
      toggle(partnerCopy, action.release, action.variant, action.arch);
      return [...rest, partnerCopy];
    }

    case actions.DISABLE_MAPPING: {
      const { release, variant, arch } = action;
      const partner = state.filter(x => x.short === action.partner)[0];
      const rest = state.filter(x => x.short !== action.partner);
      var partnerCopy = JSON.parse(JSON.stringify(partner));
      if (partnerCopy.mapping.hasOwnProperty(release)) {
        if (partnerCopy.mapping[release].hasOwnProperty(variant)) {
          partnerCopy.mapping[release][variant] = partnerCopy.mapping[release][variant].filter(x => x !== arch);
        }
      }
      return [...rest, partnerCopy];
    }

    default:
      return state;
  }
}

/*
 * This reducer can only store the token and user name.
 */

function user(state = {}, action) {
  switch (action.type) {
    case actions.RECEIVE_TOKEN:
      return Object.assign({}, state, {token: action.token});
    case actions.RECEIVE_USERNAME:
      return Object.assign({}, state, {username: action.name});
    default:
      return state;
  }
}

function error(state = {}, action) {
  switch (action.type) {
    case actions.SWITCH_TO_ERROR:
      return {error: action.error, json: action.json};
    default:
      return state;
  }
}

function config(state = {}, action) {
  switch (action.type) {
    case actions.SAVE_CONFIG:
      return Object.assign({}, action.config);
    default:
      return state;
  }
}

const partnersApp = combineReducers({
  state,
  loading,
  selected,
  releases,
  partners,
  user,
  error,
  config,
});

export default partnersApp;
