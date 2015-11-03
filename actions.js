import fetch from 'isomorphic-fetch';

/*
 * action types
 */

export const SWITCH_TO_READY = 'SWITCH_TO_READY';
export const SWITCH_TO_ADD = 'SWITCH_TO_ADD';
export const SWITCH_TO_DETAIL = 'SWITCH_TO_DETAIL';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';
export const RECEIVE_TOKEN = 'RECEIVE_TOKEN';

export const REQUEST_USERNAME = 'REQUEST_USERNAME';
export const RECEIVE_USERNAME = 'RECEIVE_USERNAME';

export const REQUEST_RELEASES = 'REQUEST_RELEASES';
export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';

export const CREATE_PARTNER = 'CREATE_PARTNER';

export const REQUEST_PARTNERS = 'REQUEST_PARTNERS';
export const REQUEST_MAPPING = 'REQUEST_MAPPING';
export const RECEIVE_MAPPING = 'RECEIVE_MAPPING';
export const RECEIVE_PARTNERS = 'RECEIVE_PARTNERS';

export const REQUEST_TOGGLE_MAPPING = 'REQUEST_TOGGLE_MAPPING';
export const ENABLE_MAPPING = 'ENABLE_MAPPING';
export const DISABLE_MAPPING = 'DISABLE_MAPPING';

export const REQUEST_PARTNER_DELETE = 'REQUEST_PARTNER_DELETE';
export const RECEIVE_PARTNER_DELETE = 'RECEIVE_PARTNER_DELETE';

export const REQUEST_PARTNER_UPDATE = 'REQUEST_PARTNER_UPDATE';
export const RECEIVE_PARTNER_UPDATE = 'RECEIVE_PARTNER_UPDATE';

export const SWITCH_TO_ERROR = 'SWITCH_TO_ERROR';
export const HANDLE_ERROR = 'HANDLE_ERROR';

export const SAVE_CONFIG = 'SAVE_CONFIG';

/*
 * action creators
 */

export function switchToReady() {
  return { type: SWITCH_TO_READY };
}

export function switchToAdd() {
  return { type: SWITCH_TO_ADD };
}

export function switchToError(error, json) {
  return { type: SWITCH_TO_ERROR, error, json };
}

export function switchToDetail(short_name) {
  return { type: SWITCH_TO_DETAIL, short_name };
}

export function requestToken() {
  return { type: REQUEST_TOKEN };
}

export function receiveToken(token) {
  return { type: RECEIVE_TOKEN, token }
}


/*
 * Error handling is delegated to this action: it reads the JSON response and
 * switches to error view.
 */

export function handleError(error) {
  return function(dispatch) {
    error.response.json().then(json => {
      dispatch(switchToError(error, json));
    });
  };
}

/*
 * This is a helper function that should be executed directly after fetch(). If
 * the request was not successful, it will reject the promise and instead raise
 * an error. Somewhere down the line the error should be caught and passed to
 * handleError.
 */

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

/*
 * The username is loaded just so it can be shown in the header. There is no
 * further interaction with it.
 */

export function requestUserName() {
  return { type: REQUEST_USERNAME };
}

export function receiveUserName(name) {
  return { type: RECEIVE_USERNAME, name };
}

export function fetchUserName() {
  return function (dispatch, getState) {
    dispatch(requestUserName());
    return fetch(getBaseURL(getState) + 'auth/current-user/', {
      headers: {
        'Accept': 'application/json',
        'Authorization': getTokenString(getState),
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveUserName(json.username));
        dispatch(switchToReady());
      })
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * This is the main action: it obtains the authentication token and initiates
 * downloading of username, releases and partners.
 */

export function fetchToken() {
  return function (dispatch, getState) {
    const BASE_URL = getBaseURL(getState);
    dispatch(requestToken());
    return fetch(BASE_URL + 'auth/token/obtain/', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveToken(json.token))
        dispatch(fetchUserName());
        dispatch(fetchReleases(BASE_URL + 'release-variants/?page_size=100'));
        dispatch(fetchPartners(BASE_URL + 'partners/'));
      })
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * Helper function for retrieving the correct "Token XYZ" string.
 */
function getTokenString(getState) {
  const state = getState();
  return 'Token ' + state.user.token;
}

function getBaseURL(getState) {
  const state = getState();
  return state.config.baseUrl;
}


/*
 * To retrieve all releases, the client actually gets release-variants. The
 * action must be started with a url, and it will recursively call itself until
* everything is loaded.
 */

export function requestReleases() {
  return { type: REQUEST_RELEASES };
}

export function receiveReleases(data) {
  return { type: RECEIVE_RELEASES, data };
}

export function fetchReleases(url) {
  return function (dispatch, getState) {
    dispatch(requestReleases());
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': getTokenString(getState),
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
            if (json.next) {
              dispatch(fetchReleases(json.next));
            }
            dispatch(receiveReleases(json.results));
      })
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * When a partner is created, the data is received through the same function as
 * during the initial loading.
 */

export function createPartner(data) {
  return { type: CREATE_PARTNER, data };
}

export function postPartner(data, url = null) {
  return function (dispatch, getState) {
    if (url === null) {
      url = getBaseURL(getState) + 'partners/';
    }
    dispatch(createPartner(data));
    return fetch(url, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': getTokenString(getState),
      },
      body: JSON.stringify(data)
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receivePartners([data])))
      .then(() => dispatch(switchToDetail(data.short)))
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * Fetching partners works in a pretty similar way to fetching releases. The
 * main difference is that once all partners are downloaded, it will start
 * downloading mappings for the partners.
 */

export function requestPartners() {
  return { type: REQUEST_PARTNERS };
}

export function receivePartners(data) {
  return { type: RECEIVE_PARTNERS, data };
}

export function fetchPartners(url) {
  return function (dispatch, getState) {
    dispatch(requestPartners());
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': getTokenString(getState),
      },
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(receivePartners(json.results));
        if (json.next) {
          dispatch(fetchPartners(json.next));
        } else {
          dispatch(fetchMappings(getBaseURL(getState) + 'partners-mapping/?page_size=100'));
        }
      })
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * This is for requesting the mappings.
 */

export function requestMapping() {
  return { type: REQUEST_MAPPING };
}

export function receiveMappings(data) {
  return { type: RECEIVE_MAPPING, data };
}

export function fetchMappings(url) {
  return function (dispatch, getState) {
    dispatch(requestMapping());
    return fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Authorization': getTokenString(getState),
      }
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveMappings(json.results));
        if (json.next) {
          dispatch(fetchMappings(json.next));
        }
    }).catch(error => dispatch(handleError(error)));
  };
}

