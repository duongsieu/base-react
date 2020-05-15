import React from 'react';
import {
  Col,
  DatePicker,
  Row
} from 'antd';
import PropTypes from 'prop-types';
import {
  getDateTime,
  isValidDateTime,
  isYear
} from 'helpers';
import {
  get,
  isFunction
} from 'lodash';
import { DATE_FORMAT } from 'constants/variables';
import { colLayout, rowLayout } from 'constants/form';

class YearPickerRange extends React.Component {
  state = {
    startOpen: false,
    endOpen: false
  };

  /**
   * Xử lý khi giá trị trên input thay đổi
   * @param {moment} value Giá trị start year
   * @returns {void} Cập nhật state và gọi triggerChange
   * @memberof YearPickerRange
   */
  handleStartChange = (value) => {
    const startFieldName = get(this.props.fieldName, 'start');
    const endFieldName = get(this.props.fieldName, 'end');
    const year = value ? value.format('YYYY') : null;
    const isValid = isYear(year);
    const startValue = isValid ? getDateTime({
      value,
      format: DATE_FORMAT.YEAR,
      formatUTC: DATE_FORMAT.YEAR,
      isString: false
    }) : null;
    let endValue = get(this.props.value, `${endFieldName}`);
    /*
    // Kiểm tra endValue có lớn hơn hoặc bằng startValue không
    const isAfterEndValue = isValidDateTime(endValue, {
      orOption: true,
      after: {
        value: startValue,
        format: DATE_FORMAT.YEAR
      },
      same: {
        value: startValue,
        format: DATE_FORMAT.YEAR
      }
    });
     */
    if (value !== null && !isValidDateTime(endValue)) {
      endValue = null;
    }
    const changedValue = {
      [startFieldName]: startValue,
      [endFieldName]: endValue
    };
    this.triggerChange(changedValue);
  };

  /**
   * Xử lý khi giá trị trên input thay đổi
   * @param {moment} value Giá trị end year
   * @returns {void} Cập nhật state và gọi triggerChange
   * @memberof YearPickerRange
   */
  handleEndChange = (value) => {
    const startFieldName = get(this.props.fieldName, 'start');
    const endFieldName = get(this.props.fieldName, 'end');
    const year = value ? value.format('YYYY') : null;
    const isValid = isYear(year);
    const endValue = isValid ? getDateTime({
      value,
      format: DATE_FORMAT.YEAR,
      formatUTC: DATE_FORMAT.YEAR,
      isString: false
    }) : null;
    let startValue = get(this.props.value, `${startFieldName}`);
    /*
    // Kiểm tra startValue có nhỏ hơn hoặc bằng endValue không
    const isBeforeStartValue = isValidDateTime(startValue, {
      orOption: true,
      before: {
        value: endValue,
        format: DATE_FORMAT.YEAR
      },
      same: {
        value: endValue,
        format: DATE_FORMAT.YEAR
      }
    });
     */
    if (value !== null && !isValidDateTime(startValue)) {
      startValue = null;
    }
    const changedValue = {
      [startFieldName]: startValue,
      [endFieldName]: endValue
    };
    this.triggerChange(changedValue);
  };

  /**
   * Xử lý khi toggle start panel
   * @param {moment} value Giá trị open/close cho start
   * @returns {void} Cập nhật state.startOpen
   * @memberof YearPickerRange
   */
  handleStartOpenChange = (value) => {
    this.setState({ startOpen: value });
  };

  /**
   * Xử lý khi toggle end panel
   * @param {moment} value Giá trị open/close cho end
   * @returns {void} Cập nhật state.endOpen
   * @memberof YearPickerRange
   */
  handleEndOpenChange = (value) => {
    this.setState({ endOpen: value });
  };

  /**
   * Xử lý khi giá trị years thay đổi
   * @param {{moment, moment}} changedValue Giá trị years
   * @returns {void} Gọi props.onChange
   * @memberof YearPickerRange
   */
  triggerChange = (changedValue) => {
    if (isFunction(this.props.onChange)) {
      this.props.onChange(changedValue);
    }
  }

  render() {
    return (
      <Row {...rowLayout}>
        <Col {...colLayout.half}>
          <DatePicker
            disabledDate={this.disabledStartDate}
            format="YYYY"
            mode="year"
            onChange={this.handleStartChange}
            onOpenChange={this.handleStartOpenChange}
            onPanelChange={this.handleStartChange}
            open={this.state.startOpen}
            placeholder={get(this.props.placeholder, 'start', '')}
            style={{ width: '100%' }}
            suffixIcon={<span className="icon-date" />}
            value={this.props.value[this.props.fieldName.start]}
          />
        </Col>
        <Col {...colLayout.half}>
          <DatePicker
            disabledDate={this.disabledEndDate}
            format="YYYY"
            mode="year"
            onChange={this.handleEndChange}
            onOpenChange={this.handleEndOpenChange}
            onPanelChange={this.handleEndChange}
            open={this.state.endOpen}
            placeholder={get(this.props.placeholder, 'end', '')}
            style={{ width: '100%' }}
            suffixIcon={<span className="icon-date" />}
            value={this.props.value[this.props.fieldName.end]}
          />
        </Col>
      </Row>
    );
  }
}

YearPickerRange.propTypes = {
  fieldName: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string
  }),
  value: PropTypes.objectOf(PropTypes.any)
};

YearPickerRange.defaultProps = {
  fieldName: {
    start: 'tuNam',
    end: 'denNam'
  },
  value: {},
  placeholder: {
    start: 'Từ năm',
    end: 'Đến năm'
  }
};

export default YearPickerRange;
