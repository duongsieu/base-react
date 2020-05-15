/* -------- Helper functions về datetime -------- */
import {
  get,
  isEmpty,
  isInteger
} from 'lodash';
import moment from 'moment';
import {
  DATE_FORMAT,
  DATE_LIMIT_VALUE,
  DEFAULT_VALUE
} from 'constants/variables';
import { range } from 'helpers';

/**
 * Convert datetime theo format
 * @param {Object} data Dữ liệu đầu vào
 * @param {*} data.value datetime value
 * @param {String} data.format format
 * @param {String} data.formatUTC format UTC
 * @param {Boolean} data.isUTC mặc định trả về giờ local, nếu isUTC = true, trả về giờ UTC
 * @param {Boolean} data.isString nếu isString = true, trả về datetime dạng string
 * @returns {moment} moment instance
 */
export function getDateTime({
  value = undefined,
  format = null,
  formatUTC = null,
  isUTC = false,
  isString = true
}) {
  if (!value || !moment(value).isValid()) {
    return undefined;
  }
  const newValue = isUTC ? moment.utc(value, format) : moment.utc(value, formatUTC).local();
  let result = newValue;
  if (isString && isEmpty(format)) {
    result = moment(newValue).format();
  }
  if (isString && !isEmpty(format)) {
    result = moment(newValue).format(format);
  }
  if (!isString && isEmpty(format)) {
    result = moment(moment(newValue).format());
  }
  if (!isString && !isEmpty(format)) {
    result = moment(moment(newValue).format(format), format);
  }
  return result;
}

/**
 * Set date
 * @param {*} originValue Giá trị ban đầu
 * @param {*} targetValue Giá trị đích
 * @param {Object} format Formats
 * @param {String} format.originValue Format của originValue
 * @param {String} format.targetValue Format của targetValue
 * @param {Array.<String>} attributes Các attributes sẽ được set cho giá trị mới
 * @param {Object} add Object data định nghĩa input cho "moment.add()" method
 * @param {Object} subtract Object data định nghĩa input cho "moment.subtract()" method
 * @returns {moment} Moment instace
 */
export function setDate({
  originValue = null,
  targetValue = null,
  format = {
    originValue: undefined,
    targetValue: undefined
  },
  attributes = ['year', 'month', 'date'],
  add = {},
  subtract = {},
  isUTC = false
}) {
  if (!originValue && (!targetValue || isEmpty(add) || isEmpty(subtract))) {
    return undefined;
  }
  const formatOrigin = get(format, 'originValue');
  const formatTarget = get(format, 'targetValue');
  let result = formatOrigin ? moment(originValue, formatOrigin) : moment(originValue);
  if (isUTC) {
    result = result.utcOffset(0);
  }
  if (targetValue) {
    const options = {};
    attributes.forEach((attr) => {
      options[attr] = formatTarget ? moment(targetValue, formatTarget).get(attr) : moment(targetValue).get(attr);
    });
    result = result.set(options);
  }
  if (!isEmpty(add)) {
    const keys = Object.keys(add);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result = moment(result).add(add[key], `${key}`);
    }
  }
  if (!isEmpty(subtract)) {
    const keys = Object.keys(subtract);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      result = moment(result).subtract(subtract[key], `${key}`);
    }
  }
  return result;
}

/**
 * Get các thành phần của datetime: year, month, date, hour, minute, second, millisecond
 * @param {*} value Datetime cần lấy giá trị
 * @returns {Object} Object các thành phần
 */
export function getSeparateDateTime(value) {
  return ({
    year: moment(value).isValid() ? moment(value).get('year') : null,
    month: moment(value).isValid() ? moment(value).get('month') : null,
    date: moment(value).isValid() ? moment(value).get('date') : null,
    hour: moment(value).isValid() ? moment(value).get('hour') : null,
    minute: moment(value).isValid() ? moment(value).get('minute') : null,
    second: moment(value).isValid() ? moment(value).get('second') : null,
    millisecond: moment(value).isValid() ? moment(value).get('millisecond') : null
  });
}

/**
 * Trả về một object data được sử dụng cho props.disabledTime trong DatePickerRange
 * @param {Object} data Dữ liệu đầu vào
 * @param {Array} data.hours Danh sách các giờ sẽ disabled
 * @param {Array} data.minutes Danh sách các phút sẽ disabled
 * @param {Array} data.seconds Danh sách các giây sẽ disabled
 * @param {moment} data.beforeTime Thời gian trước điểm disabled
 * @param {moment} data.afterTime Thời gian sau điểm disabled
 * @returns {Object} data
 */
