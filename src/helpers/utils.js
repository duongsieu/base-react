/* -------- Helper functions chung -------- */
import React from 'react';
import {
  compact,
  get,
  isArray,
  isEmpty,
  isFunction,
  isObject,
  isString,
  pick
} from 'lodash';
import { camelize, decamelizeKeys } from 'humps';
import classnames from 'classnames';
import {
  Notification
} from 'components/common';
import messages from 'constants/messages';
import {
  DEFAULT_VALUE,
  HOME_ROUTE,
  RECAPTCHA_FIELD_NAME,
  STATUS_API,
  TYPE_SYSTEM as TYPE_SYSTEM_VAR
} from 'constants/variables';
import {
  parseURL
} from 'helpers/string';
import { TYPE_SYSTEM } from 'constants/api';

const canceledKeys = [];

/**
 * Tạo key cho API
 * @export
 * @returns {String} Key của một API
 */
export function generateKeyAPI() {
  const key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  if (canceledKeys.filter(item => item.key === key).length > 0) {
    return generateKeyAPI();
  }
  canceledKeys.push(key);
  return key;
}

/**
 * Throw error
 * @export
 * @returns {void}
 */
export function throwError(error, isJson = false) {
  if (isJson) {
    throw new Error(JSON.stringify(error));
  }
  if (isString(error)) {
    throw new Error(error);
  }
  throw (error);
}

/**
 * Thông báo error message
 * @export
 * @param {String} message message
 * @returns {void}
 */
export function alertError(message = '') {
  Notification({
    type: 'error',
    className: 'notifi-error',
    message: messages.NOTIFICATION_TITLE,
    description: message
  });
}

/**
 * Thông báo message
 * @export
 * @param {String} message message
 * @returns {void}
 */
export function alertSuccess(message = '') {
  Notification({
    type: 'success',
    className: 'notifi-success',
    message: messages.NOTIFICATION_TITLE,
    description: message
  });
}

/**
 * Thông báo warning message
 * @export
 * @param {String} message message
 * @returns {void}
 */
export function alertWarning(message = '') {
  Notification({
    type: 'warning',
    className: 'notifi-warning',
    message: messages.NOTIFICATION_TITLE,
    description: message
  });
}

/**
 * Chuyển đổi giá trị về array, nếu không phải là array thì trả rỗng
 * @param {*} value Giá trị cần chuyển đổi
 * @returns {Array}
 */
export function getArray(value) {
  if (isArray(value)) {
    return [...value];
  }
  return [];
}

/**
 * Lấy độ dài của một mảng hoặc một chuỗi
 * @export
 * @param {String|Array.<*>} value giá trị cần lấy độ dài
 * @returns {Number} độ dài của giá trị
 */
export function getLength(value) {
  if (isString(value) || isArray(value)) {
    return value.length;
  }
  return 0;
}

/**
 * Tìm kiếm object trong mảng theo cặp key - value
 * @export
 * @param {Object} data Dữ liệu đầu vào
 * @param {Array.<Object>} [data.source=[]] Mảng cần tìm
 * @param {String} [data.key='id'] Key của object
 * @param {*} [data.value=''] Giá trị tương úng với key
 * @param {Boolean} [data.searchElement=false] Nếu true, trả về cả object, ngược lại chỉ trả về vị trí tìm được
 * @returns {Object|Number|Null} Kết quả tìm được (object hoặc vị trí của object)
 */
export function findObjectInArray({
  source = [],
  key = 'id',
  value = '',
  searchElement = false
}) {
  const elementPos = source.map(item => get(item, key)).indexOf(value);
  if (searchElement) {
    if (elementPos > -1) {
      return source[elementPos];
    }
    return null;
  }
  return elementPos;
}

/**
 * Reload page
 * @export
 * @param {Object} history
 * @param {String} [path=HOME_ROUTE]
 * @returns {void}
 */
export function reloadPage(history, path = HOME_ROUTE) {
  const currentPath = get(history, 'location.pathname');
  if (currentPath === path) {
    window.location.href = path;
  } else {
    history.replace(path);
  }
}

