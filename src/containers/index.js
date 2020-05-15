import React from 'react';
import loadable from '@loadable/component';
import { Loading } from 'components/common';

/* ------------------------------------------------------------------------- */
// TODO: Example
/* ------------------------------------------------------------------------- */
const PageExample1 = loadable(() => import('./example/PageExample1'), {
  fallback: <Loading />
});
const PageExample2 = loadable(() => import('./example/PageExample2'), {
  fallback: <Loading />
});
/* ------------------------------------------------------------------------- */
// Common
/* ------------------------------------------------------------------------- */
const NotFound = loadable(() => import('./NotFound'), {
  fallback: <Loading />
});
const PrepareFeature = loadable(() => import('./PrepareFeature'), {
  fallback: <Loading />
});

/* ------------------------------------------------------------------------- */
// THÔNG BÁO SẢN PHẨM QUẢNG CÁO - TRANG CHỦ
/* ------------------------------------------------------------------------- */
const TrangThongTin = loadable(() => import('./trangChu/TrangThongTin'), {
  fallback: <Loading />
});
const GuestLayout = loadable(() => import('./GuestLayout'), {
  fallback: <Loading />
});

export {
  NotFound,
  PageExample1,
  PageExample2,
  PrepareFeature,
  TrangThongTin,
  GuestLayout
};