export function disableTimeData({
  hours = [],
  minutes = [],
  seconds = [],
  beforeDate = null,
  afterDate = null,
  current = null
}) {
  let rangeHours = hours;
  let rangeMinutes = minutes;
  const rangeSeconds = seconds;
  if (beforeDate && current) {
    const objectBeforeDate = getSeparateDateTime(beforeDate);
    rangeHours = [...rangeHours, ...range(DEFAULT_VALUE.START_HOUR, objectBeforeDate.hour - 1)];
    if (moment(current).get('hour') === objectBeforeDate.hour) {
      rangeMinutes = [
        ...rangeMinutes,
        ...range(DEFAULT_VALUE.START_MINUTE, objectBeforeDate.minute - 1)
      ];
    }
  }
  if (afterDate && current) {
    const objectAfterDate = getSeparateDateTime(afterDate);
    rangeHours = [...rangeHours, ...range(objectAfterDate.hour + 1, DEFAULT_VALUE.END_HOUR)];
    if (moment(current).get('hour') === objectAfterDate.hour) {
      rangeMinutes = [
        ...rangeMinutes,
        ...range(objectAfterDate.minute + 1, DEFAULT_VALUE.END_MINUTE)
      ];
    }
  }
  return {
    disabledHours: () => rangeHours,
    disabledMinutes: () => rangeMinutes,
    disabledSeconds: () => rangeSeconds
  };
}

/**
 * Kiểm tra value có phải là năm hợp lệ không
 * @param {*} value Giá trị cần kiểm tra
 * @returns {Boolean}
 */
export function isYear(value) {
  const newValue = Number(value);
  // Kiểm tra năm hợp lệ là số và DATE_LIMIT_VALUE.YEAR_MIN <= value <= DATE_LIMIT_VALUE.YEAR_MAX
  if (!isInteger(newValue) || newValue < DATE_LIMIT_VALUE.YEAR_MIN || newValue > DATE_LIMIT_VALUE.YEAR_MAX) {
    return false;
  }
  return true;
}

/**
 * Check a value is a valid datetime
 * @param {*} value
 * @param {Object} options a options which defines conditions to check the value
 * @param {String} options.format the format of the date value
 * @param {moment} options.before the before datetime
 * @param {moment} options.after the after datetime
 * @returns {Boolean} isValid
 * @static
 * @memberof Helpers
 */
export function isValidDateTime(value, options = {}) {
  if (value === undefined) {
    return false;
  }
  const defaultFormat = DATE_FORMAT.DATE;
  const format = get(options, 'format');
  const orOption = get(options, 'orOption', false);
  const isValid = format ? moment(value, format).isValid() : moment(value).isValid();
  if (!isValid) {
    return false;
  }
  let isValidSame = !orOption;
  let isValidBefore = !orOption;
  let isValidAfter = !orOption;
  const {
    same = {
      value: null,
      format: defaultFormat
    },
    before = {
      value: null,
      format: defaultFormat
    },
    after = {
      value: null,
      format: defaultFormat
    }
  } = options;
  if (same && same.value) {
    const format = same.format || defaultFormat;
    const sameDate = moment(same.value).format(format);
    const originDate = moment(value).format(format);
    isValidSame = moment(originDate, format).isSame(moment(sameDate, format));
  }
  if (before && before.value) {
    const format = before.format || defaultFormat;
    const beforeDate = moment(before.value).format(format);
    const originDate = moment(value).format(format);
    isValidBefore = moment(originDate, format).isBefore(moment(beforeDate, format));
  }
  if (after && after.value) {
    const format = after.format || defaultFormat;
    const afterDate = moment(after.value).format(format);
    const originDate = moment(value).format(format);
    isValidAfter = moment(originDate, format).isAfter(moment(afterDate, format));
  }
  if (orOption) {
    return isValidSame || isValidBefore || isValidAfter;
  }
  return isValidSame && isValidBefore && isValidAfter;
}

/**
 * Lấy giá trị timezone của client
 * @export
 * @returns {String}
 */
export function getLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Covert dữ liệu thời gian trước khi request lên API
 * @param {Object} thoiGian Thời gian ban đầu
 * @param {String} thoiGian.tuNgay Thời gian bắt đầu
 * @param {String} thoiGian.denNgay Thời gian kết thúc
 * @return {Object} Dữ liệu thời gian sau khi được convert
 * @memberof Helpers
 */
export function convertDateRequestAPI(thoiGian) {
  const setDateData = {
    format: { targetValue: 'HH:mm:ss' },
    attributes: ['hour', 'minute', 'second']
  };
  const tuNgay = getDateTime({
    value: setDate({ ...setDateData, originValue: get(thoiGian, 'tuNgay'), targetValue: '00:00:00' }),
    isUTC: true
  });
  const denNgay = getDateTime({
    value: setDate({ ...setDateData, originValue: get(thoiGian, 'denNgay'), targetValue: '23:59:59' }),
    isUTC: true
  });

  return {
    ...thoiGian,
    tuNgay,
    denNgay
  };
}
