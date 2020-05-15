import React, { PureComponent } from 'react';
import { DatePicker as DatePickAnt } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  disableTimeData,
  getDateTime,
  isValidDateTime
} from 'helpers';
import {
  get,
  isEmpty,
  isFunction
} from 'lodash';
import {
  DATE_FORMAT
} from 'constants/variables';

export default class DatePicker extends PureComponent {
  /**
   * Xác định date không được chọn
   * @param {moment} date Date đang kiểm tra
   * @returns {Boolean} Có disabled date đang xét hay không
   * @memberof DatePicker
   */
  disabledDate = (date) => {
    const {
      disabledDate,
      disabledDateData
    } = this.props;
    if (isFunction(disabledDate)) {
      return disabledDate(date);
    }
    let isAfter = false;
    let isBefore = false;
    // disabled tất cả ngày > disabledDateData.after
    const afterDate = get(disabledDateData, 'after');
    if (isValidDateTime(afterDate)) {
      const afterParam = {
        after: {
          value: afterDate,
          format: DATE_FORMAT.DATE
        }
      };
      isAfter = isValidDateTime(date, afterParam);
    }
    const beforeDate = get(disabledDateData, 'before');
    // disabled tất cả ngày < disabledDateData.before
    if (isValidDateTime(beforeDate)) {
      const beforeParam = {
        before: {
          value: beforeDate,
          format: DATE_FORMAT.DATE
        }
      };
      isBefore = isValidDateTime(date, beforeParam);
    }
    return isAfter || isBefore;
  };

  /**
   * Xác định time của date có được chọn hay không
   * @param {moment} date Date đang kiểm tra
   * @returns {Object} Định nghĩa data cho method disabledTime của DatePicker
   * @memberof DatePicker
   */
  disabledTime = (date) => {
    const {
      disabledTime,
      disabledDateData
    } = this.props;
    if (isFunction(disabledTime)) {
      return disabledTime(date);
    }
    // disabled tất cả time có time > disabledDateData.after
    const afterDate = get(disabledDateData, 'after');
    if (isValidDateTime(afterDate)) {
      const isSameDate = isValidDateTime(date, {
        same: { value: afterDate }
      });
      if (isSameDate) {
        return disableTimeData({ afterDate, current: date });
      }
    }
    const beforeDate = get(disabledDateData, 'before');
    // disabled tất cả time có time < disabledDateData.before
    if (isValidDateTime(beforeDate)) {
      const isSameDate = isValidDateTime(date, {
        same: { value: beforeDate }
      });
      if (isSameDate) {
        return disableTimeData({ beforeDate, current: date });
      }
    }
    // default: enable tất cả time
    return false;
  };

  /**
   * Xử lý khi thay đổi date
   * @param {moment} value Giá trị date được thay đổi
   * @returns {void} Gọi method props.onChange để cập nhật date
   * @memberof DatePicker
   */
  handleChange = (value) => {
    if (!isFunction(this.props.onChange)) {
      return false;
    }
    let newValue = value;
    const afterDate = get(this.props.disabledDateData, 'after');
    const beforeDate = get(this.props.disabledDateData, 'before');
    if (!isEmpty(newValue) && !isEmpty(afterDate)) {
      // kiểm tra value trùng ngày với afterDate
      const isSameDate = isValidDateTime(newValue, {
        same: { value: afterDate }
      });
      // kiểm tra giờ của value lớn hơn giờ của afterDate
      const isGreaterThanAfterTime = isValidDateTime(newValue, {
        after: { value: afterDate, format: DATE_FORMAT.TIME }
      });
      if (isSameDate && isGreaterThanAfterTime) {
        newValue = getDateTime({ value: afterDate, isString: false }) || undefined;
      }
      return this.props.onChange(newValue);
    }
    if (!isEmpty(newValue) && !isEmpty(beforeDate)) {
      // kiểm tra value trùng ngày với beforeDate
      const isSameDate = isValidDateTime(newValue, {
        same: { value: beforeDate }
      });
      // kiểm tra giờ của value nhỏ hơn giờ của beforeDate
      const isSmallerThanBeforeTime = isValidDateTime(newValue, {
        before: { value: beforeDate, format: DATE_FORMAT.TIME }
      });
      if (isSameDate && isSmallerThanBeforeTime) {
        newValue = getDateTime({ value: beforeDate, isString: false }) || undefined;
      }
    }
    return this.props.onChange(newValue);
  }

  render() {
    return (
      <DatePickAnt
        className={this.props.className}
        disabled={this.props.disabled}
        disabledDate={this.disabledDate}
        disabledTime={this.disabledTime}
        format={this.props.format}
        name={this.props.name}
        onBlur={this.props.onBlur}
        onChange={this.handleChange}
        placeholder={this.props.placeholder}
        showTime={this.props.showTime}
        showToday={this.props.showToday}
        style={{ width: '100%' }}
        suffixIcon={<span className="icon-date" />}
        value={this.props.value}
      />
    );
  }
}

DatePicker.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  disabledDate: PropTypes.func,
  disabledTime: PropTypes.func,
  format: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  showTime: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool
  ]),
  showToday: PropTypes.bool,
  disabledDateData: PropTypes.shape({
    before: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string
    ]),
    after: PropTypes.oneOfType([
      PropTypes.instanceOf(moment),
      PropTypes.string
    ])
  }),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.string
  ])
};

DatePicker.defaultProps = {
  className: '',
  disabled: false,
  disabledDate: null,
  disabledTime: null,
  format: 'HH:mm DD/MM/YYYY',
  name: '',
  onBlur: null,
  onChange: null,
  placeholder: '',
  showTime: {
    defaultValue: moment('00:00', 'HH:mm'),
    format: 'HH:mm'
  },
  showToday: false,
  disabledDateData: {
    before: null,
    after: null
  }
};
