import React, { PureComponent } from 'react';
import {
  Checkbox,
  Col,
  Pagination as PaginationAntd,
  Row
} from 'antd';
import {
  get,
  isEmpty,
  isFunction
} from 'lodash';
import PropTypes from 'prop-types';
import { colLayout, rowLayout } from 'constants/form';
import {
  ButtonIcon
} from 'components/common';

export default class Pagination extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isExportAll: false,
      isExporting: false
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  componentWillUnmount() {
    // Set mounted
    this.setMounted(false);
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof Pagination
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof Pagination
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof Pagination
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Xử lý thay đổi checkbox "Tất cả trang"
   * @param {Object} e Event object
   * @returns {void} Cập nhật state.isExportAll
   * @memberof Pagination
   */
  handleChangeCheckboxExcel = (e) => {
    const checked = get(e, 'target.checked', false);
    this.setStateData({ isExportAll: checked });
  };

  /**
   * Xử lý click button "Tải xuống dạng xls"
   * @returns {void} Gọi props.exportExcel.onExport
   * @memberof Pagination
   */
  handleCheckButtonExcel= async () => {
    await this.setStateData({ isExporting: true });
    const func = get(this.props.exportExcel, 'onExport');
    const extraFilter = {
      isExportAll: this.state.isExportAll
    };
    if (isFunction(func)) {
      await func(extraFilter);
    }
    await this.setStateData({ isExporting: false });
  };

  /**
   * Lấy props cho pagination
   * @returns {Object}
   * @memberof Pagination
   */
  getPropsPagination = () => ({
    ...this.props,
    hideOnSinglePage: this.props.hideOnSinglePage !== undefined
      ? this.props.hideOnSinglePage
      : this.props.total <= this.props.pageSize,
    exportExcel: undefined
  })

  render() {
    const totalPages = this.props.totalPages || 1;
    if (this.props.total === 0) {
      return null;
    }
    return (
      <div className="footer-pagination">
        <Row {...rowLayout} justify="space-between" type="flex">
          <Col {...colLayout.half} className="left-pagination">
            <p className="description-table d-inline-block mr10">{`Trang ${this.props.current}/${totalPages}`}</p>
            {!isEmpty(this.props.exportExcel) && (
              <div className="d-inline-block">
                <Checkbox name="xuatExelTatCaTrang" onChange={this.handleChangeCheckboxExcel}>
                  <span className="description-table">Tất cả trang</span>
                </Checkbox>
                <ButtonIcon
                  className="m5 btn-submit green"
                  iconClass="icon-tai-xuong"
                  loading={this.state.isExporting}
                  onClick={this.handleCheckButtonExcel}
                  text="Tải xuống dạng xlsx"
                />
              </div>
            )}
          </Col>
          <Col {...colLayout.half} className="right-pagination">
            <PaginationAntd
              hideOnSinglePage={this.props.total <= this.props.pageSize}
              {...this.getPropsPagination()}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Pagination.propTypes = {
  exportExcel: PropTypes.shape({
    onExport: PropTypes.func
  }),
  // Page hiện tại
  current: PropTypes.number,
  hideOnSinglePage: PropTypes.bool,
  // Page size
  pageSize: PropTypes.number,
  // Tổng số record (trong DB)
  total: PropTypes.number,
  // Tổng số page
  totalPages: PropTypes.number
};

Pagination.defaultProps = {
  exportExcel: null,
  current: 1,
  hideOnSinglePage: undefined,
  pageSize: 10,
  total: 0,
  totalPages: 1
};
