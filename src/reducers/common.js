/* -------- Reducer chung-------- */
import {
  SET_LOADING_APP
} from 'constants/actionTypes';

const initialState = {
  loadingApp: false,
  shouldLoadInitialComboboxs: false
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    // Set loading cho App (chẳng hạn khi get thông tin user)
    case SET_LOADING_APP:
      return {
        ...state,
        loadingApp: action.loading
      };
    default:
      return state;
  }
}
