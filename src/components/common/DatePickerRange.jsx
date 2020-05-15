import {
  Col,
  DatePicker,
  Row
} from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import {
  disableTimeData,
  getSeparateDateTime,
  isValidDateTime,
  setDate
} from 'helpers';
import {
  DATE_FORMAT,
  DEFAULT_VALUE
} from 'constants/variables';
import { colLayout, rowLayout } from 'constants/form';

export default class DatePickerRange extends Component {
  /**
   * Xác định start date không được chọn
   * @param {moment} startDate Start date đang được kiểm tra
   * @returns {Boolean} Có disabled date đang xét hay không
   * @memberof DatePickerRange
   */
  disabledStartDate = (startDate) => {
    if (this.props.disabledStartDate) {
      return this.props.disabledStartDate(startDate);
    }
    const endDate = this.props.value[this.props.fieldName.endDate];
    if (!startDate || !endDate) {
      return false;
    }
    let afterDate = endDate;
    const endHour = getSeparateDateTime(endDate).hour;
    if (endHour === DEFAULT_VALUE.START_HOUR) {
      afterDate = setDate({
        originValue: afterDate,
        subtract: { days: 1 }
      });
    }
    const isDisabled = isValidDateTime(startDate, {
      after: { value: afterDate }
    });
    return isDisabled;
  }

  /**
   * Xác định start date không được chọn
   * @param {moment} endDate End date đang được kiểm tra
   * @returns {Boolean} Có disabled date đang xét hay không
   * @memberof DatePickerRange
   */
  disabledEndDate = (endDate) => {
    if (this.props.disabledEndDate) {
      return this.props.disabledEndDate(endDate);
    }
    const startDate = this.props.value[this.props.fieldName.startDate];
    if (!endDate || !startDate) {
      return false;
    }
    let beforeDate = startDate;
    const startHour = getSeparateDateTime(startDate).hour;
    if (startHour === DEFAULT_VALUE.END_HOUR) {
      beforeDate = setDate({
        originValue: beforeDate,
        add: { days: 1 }
      });
    }
    const isDisabled = isValidDateTime(endDate, {
      before: { value: beforeDate }
    });
    return isDisabled;
  }

  /**
   * Xác định time của start date có được chọn hay không
   * @param {moment} startDate Start date đang được kiểm tra
   * @returns {Object} Định nghĩa data cho method disabledTime của DatePicker
   * @memberof DatePickerRange
   */
  disabledStartTime = (startDate) => {
    if (this.props.disabledStartTime) {
      return this.props.disabledStartTime(startDate);
    }
    const endDate = this.props.value[this.props.fieldName.endDate];
    const isSameDate = isValidDateTime(startDate, {
      same: { value: endDate }
    });
    if (isSameDate) {
      return disableTimeData({ afterDate: endDate, current: startDate });
    }
    return false;
  }

  /**
   * Xác định time của end date có được chọn hay không
   * @param {moment} endDate End date đang được kiểm tra
   * @returns {Object} Định nghĩa data cho method disabledTime của DatePicker
   * @memberof DatePickerRange
   */
  disabledEndTime = (endDate) => {
    if (this.props.disabledEndTime) {
      return this.props.disabledEndTime(endDate);
    }
    const startDate = this.props.value[this.props.fieldName.startDate];
    const isSameDate = isValidDateTime(endDate, {
      same: { value: startDate }
    });
    if (isSameDate) {
      return disableTimeData({ beforeDate: startDate, current: endDate });
    }
    return false;
  }

  /**
   * Xử lý khi thay đổi start date
   * @param {moment} startDate Giá trị start date được thay đổi
   * @returns {void}
   * @memberof DatePickerRange
   */
  onStartChange = (startDate) => {
    this.onChange(startDate, this.props.fieldName.startDate, this.props.fieldName.endDate);
  }

  /**
   * Xử lý khi thay đổi end date
   * @param {moment} endDate Giá trị end date được thay đổi
   * @returns {void}
   * @memberof DatePickerRange
   */
  onEndChange = (endDate) => {
    this.onChange(endDate, this.props.fieldName.endDate, this.props.fieldName.startDate);
  }

  /**
   * Xử lý khi thay đổi date
   * @param {moment} value Giá trị date được thay đổi
   * @param {String} originName Tên của date được thay đổi
   * @param {String} targetName Tên của date còn lại không được thay đổi
   * @returns {void} Gọi method props.onChange để cập nhật date
   * @memberof DatePickerRange
   */
  onChange = (value, originName, targetName) => {
    let newValue = value;
    const changedValue = { ...this.props.value };
    const targetValue = this.props.value[targetName];
    if (newValue && targetValue) {
      const isSameDate = isValidDateTime(newValue, {
        same: { value: targetValue }
      });
      const isDefaultTime = isValidDateTime(newValue, {
        same: {
          value: moment(DEFAULT_VALUE.START_TIME, DATE_FORMAT.TIME),
          format: DATE_FORMAT.TIME
        }
      });
      const setDateData = {
        targetValue,
        originValue: value,
        attributes: ['hour', 'minute', 'second']
      };
      if (isSameDate && isDefaultTime) {
        newValue = setDate(setDateData);
      }
    }
    changedValue[originName] = newValue || undefined;
    this.props.onChange(changedValue);
  }

  render() {
    return (
      <Row {...rowLayout}>
        <Col {...colLayout.half}>
          <DatePicker
            className={this.props.className}
            disabled={this.props.disabled}
            disabledDate={this.disabledStartDate}
            disabledTime={this.disabledStartTime}
            format={this.props.format}
            onChange={this.onStartChange}
            placeholder={this.props.placeholder.startDate}
            showTime={this.props.showTime}
            showToday={false}
            style={{ width: '100%', minWidth: 'auto' }}
            suffixIcon={<span className="icon-calendar-fill" />}
            value={this.props.value[this.props.fieldName.startDate]}
          />
        </Col>
        <Col {...colLayout.half}>
          <DatePicker
            className={`${this.props.className} last-child-date`}
            disabled={this.props.disabled}
            disabledDate={this.disabledEndDate}
            disabledTime={this.disabledEndTime}
            format={this.props.format}
            onChange={this.onEndChange}
            placeholder={this.props.placeholder.endDate}
            showTime={this.props.showTime}
            showToday={false}
            style={{ width: '100%', minWidth: 'auto' }}
            suffixIcon={<span className="icon-calendar-fill" />}
            value={this.props.value[this.props.fieldName.endDate]}
          />
        </Col>
      </Row>
    );
  }
}

DatePickerRange.propTypes = {
  disabled: PropTypes.bool,
  fieldName: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  value: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string
  }),
  showTime: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      defaultValue: PropTypes.any,
      format: PropTypes.string
    })
  ]),
  disabledStartDate: PropTypes.func,
  disabledEndDate: PropTypes.func,
  disabledStartTime: PropTypes.func,
  disabledEndTime: PropTypes.func
};

DatePickerRange.defaultProps = {
  disabled: false,
  fieldName: {
    startDate: 'tuNgay',
    endDate: 'denNgay'
  },
  value: {},
  className: '',
  format: DATE_FORMAT.DATETIME,
  placeholder: {
    startDate: 'Từ ngày',
    endDate: 'Đến ngày'
  },
  showTime: {
    defaultValue: moment(DEFAULT_VALUE.START_TIME, DATE_FORMAT.TIME),
    format: DATE_FORMAT.TIME
  },
  disabledStartDate: null,
  disabledEndDate: null,
  disabledStartTime: null,
  disabledEndTime: null
};
