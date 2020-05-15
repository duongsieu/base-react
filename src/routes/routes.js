/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import {
  NotFound,
  TrangThongTin
} from 'containers';
import {
  HOME_ROUTE,
  LAYOUT_TYPE
} from 'constants/variables';

const routes = [
  /* ------------------------------------------------------------------------- */
  // Trang chủ
  /* ------------------------------------------------------------------------- */
  { path: HOME_ROUTE, exact: true, isRequiredLogin: true, component: TrangThongTin },
  { path: '/thong-tin', exact: true, layout: LAYOUT_TYPE.GUEST, isRequiredLogin: false, component: TrangThongTin },

  /* ------------------------------------------------------------------------- */
  // Khác
  /* ------------------------------------------------------------------------- */
  // Not found
  { isRequiredLogin: false, layout: null, component: NotFound }
];

export default routes;
