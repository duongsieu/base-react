import React from 'react';
import loadable from '@loadable/component';
import Loading from './Loading';
import { EditTableFormRow } from './EditTableCell';

// Components không splitting code
export { default as Loading } from './Loading';
export { default as Notification } from './Notification';
export { default as Modal } from './Modal';

// Components cần splitting code, sử dụng Loading cho fallback
const Checkbox = loadable(() => import('./Checkbox'), {
  fallback: <Loading />
});
const Container = loadable(() => import('./Container'), {
  fallback: <Loading />
});
const ContentWrapper = loadable(() => import('./ContentWrapper'), {
  fallback: <Loading />
});
const DatePicker = loadable(() => import('./DatePicker'), {
  fallback: <Loading />
});
const DatePickerRange = loadable(() => import('./DatePickerRange'), {
  fallback: <Loading />
});
const ErrorSystem = loadable(() => import('./ErrorSystem'), {
  fallback: <Loading />
});
const FileView = loadable(() => import('./FileView'), {
  fallback: <Loading />
});
const HeadingPage = loadable(() => import('./HeadingPage'), {
  fallback: <Loading />
});
const HeadingTab = loadable(() => import('./HeadingTab'), {
  fallback: <Loading />
});
const ButtonIcon = loadable(() => import('./ButtonIcon'), {
  fallback: <Loading />
});
const LoadingWrapper = loadable(() => import('./LoadingWrapper'), {
  fallback: <Loading />
});
const ModalPage = loadable(() => import('./ModalPage'), {
  fallback: <Loading />
});
const NoData = loadable(() => import('./NoData'), {
  fallback: <Loading />
});
const Popover = loadable(() => import('./Popover'), {
  fallback: <Loading />
});
const PrepareFeatureContent = loadable(() => import('./PrepareFeatureContent'), {
  fallback: <Loading />
});
const Table = loadable(() => import('./Table'), {
  fallback: <Loading />
});
const TreeSelect = loadable(() => import('./TreeSelect'), {
  fallback: <Loading />
});
// TreeSelect với loadData được custom
const TreeSelectLoadData = loadable(() => import('./TreeSelectLoadData'), {
  fallback: <Loading />
});
const UploadImages = loadable(() => import('./UploadImages'), {
  fallback: <Loading />
});
const YearPicker = loadable(() => import('./YearPicker'), {
  fallback: <Loading />
});
const YearPickerRange = loadable(() => import('./YearPickerRange'), {
  fallback: <Loading />
});
const Editor = loadable(() => import('./Editor'), {
  fallback: <Loading />
});

// Components cần splitting code, không sử dụng Loaing cho fallback
const Input = loadable(() => import('./Input'));
const Pagination = loadable(() => import('./Pagination'));
const Select = loadable(() => import('./Select'));
const SelectSearch = loadable(() => import('./SelectSearch'));
const UploadAvatar = loadable(() => import('./UploadAvatar'));
const UploadFiles = loadable(() => import('./UploadFiles'));
const EditTableCell = loadable(() => import('./EditTableCell'));

export {
  Checkbox,
  Container,
  ContentWrapper,
  DatePicker,
  DatePickerRange,
  Editor,
  EditTableCell,
  EditTableFormRow,
  ErrorSystem,
  FileView,
  HeadingPage,
  HeadingTab,
  ButtonIcon,
  LoadingWrapper,
  ModalPage,
  NoData,
  Popover,
  PrepareFeatureContent,
  Table,
  TreeSelect,
  TreeSelectLoadData,
  UploadImages,
  YearPicker,
  YearPickerRange,
  Input,
  Pagination,
  Select,
  SelectSearch,
  UploadAvatar,
  UploadFiles
};
