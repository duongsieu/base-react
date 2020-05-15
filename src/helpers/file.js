/* -------- Helper functions về file -------- */
import {
  get,
  isArray,
  isEmpty,
  isFunction,
  isString
} from 'lodash';
import {
  getReplaceString
} from 'helpers';
import {
  FILE_URL_FORMAT,
  ICON_FILE_TYPE,
  STRING_FORMAT,
  VALID_FILE_TYPE
} from 'constants/variables';
import { API_FILE_URL } from 'constants/api';
import messages from 'constants/messages';
import { hasErrorResponseAPI } from './utils';

/**
 * Validate file cho form
 * @param {String} message Message chính
 * @returns {Function} Custom validate function của antd
 */
export const validateFile = message => (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  const mainMessage = message || rule.message;
  // Lấy giá trị của file
  const data = get(value, 'data');
  // Lấy giá trị errors
  const errors = get(value, 'errors');
  // Trường hợp file rỗng, không có errors và có message (bắt buộc)
  if (isEmpty(data) && isEmpty(errors) && mainMessage) {
    return callback(mainMessage);
  }
  // Lấy error đầu tiên
  const firstError = get(errors, '[0]');
  // Trường hợp có lỗi
  if (firstError) {
    return callback(firstError);
  }
  // Pass validation
  return callback();
};

/**
 * Kiểm tra size file có hợp lệ không
 * @export
 * @param {File|Object} file File cần kiểm tra hoặc object chứa [size]
 * @param {Number} maxSize Max size file (KB)
 * @returns {Boolean}
 */
export function isValidSize(file, maxSize) {
  let isValid = true;
  // Kiểm tra dung lượng file
  const size = get(file, 'size') || 0;
  if (size > maxSize * 1024 * 1024) {
    isValid = false;
  }
  return isValid;
}

/**
 * Kiểm tra type file có hợp lệ không
 * @export
 * @param {File} file File cần kiểm tra
 * @param {array} typesFile Các types file hợp lệ
 * @returns {Boolean}
 */
export function isValidType(file, typesFile = []) {
  if (isEmpty(file)) {
    return false;
  }
  let isValid = true;
  // Trả kết quả về true nếu typesFile rỗng
  if (!isArray(typesFile) || isEmpty(typesFile)) {
    return isValid;
  }
  // Kiểm tra định dạng file
  const fileName = file.name;
  const extension = `.${fileName.split('.').pop().toLowerCase()}`;
  if (typesFile.indexOf(extension) === -1) {
    isValid = false;
  }
  return isValid;
}

/**
 * Get đường dẫn tuyệt đối của file
 * @export
 * @param {Object} {
 *  @param {Object} file Data file
 *  @param {Object} imageURL Image URL
 * }
 * @returns {String} finalURL
 */
export function getFileURL({ file, imageURL }) {
  const url = imageURL || get(file, 'path', '');
  if (!isString(url) || isEmpty(url)) {
    return null;
  }
  if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) {
    return url;
  }
  const finalURL = getReplaceString(FILE_URL_FORMAT, [
    {
      format: STRING_FORMAT.DOMAIN,
      value: API_FILE_URL
    },
    {
      format: STRING_FORMAT.URL,
      value: url
    }
  ]);
  return finalURL;
}

/**
 * Get type Icon Antd theo tên file
 * @export
 * @param {String} fileName Tên file
 * @returns {String} Type Icon Antd
 */
export function getIconTypeFile(fileName) {
  if (!isString(fileName)) {
    return undefined;
  }
  const extension = `.${fileName.split('.').pop().toLowerCase()}`;
  if (VALID_FILE_TYPE.PDF.includes(extension)) {
    return ICON_FILE_TYPE.PDF;
  }
  if (VALID_FILE_TYPE.WORD.includes(extension)) {
    return ICON_FILE_TYPE.WORD;
  }
  if (VALID_FILE_TYPE.EXCEL.includes(extension)) {
    return ICON_FILE_TYPE.EXCEL;
  }
  if (VALID_FILE_TYPE.IMAGE.includes(extension)) {
    return ICON_FILE_TYPE.IMAGE;
  }
  if (VALID_FILE_TYPE.PPT.includes(extension)) {
    return ICON_FILE_TYPE.PPT;
  }
  return ICON_FILE_TYPE.FILE;
}

