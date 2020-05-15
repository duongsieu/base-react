/* eslint-disable no-underscore-dangle */
import { createBrowserHistory } from 'history';
import { applyMiddleware, compose as composeRedux, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from 'reducers';
import thunk from 'redux-thunk';
import { multiClientMiddleware } from 'redux-axios-middleware';
import { apiClients, apiMiddlewareConfig } from 'middleware/api';

export const history = createBrowserHistory();

const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware(history)
];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = composeRedux(
  applyMiddleware(
    ...middleware,
    multiClientMiddleware(apiClients, apiMiddlewareConfig)
  ),
  ...enhancers
);

export default function configureStore(preloadedState) {
  const store = createStore(
    rootReducer(history),
    preloadedState,
    composedEnhancers
  );

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('reducers', () => {
      store.replaceReducer(rootReducer(history));
    });
  }

  return store;
}
