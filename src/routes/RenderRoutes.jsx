import React from 'react';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import {
  Redirect,
  Route,
  withRouter
} from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { GuestLayout } from 'containers';
import {
  LAYOUT_TYPE,
  THONG_TIN_ROUTE
} from 'constants/variables';
import ConnectedSwitch from './ConnectedSwitch';

const renderComponent = (route, props) => {
  if (isEmpty(route)) {
    return null;
  }
  const { layout = LAYOUT_TYPE.MASTER } = route;
  switch (layout) {
    // Hiển thị component được bọc bởi GuestLayout
    case LAYOUT_TYPE.GUEST:
      return (
        <GuestLayout {...props}>
          <route.component
            {...props}
            routes={route.routes}
          />
        </GuestLayout>
      );
    default:
      return (
        <route.component
          {...props}
          routes={route.routes}
        />
      );
  }
};

const RenderRoutes = ({ routes, location }) => {
  if (!routes) {
    return null;
  }
  const queryParams = QueryString.parse(get(location, 'search'));
  return (
    <ConnectedSwitch>
      { routes.map((route, i) => (
        <Route
          key={i}
          exact
          path={route.path}
          render={props => (
            <React.Fragment>
              {
                route.isRequiredLogin !== false
                && (
                  <Redirect
                    to={{
                      pathname: THONG_TIN_ROUTE
                    }}
                  />
                )
              }
              {
                (
                  route.isRequiredLogin === false
                ) && renderComponent(route, { ...props, queryParams })
              }
            </React.Fragment>
          )}
        />
      ))}
    </ConnectedSwitch>
  );
};

RenderRoutes.propTypes = {
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  routes: PropTypes.arrayOf(PropTypes.any).isRequired
};

export default withRouter(RenderRoutes);