/**
 * Get className Icon Antd theo Icon file
 * @export
 * @param {String} iconType Icon file
 * @returns {String} className
 */
export function getIconClassNameFile(iconType) {
  if (!isString(iconType)) {
    return '';
  }
  switch (iconType) {
    case ICON_FILE_TYPE.PDF:
      return 'color-red';
    case ICON_FILE_TYPE.WORD:
      return 'color-blue';
    case ICON_FILE_TYPE.EXCEL:
      return 'color-green';
    case ICON_FILE_TYPE.IMAGE:
      return 'color-light-blue';
    case ICON_FILE_TYPE.PPT:
      return 'color-orange';
    default:
      return '';
  }
}

/**
 * Upload files
 * @export
 * @param {Array} files Danh sách file cần upload
 * @param {Function} requestAPI Request API
 * @returns {void} Thực hiện upload từng file, trả về kết quả cuối cùng
 */
export function uploadFiles(files, requestAPI) {
  // Không thực hiện nếu chưa có requestAPI
  if (!isFunction(requestAPI)) {
    return {
      data: null,
      error: new Error('Chưa có requestAPI')
    };
  }
  // Trả về mảng rỗng nếu rỗng files
  if (isEmpty(files)) {
    return [];
  }
  // Kiểm tra file đã được upload lên server chưa
  const isUploaded = file => isEmpty(file.uid) || !!file.fileId;
  // Thực hiện quá trình upload từng file
  return Promise.all(
    files.map(async (file, i) => {
      // Nếu file đã được upload thì trả ngay file hiện tại
      if (isUploaded(file)) {
        return file;
      }
      // Lấy thông tin upload file
      const fileBlob = file.originFileObj || file;
      // Gọi API upload file
      const response = await requestAPI(fileBlob) || {};
      // Kiểm tra response hợp lệ hay không
      if (hasErrorResponseAPI(response)) {
        throw get(response, 'error', messages.ERROR_SYSTEM);
      }
      // Convert kết quả
      const newFile = {
        ...response.payload,
        origin: file
      };
      // Trả kết quả
      return newFile;
    })
  ).then(result => ({
    data: result,
    error: null
  })).catch(error => ({
    data: null,
    error
  }));
}

/**
 * Mở file trên trình duyệt
 * @export
 * @param {*} link Link file
 * @param {String} [name='_blank']
 * @param {*} specs
 * @param {*} replace
 * @returns
 */
export function openFileInBrowser(link, name = '_blank', specs, replace) {
  if (!link) {
    return;
  }
  // Lấy URL theo domain API file
  let URL = `${API_FILE_URL}${link}`;
  // Trường hợp URL
  if (link.indexOf('https://') > -1 || link.indexOf('http://') > -1) {
    URL = link;
  }
  window.open(URL, name, specs, replace);
}

/**
 * Chuyển đổi model file về dạng đồng nhất
 * @param {*} file File cần chuyển đổi
 * @returns {Object|Null} Giá trị của file sau khi chuyển đổi
 */
export function convertModelFile(file) {
  if (isEmpty(file)) {
    return null;
  }
  const result = {
    ...file,
    id: get(file, 'id') || get(file, 'fileId'),
    originalName: get(file, 'originalName') || get(file, 'tenFileBanDau'),
    name: get(file, 'name') || get(file, 'tenFile'),
    extension: get(file, 'extension'),
    url: get(file, 'url'),
    size: get(file, 'size')
  };
  return result;
}
