/* -------- Helper functions về number -------- */
import {
  get,
  isEmpty,
  isInteger,
  isNaN
} from 'lodash';
import {
  REGEX_PATTERN
} from 'constants/variables';
/**
 * Convert một giá trị sang number
 * @param {*} value
 * @returns {Number} result
 */
export function toNumber(value) {
  if (isNaN(Number(value))) {
    return undefined;
  }
  return Number(value);
}

/**
 * Validate number cho form
 * @param {Object} rule
 * @param {String} message Message chính
 * @param {Object} options Optional params
 * @param {Object} options.integer Data ({value, message}) để kiểm tra giá trị là integer hay không
 * @param {Object} options.max Data ({value, message}) để kiểm tra giá trị nhỏ hơn max hay không
 * @param {Object} options.min Data ({value, message}) để kiểm tra giá trị lớn hơn min hay không
 * @returns {Function} Custom validate function
 */
export const validateNumber = (message, options) => (rule, value, callback) => {
  const newValue = toNumber(value);
  const mainMessage = message || rule.message;
  if (isNaN(newValue)) {
    return callback(mainMessage);
  }
  if (isEmpty(options)) {
    return callback();
  }
  // check integer
  const integer = get(options, 'integer', {});
  if (!isEmpty(integer) && !isInteger(newValue)) {
    return callback(get(integer, 'message') || mainMessage);
  }
  // check max
  const max = get(options, 'max', {});
  if (isInteger(get(max, 'value')) && newValue > get(max, 'value')) {
    return callback(get(max, 'message') || mainMessage);
  }
  // check min
  const min = get(options, 'min', {});
  if (isInteger(get(min, 'value')) && newValue < get(min, 'value')) {
    return callback(get(min, 'message') || mainMessage);
  }
  return callback();
};

/**
 * Get số thứ tự trong danh sách
 * @param {Number} [page=1]
 * @param {Number} [index=0]
 * @param {Number} [size=10]
 * @returns {String}
 */
export function getOrder(page = 1, index = 0, size = 10) {
  const num = ((page - 1) * size + index + 1);
  return num;
}

/**
 * Chuyển đổi một số hiển thị dạng money
 * @param {*} value Giá trị cần chuyển đổi
 * @returns {String} Giá trị được chuyển đổi dạng money
 */
export function convertNumberToMoneyFormat(value, hasCurrency = true) {
  if (!value && !hasCurrency) {
    return '';
  }
  if (!value && hasCurrency) {
    return '0 VND';
  }
  let valueMoney = Math.round(toNumber(value) || 0);
  valueMoney = valueMoney.toString();
  let result = `${valueMoney}`.replace(REGEX_PATTERN.FORMAT_VIEW_MONEY, ',');
  if (hasCurrency) {
    result = `${result} VND`;
  }
  return result;
}

/**
 * Chuyển đổi một số hiển thị dạng money cho Input
 * @param {*} value Giá trị cần chuyển đổi
 * @returns {String} Giá trị được chuyển đổi dạng money
 */
export function convertNumberToMoneyFormatForInput(value) {
  return convertNumberToMoneyFormat(value, false);
}
