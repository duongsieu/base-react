/* -------- Helper functions string -------- */
import {
  get,
  isArray,
  isEmpty,
  isObject,
  isString
} from 'lodash';
import QueryString from 'querystring';
import parse from 'html-react-parser';
import messages from 'constants/messages';
import {
  REGEX_PATTERN,
  STRING_FORMAT
} from 'constants/variables';
import { getDateTime } from 'helpers/datetime';

/**
 * Kiểm tra một giá trị có phải là string không
 * @param {*} value Giá trị cần kiểm tra
 * @returns {Boolean}
 */
export function isLetter(value) {
  return value.length === 1 && value.match(/[a-z]/i);
}

/**
 * Trim string
 * @param {*} param
 * @returns {String|*} result
 */
export function trimString(param) {
  if (!isString(param)) {
    return param;
  }
  return param.trim();
}

/**
 * Trim tất cả string nằm trong data
 * @param {*} data the data
 * @returns {*} result
 */
export function trimStringInData(data) {
  if (isString(data)) {
    return trimString(data);
  }
  if (isArray(data)) {
    return data.map(item => trimStringInData(item));
  }
  if (isObject(data)) {
    const keys = Object.keys(data);
    const result = { ...data };
    keys.forEach((key) => {
      result[key] = trimStringInData(data[key]);
    });
    return result;
  }
  return data;
}

/**
 * Replace chuỗi từ params cụ thể
 * @param {String} originString Chuỗi cần replace
 * @param {Object[]} params Mảng các param dùng để replace
 * @param {String} params[].format Format để replace
 * @param {String} params[].value Giá trị tương ứng "format"
 * @param {Boolean} [isHTML=false] Kiểm tra có sử chuyển đổi kết qua sang HTML hay không
 * @example Ví dụ thay thế "{{name}}" trong chuỗi "Hello {{name}}" bằng "David"
 * // returns "Hello David"
 * getReplaceString('Hello {{name}}', [{ format: '{{name}}', value: 'David' }])
 */
export function getReplaceString(originString, params = [], isHTML = false) {
  if (!isString(originString) || !isArray(params) || isEmpty(params)) {
    return '';
  }
  let result = originString;
  params.forEach((param) => {
    const { format, value } = param;
    result = result.replace(format, value);
  });
  // Kiểm tra điều kiện để chuyển đổi string sang HTML
  if (isHTML) {
    result = parse(result);
  }
  return result;
}

/**
 * Get title cho table (sử dụng ở các danh sách)
 * @export
 * @param {Number} current Trang hiện tại
 * @param {Number} pageSize Page size
 * @param {Number} total Tổng số record
 * @returns {String} title
 */
export function getTitleTable(current, pageSize, total) {
  if (!current || !pageSize || !total) {
    return '';
  }
  // Record bắt đầu trang
  const first = (current - 1) * pageSize + 1;
  // Record kết thúc trang
  // (ở page cuối cùng sẽ lấy theo total - trường hợp page không đủ số lượng bằng pageSize)
  const last = Math.min((current - 1) * pageSize + pageSize, total);
  const title = getReplaceString(messages.TITLE_TABLE, [
    { format: STRING_FORMAT.FIRST, value: first },
    { format: STRING_FORMAT.LAST, value: last },
    { format: STRING_FORMAT.TOTAL, value: total }
  ]);
  return title;
}

/**
 * Kiểm tra password có hợp lệ hay không
 * @param {*} value Giá trị cần kiểm tra
 * @returns {Boolean}
 */
export function validateValidPassword(value) {
  if (!isString(value)) {
    return false;
  }
  // password không được chứa ký tự trắng
  const rule = new RegExp(REGEX_PATTERN.PASSWORD);
  return rule.test(value);
}

/**
 * Chuyển đổi một giá trị về dạng string
 * @export
 * @param {*} value Giá trị cần chuyển đổi
 * @returns {String} Giá trị được chuyển đổi sang string
 */
export function convertToString(value) {
  if (value === null || value === undefined || value === false) {
    return '';
  }
  return String(value);
}

/**
 * Lấy chữ cái đầu tiên trong chuỗi
 * @export
 * @param {*} value Chuỗi cần lấy
 * @returns {String} Chữ cái đầu tiên
 */
export function getFirstLetter(value) {
  if (!isString(value) || isEmpty(value)) {
    return '';
  }
  return value[0];
}

/**
 * Sinh ra chuỗi ký tự ngẫu nhiên
 * @param {Boolean} hasCurrentTime Có thêm thời gian hiện tại không
 * @returns {String}
 */
export function generateRandomKey(hasCurrentTime = true) {
  let randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (hasCurrentTime) {
    const timeString = getDateTime({
      value: new Date(),
      format: 'YYYYMMDDHHmmss'
    });
    randomString = `${randomString}-${timeString}`;
  }
  return randomString;
}

/**
 * Sinh ra chuỗi ký tự ngẫu nhiên duy nhất trong một danh sách cho trước
 * @param {Array<String>} keys Danh sách keys đã có
 * @returns {Object} { key, keys }
 * @returns {String} key Chuỗi mới
 * @returns {Array<String>} keys Danh sách các chuỗi sau khi sinh chuỗi mới
 */
export function generateRandomListKeys(keys = []) {
  let randomString = generateRandomKey();
  while (keys.includes(randomString)) {
    randomString = generateRandomKey();
  }
  return {
    key: randomString,
    keys: [...keys, randomString]
  };
}

/**
 * Chuyển đổi URL
 * @param {String} url Đường dẫn
 * @param {Object} option Option
 * @param {Object} option.params Query params cho đường dẫn
 * @returns {String}
 */
export function parseURL(url, option) {
  const queryParams = get(option, 'queryParams');
  let result = url;
  if (!isEmpty(queryParams)) {
    // Lấy query string
    const queryString = QueryString.stringify(queryParams);
    // Đường dẫn hoàn chỉnh
    result = `${result}?${queryString}`;
  }
  return result;
}

/**
 * Lấy domain từ URL
 * @param {String} url URL cần lấy domain
 * @returns {String} Protocol + domain + port)
 */
export function getDomain(url) {
  if (!isString(url)) {
    return '';
  }
  const matches = url.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
  if (matches !== null && matches.length > 1 && typeof matches[1] === 'string' && matches[1].length > 0) {
    const domain = matches[1];
    const indexDomain = url.indexOf(domain);
    const protocol = url.substr(0, indexDomain);
    const result = `${protocol}${domain}`;
    return result;
  }
  return '';
}
