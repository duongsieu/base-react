import { APP_NAME } from 'constants/api';

/* ------ Variables sử dụng trọng application ------ */
/* ------ Common ------ */
export const FILE_URL_FORMAT = '{{domain}}/file{{url}}';
// Date format
export const DATE_FORMAT = {
  DATETIME: 'HH:mm DD/MM/YYYY',
  DATE_BEFORE_TIME: 'DD/MM/YYYY HH:mm:ss',
  DATE_BEFORE_TIME_HYPHEN: 'DD/MM/YYYY - HH:mm:ss',
  DATE: 'DD/MM/YYYY',
  TIME: 'HH:mm',
  DATETIME_NO_SPACE: 'YYYYMMDDHHmmss',
  DATE_VIEW_VN: 'ngày LL',
  DATE_HYPHEN: 'DD-MM-YYYY',
  DATE_HYPHEN_YEAR_TO_DAY: 'YYYY-MM-DD',
  YEAR: 'YYYY'
};
// Các giá trị mặc định
export const DEFAULT_VALUE = {
  START_TIME: '00:00',
  END_TIME: '23:59',
  START_HOUR: 0,
  END_HOUR: 23,
  START_MINUTE: 0,
  END_MINUTE: 59,
  START_SECOND: 0,
  END_SECOND: 59,
  START_FILE_INDEX: 0,
  MID_FILE_INDEX: 2,
  AVATAR_CLIENT: '/images/default-avatar.png',
  NUMBER_MIN: 1,
  // Số dòng mặc định của textarea
  TEXTAREA_ROWS: 3,
  // Mật khẩu tạo tài khoản
  ACCOUNT_PASSWORD: '12345678',
  // Pagination
  PAGE: 1,
  PAGE_SIZE: 10,
  // Scroll table
  TABLE_SCROLL_X: 1500,
  TABLE_SCROLL_Y: 480
};
// Max length của các loại input trong form
export const MAX_LENGTH = {
  INPUT: 500,
  NAME: 100,
  TEXTAREA: 1000,
  PHONE_NUMBER: 15,
  PASSWORD: 50,
  CODE: 50,
  SEARCH_INPUT: 100,
  URL: 1000,
  EMAIL: 100
};
// Min length của các loại input trong form
export const MIN_LENGTH = {
  PASSWORD: 8
};
// Max value của các loại input number trong form
export const MAX_NUMBER = {
  MONEY: 9999999999,
  PERCENT: 100,
  QUANTITY: 250,
  // Thông báo quảng cáo - Hồ sơ bảng quảng cáo
  HSBQC_QUANTITY: 99999,
  // Thông báo quảng cáo - Cấu hình hệ thống
  CHHT_THOI_GIAN_GIA_TRI: 50
};
// Min value của các loại input number trong form
export const MIN_NUMBER = {
  MONEY: 1000,
  PERCENT: 1,
  QUANTITY: 1,
  CHHT_THOI_GIAN_GIA_TRI: 0
};
// Min value của các thuộc tính datetime
export const DATE_LIMIT_VALUE = {
  YEAR_MIN: 1970,
  YEAR_MAX: 9999
};
// Giá trị đầu tiên trong select box
export const FIRST_OPTION_SELECT = {
  DON_VI: [{
    id: '',
    name: 'Tất cả đơn vị'
  }],
  QUAN_HUYEN: [{
    ma: '',
    ten: 'Tất cả'
  }],
  SELECT_COMMON: [{
    ma: null,
    moTa: '- Chọn -'
  }],
  HOAT_DONG: [{
    value: '',
    name: 'Tất cả'
  }],
  // Thông báo sản phẩm quảng cáo - Danh mục
  DUONG: [{
    id: '',
    ten: 'Tất cả'
  }],
  LOAI_DUONG: [{
    id: '',
    ten: 'Tất cả'
  }],
  LOAI_QUANG_CAO: [{
    id: '',
    ten: 'Tất cả'
  }],
  // Thông báo sản phẩm quảng cáo - Hồ sơ
  HO_SO: [{
    key: '',
    value: 'Tất cả'
  }],
  // Loại văn bản
  LOAI_VAN_BAN: [{
    key: '',
    value: 'Tất cả'
  }],
  // Thông báo sản phẩm quảng cáo - Thống kê báo cáo
  // Tính phí
  TINH_PHI: [{
    value: '',
    name: 'Tất cả'
  }],
  // Thông báo quảng cáo - Hồ sơ bảng quảng cáo
  LOAI_BANG: [{
    key: '',
    value: 'Tất cả'
  }]
};
// Route
// Đăng nhập
export const LOGIN_ROUTE = '/dang-nhap';
// Trang chủ
export const HOME_ROUTE = '/';
// Trang thông tin
export const THONG_TIN_ROUTE = '/thong-tin';
// Thông số cookie
export const COOKIES_NAME = {
  AUTH: `${APP_NAME}_AUTH_INFO`,
  MOT_CUA: `${APP_NAME}_MOT_CUA_INFO`
};
export const COOKIES_OPTION = {
  path: HOME_ROUTE,
  // Hạn cookies: 24 giờ
  maxAge: 86398
};
// API Status code
export const STATUS_API = {
  ERROR_VALIDATION: 417,
  SUCCESS_LIST: [200, 201]
};
// Layout type
export const LAYOUT_TYPE = {
  MASTER: 'MASTER',
  AUTH: 'AUTH',
  GUEST: 'GUEST'
};
// Screen width
export const SCREEN_WIDTH = {
  MOBILE: 575,
  TABLET: 1200,
  DESKTOP: 1366
};
// Screen type
export const SCREEN_TYPE = {
  MOBILE: 'is-mobile',
  TABLET: 'is-tablet',
  DESKTOP: 'is-desktop'
};
// String format (dùng trong form)
export const STRING_FORMAT = {
  LENGTH: '{{length}}',
  NUMBER: '{{Number}}',
  FIRST: '{{first}}',
  LAST: '{{last}}',
  TOTAL: '{{total}}',
  TYPE: '{{type}}',
  SIZE: '{{size}}',
  DOMAIN: '{{domain}}',
  URL: '{{url}}',
  N: '{{n}}'
};
// Định dạng file hợp lệ
export const VALID_FILE_TYPE = {
  AVATAR: ['.jpeg', '.jpg', '.png'],
  DOCUMENT: ['.pdf', '.doc', '.docx', '.xlsx', '.xls', '.jpeg', '.jpg', '.png', '.ppt', '.pptx'],
  PDF: ['.pdf'],
  WORD: ['.doc', '.docx'],
  EXCEL: ['.xlsx', '.xls'],
  IMAGE: ['.jpeg', '.jpg', '.png'],
  PPT: ['.ppt', '.pptx']
};
// Max size file
export const MAX_SIZE_FILE = {
  AVATAR: 5,
  DOCUMENT_FILE: 20
};
// Type icon Antd
export const ICON_FILE_TYPE = {
  FILE: 'file',
  PDF: 'file-pdf',
  WORD: 'file-word',
  EXCEL: 'file-excel',
  IMAGE: 'file-image',
  PPT: 'file-ppt'
};
// Regex Pattern
export const REGEX_PATTERN = {
  PHONE_NUMBER: /^[0-9]+$/,
  NUMBER: /^[0-9]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_-])[A-Za-z\d!@#$%^&*()_-]{8,50}$/g,
  URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
  CODE: /^[a-zA-Z_]+$/g,
  FORMAT_VIEW_MONEY: /\B(?=(\d{3})+(?!\d))/g
};
// Query param
export const QUERY_PARAM = {
  // Tên param sử dụng khi một ứng dụng cần login qua QTUD, sau đó điều hướng trở lại
  REDIRECT_CALLBACK: 'redirect_callback',
  FROM_DOMAIN: 'from_domain',
  TOKEN: 'access_token',
  EXPIRES_IN: 'expires_in',
  TITLE_ID: 'titleId',
  TYPE_ERROR: 'error',
  MESSAGE_ERROR: 'errorDescription'
};
// Hoạt động
export const HOAT_DONG = {
  TAT_CA: '',
  HOAT_DONG: 'true',
  KHONG_HOAT_DONG: 'false'
};
// Định nghĩa option sử dụng cho window.open
export const WINDOW_OPEN_TOKEN_OPTION = {
  // Các sites khác sử dụng chung đăng nhập của hệ thống quản trị người dùng
  EXTERNAL_AUTH_SITE: {
    name: '_self'
  },
  // Các sites khác (khác đăng nhập)
  EXTERNAL_NORMAL_SITE: {
    name: '_blank'
  },
  // Đăng xuất SSO
  EXTERNAL_AUTH_LOGOUT_SSO: {
    name: '_blank',
    shouldReturnWindow: true
  }
};
// Những route được phép truy cập từ bên ngoài bằng token
export const ALLOWED_ACCESS_ROUTE_FROM_EXTERNAL = [
  HOME_ROUTE,
  '/thong-tin-nguoi-dung'
];
// Định nghĩa các thông tin liên quan hiển thị message từ API
export const CUSTOM_ERROR = {
  TYPE_ERROR: {
    AUTH: ['unauthorized']
  },
  FIELD_NAME: {
    TYPE: 'error',
    MESSAGE: 'errorDescription',
    LOGOUT_SSO: 'logoutSso'
  }
};
// Loại hệ thống
export const TYPE_SYSTEM = {
  // Phụ thuộc = QTUD + một ứng dụng khác
  DEPENDENT: 'DEPENDENT',
  // Độc lập = QTUD
  INDEPENDENT: 'INDEPENDENT'
};

