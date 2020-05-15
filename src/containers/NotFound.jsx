import React from 'react';
import {
  Container
} from 'components/common';
import {
  Button,
  Icon
} from 'antd';
import { Link } from 'react-router-dom';

export default function notFound(props) {
  return (
    <Container containerClass="not-found-page" hasHeading={false}>
      <div style={{ padding: '50px 0 0' }}>
        <img alt="Not Found" className="image-medium" src="/images/404.png" />
        <h2 className="description">Không tìm thấy trang</h2>
      </div>
      <Button className="btn-normal">
        <Link to="/">
          <Icon type="left" />
          <span>Quay về trang chủ</span>
        </Link>
      </Button>
    </Container>
  );
}

notFound.displayName = 'NotFound';
