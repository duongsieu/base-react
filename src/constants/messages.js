import {
  STRING_FORMAT
} from 'constants/variables';

/* ------ Messages sử dụng trong application ------ */
export default {
  // Common
  ENTER_INPUT_TO_SEARCH: 'Nhập để tìm kiếm',
  ERROR_SYSTEM: 'Có lỗi trong quá trình tải dữ liệu',
  NO_DATA: 'Không có dữ liệu',
  // Thông báo
  DELETE_SUCCEED: 'Xóa thành công',
  DELETE_FAILED: 'Xóa không thành công',
  NOTIFICATION_TITLE: 'Thông báo',
  SAVE_SUCCEED: 'Lưu thành công',
  SAVE_FAILED: 'Lưu không thành công',
  SEND_SUCCEED: 'Gửi thành công',
  SEND_FAILED: 'Gửi không thành công',
  CANCEL_SUCCEED: 'Hủy thành công',
  CANCEL_FAILED: 'Hủy không thành công',
  // Vaidation
  AUTH_FAILED: 'Hệ thống đang xảy ra sự cố. Vui lòng đăng nhập lại sau.\n',
  INVALID_CODE: 'Chỉ bao gồm chữ cái không dấu, dấu _ và không chứa khoảng trắng.',
  INVALID_CONFIRM_PASSWORD: 'Hai mật khẩu không giống nhau.\n',
  INVALID_DATA: 'Dữ liệu không hợp lệ.',
  INVALID_EMAIL: 'Email không hợp lệ.\n',
  INVALID_FILE: `Hệ thống hỗ trợ định dạng file ${STRING_FORMAT.TYPE}, dung lượng <= ${STRING_FORMAT.SIZE}MB.\n`,
  INVALID_NUMBER: 'Trường này chỉ được nhập số\n',
  INVALID_PASSWORD: `Mật khẩu phải có từ 8-50 ký tự.
    Dùng ít nhất một chữ số, một chữ hoa, một chữ thường, một ký tự đặc biệt và không chứa khoảng trắng.\n`,
  INVALID_TITLE: 'Mỗi ứng dụng phải có một vai trò chính đang hoạt động.',
  INVALID_TYPE_FILE: `File không hợp lệ. Vui lòng chỉ nhập các file ${STRING_FORMAT.TYPE}\n`,
  LOGIN_FAILED: 'Tài khoản hoặc mật khẩu của bạn không hợp lệ. Vui lòng thử lại.\n',
  MAX_AVATAR_SIZE: `Vui lòng nhập file tối da ${STRING_FORMAT.SIZE} MB.\n`,
  MAX_INPUT: `Trường này không được nhập quá ${STRING_FORMAT.LENGTH} kí tự.\n`,
  MIN_INPUT: `Trường này không được nhập ít hơn ${STRING_FORMAT.LENGTH} kí tự.\n`,
  MIN_NUMBER: `Trường này không được nhập nhỏ hơn ${STRING_FORMAT.NUMBER}\n`,
  MAX_NUMBER: `Trường này không được nhập lớn hơn ${STRING_FORMAT.NUMBER}\n`,
  INVALID_BETWEEN_NUMBER: `Vui lòng nhập giá trị từ ${STRING_FORMAT.NUMBER} đến ${STRING_FORMAT.NUMBER}`,
  REQUIRED_FIELD: 'Bạn không được bỏ trống trường này.\n',
  // Danh sách
  TITLE_TABLE: `Hiển thị kết quả từ ${STRING_FORMAT.FIRST} - ${STRING_FORMAT.LAST}
    trên tổng ${STRING_FORMAT.TOTAL} kết quả.`,
  // Select
  INACTIVATED_INFO: 'Dữ liệu đã bị khóa',
  // Auth
  INVALID_URL_APPLICATION: 'URL ứng dụng không hợp lệ',
  INVALID_DATE_AFTER_CURRENT: 'Chọn ngày lớn hơn ngày hiện tại.',
  INVALID_DATE_AFTER_OR_EQUAL_CURRENT: 'Chọn ngày lớn hơn hoặc bằng ngày hiện tại.',
  // Thông báo sản phẩm quảng cáo - Hồ sơ
  INVALID_HO_SO_RANGE_QUATITY_DAY: `Thời gian đăng ký không được quá ${STRING_FORMAT.NUMBER} ngày.\n`,
  INVALID_HO_SO_MAX_QUATITY_DAY: `Thời điểm đăng ký không được quá  ${STRING_FORMAT.NUMBER} ngày so với hiện tại.\n`,
  // Thông báo sản phẩm quảng cáo - Vị trí
  INVALID_KHOA_VI_TRI_RANGE_QUATITY_DAY: `Thời gian không được quá ${STRING_FORMAT.NUMBER} ngày.\n`
};