// reCAPTCHA field name
export const RECAPTCHA_FIELD_NAME = {
  // Trạng thái đã callback
  CALLBACK: 'callback',
  // reCAPTCHA value
  VALUE: 'value',
  // reCAPTCHA value đã load recaptcha chưa
  LOADED: 'loaded',
  // reCAPTCHA value đã hết hạn chưa
  EXPIRED: 'expired'
};

// Field name chung sử dụng trong hệ thống
export const FIELD_NAME = {
  ID: 'id',
  DATA: 'data',
  DATA_SOURCE: 'dataSource',
  DELETE_ROW: 'deletedRow',
  ERROR: 'error',
  IS_EDIT: 'isEdit',
  IS_NEW: 'isNew',
  KEY: 'key',
  SELECTED_ROWS: 'selectedRows',
  STT: 'stt'
};

/* ------ TODO: Example ------ */
export const TAB_KEY = {
  TAB1: 'tab1',
  TAB2: 'tab2'
};
export const TAB = [
  {
    key: 'TAB1',
    name: 'Tab1',
    iconType: 'file-done',
    conditions: []
  },
  {
    key: 'TAB2',
    name: 'Tab2',
    iconType: 'form',
    conditions: []
  }
];

/* ------ Common ------ */
// Type guest menu header
export const TYPE_GUEST_MENU = {
  LINK: 'LINK',
  BUTTON: 'BUTTON',
  USER_INFO: 'USER_INFO'
};
