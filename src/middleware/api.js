import axios from 'axios';
import {
  API_FEATURE_DOMAIN
} from 'constants/api';
import { camelizeKeys } from 'humps';
import { getActionTypes } from 'redux-axios-middleware';
import { get, isEmpty } from 'lodash';
import { Cookies } from 'react-cookie';
import { COOKIES_NAME, COOKIES_OPTION } from 'constants/variables';
import QueryString from 'query-string';

const cookies = new Cookies();

export const apiClients = {
  default: {
    client: axios.create({
      baseURL: API_FEATURE_DOMAIN,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, application/problem+json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: 0
      },
      transformResponse: [function onConvertResponse(data) {
        if (!isEmpty(data)) {
          return camelizeKeys(typeof data !== 'object' ? JSON.parse(data) : data);
        }
        return data;
      }]
    })
  },
  textPlain: {
    client: axios.create({
      responseType: 'text/plain',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        Accept: 'text/plain;charset=UTF-8'
      }
    })
  }
};

export const apiMiddlewareConfig = {
  interceptors: {
    request: [
      function onConvertRequest({ getState, dispatch, getSourceAction }, req) {
        // req: contains information about request object
        const authInfo = cookies.get(COOKIES_NAME.AUTH, COOKIES_OPTION);
        const titleId = get(authInfo, 'currentTitleId');
        if (titleId) {
          req.headers.titleId = titleId;
        }
        if (!isEmpty(req.params)) {
          req.paramsSerializer = params => QueryString.stringify(params);
        }
        return req;
      }
    ]
  },

  onSuccess: ({ action, next, response }, options) => {
    const nextAction = {
      type: getActionTypes(action, options)[1],
      payload: response.data,
      meta: {
        previousAction: action
      },
      origin: response
    };
    next(nextAction);
    return nextAction;
  },
  onError: ({
    action, next, error, dispatch
  }, options) => {
    const errorObj = { ...error };
    const type = getActionTypes(action, options)[1];
    // khởi tạo giá trị mặc định của error
    let finalError = {
      data: get(errorObj, 'message', 'ERROR'),
      status: 0
    };
    // lấy error từ server nếu có
    if (!isEmpty(get(errorObj, 'response'))) {
      finalError = errorObj.response;
    }
    // log error ở môi trường development
    if (process.env.NODE_ENV !== 'production') {
      console.error('HTTP Failure in Axios', error);
    }
    const nextAction = {
      type,
      error: finalError,
      meta: {
        previousAction: action
      }
    };
    next(nextAction);
    return nextAction;
  }
};
