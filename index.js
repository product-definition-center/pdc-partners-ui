import 'babel-core/polyfill';
import './css/bootstrap.min.css';
import './css/bootstrap-theme.min.css';
import './css/custom.css';
import './js/jquery-1.11.3.min.js';
import 'imports?jQuery=jquery!./js/bootstrap.min.js';
import 'file?name=[path]/[name].[ext]!./fonts/glyphicons-halflings-regular.woff';

import React from 'react';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import App from './containers/App';
import partnersApp from './reducers';
import { initApp } from './actions';

var devtools = <div />;
let store = null;

if (DEVELOPMENT) {

  const { devTools, persistState } = require('redux-devtools');
  const { DevTools, DebugPanel, LogMonitor } = require('redux-devtools/lib/react');

  const finalCreateStore = compose(
    applyMiddleware(thunkMiddleware),
    devTools(),
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);

  store = finalCreateStore(partnersApp);

  devtools = (
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  );

} else {

  store = applyMiddleware(thunkMiddleware)(createStore)(partnersApp);

}

store.dispatch(initApp());

React.render(
  <div>
    <Provider store={store}>
      {() => <App />}
    </Provider>
    {devtools}
  </div>,
  document.getElementById('root')
);
