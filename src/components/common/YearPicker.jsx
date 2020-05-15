import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  isFunction
} from 'lodash';
import {
  getDateTime,
  isYear
} from 'helpers';
import { DATE_FORMAT } from 'constants/variables';

class YearPicker extends React.Component {
  state = {
    isOpen: false
  }

  /**
   * Kiểm tra một giá trị có phải là năm không
   * @param {*} value Giá trị cần kiểm tra
   * @param {Boolean}
   * @memberof YearPicker
   */
  isValidYear = (value) => {
    const year = value ? value.format('YYYY') : null;
    const isValid = isYear(year);
    return isValid;
  }

  /**
   * Xử lý khi toggle panel
   * @param {moment} value Giá trị open/close
   * @returns {void} Cập nhật state.isOpen
   * @memberof YearPicker
   */
  handleOpenChange = (isOpen) => {
    this.setState({ isOpen });
  }

  /**
   * Xử lý khi giá trị trên input thay đổi
   * @param {moment} value Giá trị year
   * @returns {void} Cập nhật state và gọi triggerChange
   * @memberof YearPicker
   */
  handleChange = (value) => {
    const year = value ? value.format('YYYY') : null;
    const isValid = isYear(year);
    const finalValue = isValid ? getDateTime({
      value,
      format: DATE_FORMAT.YEAR,
      formatUTC: DATE_FORMAT.YEAR,
      isString: false
    }) : null;
    this.triggerChange(finalValue);
  }

  /**
   * Xử lý khi giá trị year thay đổi
   * @param {moment} value Giá trị year
   * @returns {void} Gọi props.onChange
   * @memberof YearPicker
   */
  triggerChange = (value) => {
    if (isFunction(this.props.onChange)) {
      this.props.onChange(value);
    }
  }

  render() {
    return (
      <div>
        <DatePicker
          className={this.props.className}
          disabled={this.props.disabled}
          format="YYYY"
          mode="year"
          onChange={this.handleChange}
          onOpenChange={this.handleOpenChange}
          onPanelChange={this.handleChange}
          open={this.state.isOpen}
          placeholder={this.props.placeholder}
          style={{ width: '100%' }}
          suffixIcon={<span className="icon-date" />}
          value={this.props.value}
        />
      </div>
    );
  }
}

YearPicker.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(moment),
    PropTypes.string
  ])
};

YearPicker.defaultProps = {
  className: '',
  disabled: false,
  placeholder: 'Chọn năm'
};

export default YearPicker;