/**
 * Kiểm tra điều kiện có hợp lệ không
 * @export
 * @param {Object} data Dữ liệu đầu vào
 * @param {Object[]} [data.conditions=[]] Danh sách điều kiện
 * @param {String} data.conditions[].operator Phép so sánh
 * @param {String} data.conditions[].originValueName Tên trường ban đầu được dùng so sánh
 * @param {*} data.conditions[].originValue Giá trị của trường ban đầu được dùng so sánh
 * @param {String} data.conditions[].targetValueName Tên trường dùng để so sánh với trường ban đầu
 * @param {*} data.conditions[].targetValue Giá trị trường dùng để so sánh với trường ban đầu
 * @param {Object} data.record Record được áp dụng
 * @param {String[]} data.userPermission Danh sách quyền của user hiện tại
 * @param {Boolean} data.isOrConditions Điều kiện là "hoặc" hay không
 * @returns {Boolean} result
 */
export function isValidCondition({
  conditions = [],
  record = {},
  userPermission = [],
  isOrConditions = false
}) {
  let result = true;
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return result;
  }
  for (let i = 0; i < conditions.length; i += 1) {
    const condition = conditions[i];
    const isValidPermission = true;
    // check isValid permission
    if (!isValidPermission && !isOrConditions) {
      result = false;
      return result;
    }
    // case: nested conditions
    if (!isEmpty(get(condition, 'conditions'))) {
      result = isValidCondition({
        record,
        conditions: get(condition, 'conditions'),
        userPermission,
        isOrConditions: get(condition, 'isOrConditions')
      });
    } else {
      let { targetValue, originValue } = condition;
      const { operator = '=' } = condition;
      if ('targetValueName' in condition
        && get(record, condition.targetValueName) !== undefined
      ) {
        targetValue = get(record, condition.targetValueName);
      }
      if ('originValueName' in condition
        && get(record, condition.originValueName) !== undefined
      ) {
        originValue = get(record, condition.originValueName);
      }
      if (isOrConditions) {
        // check case isOrConditions = true
        result = false;
        switch (operator) {
          case '>':
            if (originValue > targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '>=':
            if (originValue >= targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '<':
            if (originValue < targetValue && isValidPermission) {
              result = true;
            }
            break;
          case '<=':
            if (originValue <= targetValue && isValidPermission) {
              result = true;
            }
            break;
          case 'in':
            if (isArray(targetValue) && targetValue.indexOf(originValue) > -1 && isValidPermission) {
              result = true;
            }
            break;
          case 'notIn':
            if (isArray(targetValue) && targetValue.indexOf(originValue) === -1 && isValidPermission) {
              result = true;
            }
            break;
          case '<>':
            if (originValue !== targetValue && isValidPermission) {
              result = true;
            }
            break;
          case 'empty':
            if ((isObject(originValue) || isArray(originValue)) && isEmpty(originValue) && isValidPermission) {
              result = true;
            }
            if (!isObject(originValue) && !isArray(originValue) && !originValue && isValidPermission) {
              result = true;
            }
            break;
          case 'notEmpty':
            if ((isObject(originValue) || isArray(originValue)) && !isEmpty(originValue) && isValidPermission) {
              result = true;
            }
            if (!isObject(originValue) && !isArray(originValue) && originValue && isValidPermission) {
              result = true;
            }
            break;
          default:
            // operator = "="
            if (originValue === targetValue && isValidPermission) {
              result = true;
            }
        }
      } else {
        // check case isOrConditions = false
        result = true;
        switch (operator) {
          case '>':
            if (originValue <= targetValue) {
              result = false;
            }
            break;
          case '>=':
            if (originValue < targetValue) {
              result = false;
            }
            break;
          case '<':
            if (originValue >= targetValue) {
              result = false;
            }
            break;
          case '<=':
            if (originValue > targetValue) {
              result = false;
            }
            break;
          case 'in':
            if (!isArray(targetValue) || targetValue.indexOf(originValue) === -1) {
              result = false;
            }
            break;
          case 'notIn':
            if (!isArray(targetValue) || targetValue.indexOf(originValue) > -1) {
              result = false;
            }
            break;
          case '<>':
            if (originValue === targetValue) {
              result = false;
            }
            break;
          case 'empty':
            if ((isObject(originValue) || isArray(originValue)) && !isEmpty(originValue)) {
              result = false;
            }
            if (!isObject(originValue) && !isArray(originValue) && originValue) {
              result = false;
            }
            break;
          case 'notEmpty':
            if ((isObject(originValue) || isArray(originValue)) && isEmpty(originValue)) {
              result = false;
            }
            if (!isObject(originValue) && !isArray(originValue) && !originValue) {
              result = false;
            }
            break;
          default:
            // operator = "="
            if (originValue !== targetValue) {
              result = false;
            }
        }
      }
    }
    if ((isOrConditions && result) || (!isOrConditions && !result)) {
      break;
    }
  }
  return result;
}

/**
 * Convert error object
 * @export
 * @param {Object} error Error ban đầu
 * @param {*} error.data Data trong error
 * @param {String} error.message Message trong error
 * @param {Number} error.status Status trong error
 * @returns {Object} result
 */
export function convertErrorObject(error = {}) {
  let result = error;
  result = {
    ...result,
    data: result.data || error.message,
    status: result.status || 0
  };
  return result;
}

/**
 * Set errors cho một form, sử dụng response từ API
 * @export
 * @param {Object} data Dữ liệu đầu vào
 * @param {objct} data.error Error object
 * @param {Function} data.getFieldValue Method getFieldValue của form
 * @param {Function} data.setFields Method setFields của form
 * @return {void}
 */
export function setFormErrorsFromAPI({
  error = {},
  getFieldValue = null,
  setFields = null
}) {
  const errorResult = convertErrorObject(error);
  const { status = null, data = {} } = errorResult;
  const { errors = [] } = data;
  if (!status || !getFieldValue || !setFields) {
    return;
  }
  switch (status) {
    case STATUS_API.ERROR_VALIDATION:
      errors.forEach((error) => {
        const fieldName = camelize(error.fieldName);
        setFields({
          [fieldName]: {
            value: getFieldValue(fieldName),
            errors: [new Error(error.messageError)]
          }
        });
      });
      break;
    default:
  }
}

/**
 * Convert response từ API
 * @export
 * @param {Object} res Response
 * @param {Object} [option={}] Thông tin thêm
 * @param {Object} option.path Thông tin path cho từng giá trị
 * @param {String} [option.path.content='payload.content'] Thông tin path cho content
 * @param {String} [option.path.pageNumber='payload.pageNumber'] Thông tin path cho pageNumber
 * @param {String} [option.path.pageSize='payload.pageSize'] Thông tin path cho pageSize
 * @param {String} [option.path.totalElements='payload.totalElements'] Thông tin path cho totalElements
 * @param {String} [option.path.totalPages='payload.totalPages'] Thông tin path cho totalPages
 * @returns {Object} Data
 */
export function convertResponseAPI(res, option = {}) {
  const pathContent = get(option, 'path.content', 'payload.content');
  const pathPageNumber = get(option, 'path.pageNumber', 'payload.pageNumber');
  const pathPageSize = get(option, 'path.pageSize', 'payload.pageSize');
  const pathTotalElements = get(option, 'path.totalElements', 'payload.totalElements');
  const pathTotalPages = get(option, 'path.totalPages', 'payload.totalPages');
  const data = {
    // danh sách records
    list: get(res, pathContent) || [],
    // page hiện tại = pageNumber + 1
    page: (get(res, pathPageNumber) || 0) + 1,
    // page size
    pageSize: get(res, pathPageSize) || 10,
    // tổng số records trong DB
    totalElements: get(res, pathTotalElements) || 0,
    // tổng số pages
    totalPages: get(res, pathTotalPages) || 1
  };
  return data;
}

/**
 * Convert params cho phân trang trước khi request
 * @export
 * @param {Object} params Params sử dụng để request API
 * @param {Boolean} [keepPage=false] Giữ lại page hiện tại
 * @returns {Object} Params sau khi được convert
 */
export function convertRequestPagination(params, keepPage = false) {
  const page = get(params, 'page') || DEFAULT_VALUE.PAGE;
  const size = get(params, 'size') || DEFAULT_VALUE.PAGE_SIZE;
  // Giữ lại page hiện tại [keepPage = true]
  const pageFromZero = keepPage ? page : page - 1;
  return {
    ...params,
    size,
    page: pageFromZero
  };
}

/**
 * Tạo một object mới từ một object đã có với các properties cụ thể
 * @export
 * @param {Object} data Dữ liệu đầu vào
 * @param {Object} data.originObject Object đã có
 * @param {Object} data.targetObject Object mới, sử dụng các properties của object này
 * @param {array} data.pickedProperties Hoặc sử dụng các properties trong pickedProperties
 */
export function createPickedObject({
  originObject = {},
  targetObject = {},
  pickedProperties = null
}) {
  let keys = [];
  if (isArray(pickedProperties) && !isEmpty(pickedProperties)) {
    keys = pickedProperties;
  } else if (!isEmpty(targetObject)) {
    keys = Object.keys(targetObject);
  }
  const result = pick(originObject, keys);
  return result;
}

/**
 * Lọc các columns của một table theo điều kiện tương ứng
 * @export
 * @param {Array.<Object>} [columns=[]] Danh sách các columns
 * @param {Array.<String>} [userPermission=[]] Danh sách quyền của user hiện tại
 * @param {String} [childAtrr='children'] Tên field children
 * @returns {Array.<Object>} Danh sách columns đã được lọc theo điều kiện
 */
export function parseColumnsTable(columns = [], userPermission = [], childAtrr = 'children') {
  const result = [];
  columns.forEach((column) => {
    const newColumn = { ...column };
    if (!isEmpty(get(newColumn, childAtrr))) {
      const children = parseColumnsTable(getArray(newColumn[childAtrr]), userPermission, childAtrr);
      newColumn[childAtrr] = children;
    }
    if (isValidCondition({
      userPermission,
      conditions: newColumn.conditions,
      isOrConditions: newColumn.isOrConditions
    })) {
      result.push(newColumn);
    }
  });
  return result;
}

/**
 * Thực hiện với error messages
 * @export
 * @param {Object} data Dữ liệu đầu vào
 * @param {Object} [data.error={}] Error
 * @param {Function} [data.func=null] Function sẽ được sử dụng
 * @param {Number} [data.count=1] Số lần thực hiện
 * @param {String} [data.errorFieldName='messageError'] Tên field error
 * @param {String} [data.defaultError='Error'] Error message mặc định
 * @return {void}
 */
export function workWithErrorMessages({
  error = {},
  func = null,
  count = 1,
  errorFieldName = 'messageError',
  defaultError = 'Error'
}) {
  const errorResult = convertErrorObject(error);
  const { status = null, data = {} } = errorResult;
  const { errors = [] } = data;
  const messages = errors.map(item => item[errorFieldName]);
  const num = Math.min(count, messages.length);
  if (!isFunction(func)) {
    return;
  }
  switch (status) {
    case STATUS_API.ERROR_VALIDATION:
      if (num === 0) {
        alertError(defaultError);
      }
      for (let i = 0; i < num; i += 1) {
        func(messages[i]);
      }
      break;

    default:
      alertError(defaultError);
  }
}

/**
 * Tạo một range bắt đầu từ start đến end
 * @export
 * @param {Number} start Start value
 * @param {Number} end End value
 * @returns {Array.<Number>} Range
 */
export function range(start, end) {
  const result = [];
  for (let i = start; i <= end; i += 1) {
    result.push(i);
  }
  return result;
}

/**
 * Get tất cả keys của object từ giá trị cha tới giá trị con theo child value (tính cả giá trị cha)
 * @export
 * @param {*} obj Object cần lấy path
 * @param {*} value Giá trị cha
 * @returns {Array.<String>} Danh sách các keys object
 */
export function getPath(obj, value) {
  if (!isObject(obj) || !value) {
    throw new TypeError('getPath() can only operate on object with Object as constructor');
  }
  const path = [];
  let found = false;

  function search(obj) {
    const objKeys = Object.keys(obj);
    for (let i = 0; i <= objKeys.length; i += 1) {
      const key = objKeys[i];
      path.push(key);
      if (key === value || obj[key] === value) {
        found = true;
        break;
      }
      if (isObject(obj[key])) {
        search(obj[key]);
        if (found) break;
      }
      path.pop();
    }
  }
  search(obj);
  return path;
}

/**
 * Get data con trong object theo giá trị cha (không tính giá trị cha)
 * @export
 * @param {*} obj Object cần lấy giá trị
 * @param {*} value Giá trị cha
 * @returns
 */
export function getChildObject(obj, value) {
  if (isEmpty(obj) || !isObject(obj) || !value) {
    return [];
  }
  // get object with key is value
  const pathValueString = getPath(obj, value).join('.');
  const rootObj = get(obj, pathValueString);
  const getAllChild = (obj) => {
    const keys = Object.keys(obj);
    let result = [];
    for (let i = 0; i <= keys.length; i += 1) {
      const key = keys[i];
      const children = obj[key];
      if (isString(children)) {
        result = [...result, children];
      }
      if (isObject(children)) {
        result = [...result, key, ...getAllChild(children, value)];
      }
    }
    return result;
  };
  const result = getAllChild(rootObj);
  return compact(result);
}

/**
 * Kiểm tra response về có lỗi không
 * @export
 * @param {*} response Response từ API
 * @returns {Boolean}
 */
export function hasErrorResponseAPI(response) {
  const error = get(response, 'error');
  const payload = get(response, 'payload');
  const status = get(response, 'origin.status');
  if (STATUS_API.SUCCESS_LIST.includes(status)) {
    return false;
  }
  if (!isEmpty(error) || isEmpty(payload)) {
    return true;
  }
  return false;
}

/**
 * Convert array: thêm data vào đầu, cuối hoặc một vị trí cụ thể
 * @export
 * @param {Array} [origin=[]] Mảng ban đầu
 * @param {Object} {
 *     @param {Array} [firstImp=[]] Mảng sẽ được thêm vào đầu origin
 *     @param {Array} [lastImp=[]] Mảng sẽ được thêm vào cuối origin
 *     @param {Object} customImp {
 *       @param {Number} [index=1] Index của mảng custom sẽ được thêm vào origin
 *       @param {Array} [data=[]] Mảng sẽ được thêm vào vị trí [index] origin
 *     }
 *   }
 * @returns
 */
export function convertArray(
  origin = [],
  options = {
    firstImp: [],
    lastImp: [],
    customImp: {
      index: undefined,
      data: []
    }
  }
) {
  let result = [...origin];
  const { firstImp, lastImp, customImp = {} } = options;
  if (isArray(firstImp)) {
    result = [...firstImp, ...result];
  }
  if (isArray(lastImp)) {
    result = [...result, ...lastImp];
  }
  if (get(customImp, 'index') !== undefined && isArray(get(customImp, 'data'))) {
    result = result.splice(customImp.index, 0, ...customImp.data);
  }
  return result;
}

/**
 * Lấy giá trị theo một property của tất cả items trong một mảng
 * @export
 * @param {Array.<Object>} [source=[]] Mảng ban đầu
 * @param {String} [property='id'] Tên property được lấy trong mỗi item
 * @param {Object} options Thông tin thêm
 * @param {Function} [options.convertFunc=null] Convert function áp dụng sau khi lấy property của các items
 * @param {Array} [options.defaultValue=null] Convert function áp dụng sau khi lấy property của các items
 */
export function getPropertyArray(
  source = [],
  property = 'id',
  options = {
    convertFunc: null,
    defaultValue: []
  }
) {
  const { convertFunc, defaultValue } = options;
  if (!isArray(source) || isEmpty(source)) {
    return defaultValue;
  }
  const values = compact(source.map(item => get(item, property)));
  if (!isFunction(options.convertFunc)) {
    return values;
  }
  return convertFunc(values);
}

/**
 * Chuyển đổi một giá trị sang undefined nếu thuộc [null, '']
 * @export
 * @param {*} value
 * @returns {*|undefined}
 */
export function convertToUndeFined(value) {
  const mustBeConvertValues = [null, ''];
  if (mustBeConvertValues.includes(value)) {
    return undefined;
  }
  return value;
}

/**
 * Chuyển đổi data filter
 * @export
 * @param {*} data Giá trị ban đầu
 * @param {Boolean} [isSnakeCase=false] Có chuyển đổi sang snake case không
 * @returns {*} Giá trị mới với các giá trị null, '' sẽ được chuyển sang undefined
 */
export function convertDataFilter(data, isSnakeCase = false) {
  let newData = data;
  if (isSnakeCase) {
    newData = decamelizeKeys(data);
  }
  if (isObject(newData)) {
    const result = { ...newData };
    const keys = Object.keys(newData);
    keys.forEach((key) => {
      result[key] = convertToUndeFined(newData[key]);
    });
    return result;
  }
  if (isArray(newData)) {
    const result = newData.map(item => convertToUndeFined(item));
    return result;
  }
  return convertToUndeFined(newData);
}

/**
 * Flat array
 * @export
 * @param {Array.<Object>} data Dữ liệu cần flatten
 * @param {String} [childAtrr='children'] Tên field children
 * @param {String|Null} [parentAtrr=null] Tên field parent
 * @param {Object|Null} [parentValue=null] Giá trị parent
 * @returns {Array}
 */
export function flatten(data, childAtrr = 'children', parentAtrr = null, parentValue = null) {
  let result = [];
  const newData = [...data];
  newData.forEach((item) => {
    const newItem = { ...item || {} };
    let parentItem = null;
    if (!isEmpty(parentAtrr)) {
      newItem[parentAtrr] = parentValue;
      parentItem = { ...newItem };
    }
    result = [...result, newItem];
    if (isArray(get(newItem, childAtrr))) {
      result = [...result, ...flatten(newItem[childAtrr], childAtrr, parentAtrr, parentItem)];
    }
  });
  return result;
}

/**
 * Lấy tất cả các giá trị theo path trong nested object
 * @export
 * @param {Array.<Object>} data Mảng gồm các object
 * @param {String} [path='id'] Key sẽ được lấy giá trị
 * @param {String} [childrenFieldName='chidren'] Tên trường children
 * @returns {Array} Mảng gồm các giá trị
 */
export function getValuesNestedObject(data, path = 'id', childrenFieldName = 'chidren') {
  if (!isArray(data) || isEmpty(data)) {
    return [];
  }
  const getChildren = obj => get(obj, childrenFieldName);
  let result = [];
  data.forEach((item) => {
    result = [
      ...result,
      get(item, path),
      ...getValuesNestedObject(getChildren(item))
    ];
  });
  return compact(result);
}

/**
 * Kiểm tra giá trị có phải là URL hay không
 * @export
 * @param {*} str Chuỗi cần kiểm tra
 * @returns {Boolean}
 */
export function validURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
}

