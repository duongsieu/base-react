import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import App from 'App';

const Root = ({ store, routes, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App history={history} routes={routes} />
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.objectOf(PropTypes.any).isRequired,
  routes: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default Root;
