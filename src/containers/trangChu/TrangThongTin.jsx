import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row
} from 'antd';
import { colLayout, rowLayout } from 'constants/form';

class TrangThongTin extends PureComponent {
  constructor(props) {
    super(props);
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
   * @memberof TrangThongTin
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof TrangThongTin
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof TrangThongTin
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  render() {
    return (
      <div className="trangthongtin-page">
        <Row {...rowLayout} className="banner">
          <Col {...colLayout.partThree} className="banner-info">
            <h4 className="title mb50">
              Đăng ký và cấp phép quảng cáo cho các tổ chức,
              cá nhân trên địa bàn thành phố Đà Nẵng
            </h4>
          </Col>
          <Col {...colLayout.twoThird}>
            <div>
              <img alt="Logo" className="banner-image" src="/images/thong-tin-banner.png" />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

TrangThongTin.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default TrangThongTin;