/**
 * Điều hướng tới một đường dẫn
 * @export
 * @param {*} path Đường dẫn sẽ đi đến
 * @param {Object} [queryParams=null] Query params
 * @param {Object} options Thông tin thêm
 * @param {String} options.name Giá trị name cho method window.open
 * @param {String} options.specs Giá trị specs cho method window.open
 * @param {String} options.specs Giá trị specs cho method window.open
 * @param {String} options.replace Giá trị replace cho method window.open
 * @param {Boolean} options.shouldReturnWindow Có return window không
 * @returns
 */
export function redirectTo(path, queryParams = null, options = {}) {
  if (!validURL(path)) {
    return false;
  }
  const redirectPath = parseURL(path, { queryParams });
  // Thuộc tính "name" cho window.open
  const name = get(options, 'name');
  // Thuộc tính "specs" cho window.open
  const specs = get(options, 'specs');
  // Thuộc tính "replace" cho window.open
  const replace = get(options, 'replace');
  // Thuộc tính kiểm tra có trả về window đã open không
  const shouldReturnWindow = get(options, 'shouldReturnWindow', false);
  const newWindow = window.open(redirectPath, name, specs, replace);
  // Trả về window đã open
  if (shouldReturnWindow) {
    return newWindow;
  }
  return true;
}

