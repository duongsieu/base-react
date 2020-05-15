import React, { PureComponent } from 'react';
import {
  Layout
} from 'antd';

const { Footer: FooterAntd } = Layout;

class GuestFooter extends PureComponent {
  render() {
    return (
      <FooterAntd className="guest-footer b-color-blue">
        <div>
          <h1 className="footer-title font-size-35 text-center">Sở Văn hóa và Thể thao thành phố Đà Nẵng</h1>
        </div>
        <p className="mb5 text-center">
          Địa chỉ: Tầng 17, Trung tâm Hành chính, số 24 Trần Phú, quận Hải Châu, Đà Nẵng.
        </p>
        <p className="mb5 text-center">Điện thoại: (0236) 3 821.203 - Fax: (0236) 3 889.174</p>
        <p className="mb5 text-center">Email: svhtt@danang.gov.vn - Website:http://vhtt.danang.gov.vn</p>
        <p className="text-center">&#169;2020</p>
      </FooterAntd>
    );
  }
}

export default GuestFooter;