/*
 * Each toggle of mapping is started with the same action and it handles it
 * correctly to make a POST or DELETE request.
 */

export function requestToggleMapping() {
  return { type: REQUEST_TOGGLE_MAPPING };
}

export function enableMapping(partner, release, variant, arch) {
  return { type: ENABLE_MAPPING, partner, release, variant, arch };
}

export function disableMapping(partner, release, variant, arch) {
  return { type: DISABLE_MAPPING, partner, release, variant, arch };
}

export function toggleMapping(partner, release, variant, arch, which) {
  return function (dispatch, getState) {
    const BASE_URL = getBaseURL(getState);
    dispatch(requestToggleMapping());
    if (which) {    /* Create mapping */
      return fetch(BASE_URL + 'partners-mapping/', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': getTokenString(getState),
        },
        method: 'post',
        body: JSON.stringify({partner, variant_arch: {release, variant, arch}})
      }).then(checkStatus)
        .then(response => dispatch(enableMapping(partner, release, variant, arch)))
        .catch(error => dispatch(handleError(error)));
    } else {        /* Remove mapping */
      const url = BASE_URL + 'partners-mapping/'+partner+'/'+release+'/'+variant+'/'+arch+'/';
      return fetch(url, {
        headers: {
          'Authorization': getTokenString(getState),
        },
        method: 'delete'
      }).then(checkStatus)
        .then(response => dispatch(disableMapping(partner, release, variant, arch)))
        .catch(error => dispatch(handleError(error)));
    }
  };
}

/*
 * Deleting a partner. No tricky things here.
 */

export function requestPartnerDelete() {
  return { type: REQUEST_PARTNER_DELETE };
}

export function receivePartnerDelete(partner) {
  return { type: RECEIVE_PARTNER_DELETE, partner };
}

export function deletePartner(partner) {
  return function (dispatch, getState) {
    dispatch(requestPartnerDelete());
    dispatch(switchToReady());
    return fetch(getBaseURL(getState) + 'partners/' + partner + '/', {
      method: 'delete',
      headers: {
        'Authorization': getTokenString(getState),
      }
    }).then(checkStatus)
      .then(response => dispatch(receivePartnerDelete(partner)))
      .catch(error => dispatch(handleError(error)));
  };
}

/*
 * Updating is also quite straight forward. Note that the receive action is
 * getting the new data as well as the original short. This is required so that
 * the store can be updated correctly.
 */

export function requestPartnerUpdate() {
  return { type: REQUEST_PARTNER_UPDATE };
}

export function receivePartnerUpdate(partner, data) {
  return { type: RECEIVE_PARTNER_UPDATE, partner, data };
}

export function updatePartner(partner, data) {
  return function (dispatch, getState) {
    dispatch(requestPartnerUpdate());
    dispatch(switchToReady());
    return fetch(getBaseURL(getState) + 'partners/' + partner + '/', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': getTokenString(getState),
      },
      body: JSON.stringify(data),
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(receivePartnerUpdate(partner, json)))
      .then(() => dispatch(switchToDetail(data.short)))
      .catch(error => dispatch(handleError(error)));
  };
}

function storeConfig(config) {
  return { type: SAVE_CONFIG, config };
}


export function initApp() {
  return function (dispatch) {
    return fetch('/static/config.json')
      .then(response => response.json())
      .then(json => {
        dispatch(storeConfig(json));
        dispatch(fetchToken());
    });
  };
}
