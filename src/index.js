import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import configureStore, { history } from 'store';
import { routes } from 'routes';
import Root from 'Root';
import * as serviceWorker from 'serviceWorker';

const store = configureStore();

history.listen(() => {
  Modal.destroyAll();
});

ReactDOM.render((
  <Root
    history={history}
    routes={routes}
    store={store}
  />
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