/**
 * Xác định hệ thống có phải là loại độc lập không
 * - Loại độc lập sẽ tách rời với nghiệp vụ trong hệ thống các ứng dụng
 * - Loại phụ thuộc sẽ gộp chung với nghiệp vụ của một ứng dụng khác
 * @returns {Boolean}
 * @export
 * @returns
 */
export function isInDependentSystem() {
  return TYPE_SYSTEM === TYPE_SYSTEM_VAR.INDEPENDENT;
}

/**
 * Kiểm tra reCAPTCHA hợp lệ
 * @export
 * @param {Object} rule Rule của form
 * @param {String} data Giá trị cần kiểm tra
 * @param {Function} callback Callback function của form
 * @returns
 */
export function validateReCAPTCHA(rule, data, callback) {
  const loaded = get(data, RECAPTCHA_FIELD_NAME.LOADED);
  const value = get(data, RECAPTCHA_FIELD_NAME.VALUE);
  const expired = get(data, RECAPTCHA_FIELD_NAME.EXPIRED);
  // Kiểm tra điều kiện hợp lệ cho reCAPTCHA
  // Đã load + có tồn tại reCAPTCHA value + chưa hết hạn
  if (loaded && value && !expired) {
    return callback();
  }
  return callback(get(rule, 'message'));
}

/**
 * Lấy giá trị của các keys trong một object và trả về dạng object
 * @export
 * @param {Object} data Dữ liệu ban đầu
 * @param {Array.<String>} keys Danh sách keys cần lấy từ data
 * @returns {Object}
 */
export function getMultiple(data, keys) {
  if ((isEmpty(data) || !isObject(data)) || !isArray(keys)) {
    return {};
  }
  return pick(data, keys);
}

/**
 * Trả ra element với scroll box
 * @param {String} text Nội dung trong scrollbox
 * @param {Number} [lengthForScroll=100] Độ dài hiển thị scroll
 * @returns {JSX.Element}
 */
export function wrapperScrollbox(text, lengthForScroll = 110) {
  if (!text) {
    return null;
  }
  return (
    <div className="scrollbox scrollbox-delayed">
      <p
        className={classnames('text-left scrollbox-content', {
          large: getLength(text) > lengthForScroll
        })}
      >
        {text}
      </p>
    </div>
  );
}
