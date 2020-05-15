/* -------- Common actions -------- */
import {
  SET_LOADING_APP
} from 'constants/actionTypes';

const canceledKeys = [];

export const cancelCommonAPI = () => () => {
  if (canceledKeys.length > 0) {
    canceledKeys.map(item => item.canceled.cancel(`cancel_API-${item.key}`));
  }
};

/**
 * Set loading cho App
 * @param {Boolean} loading Giá trị loading
 * @returns {Object} result
 */
export const setLoadingApp = (loading = false) => ({
  type: SET_LOADING_APP,
  loading
});
