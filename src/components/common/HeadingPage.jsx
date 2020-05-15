import React, { Component } from 'react';
import {
  Card,
  Col,
  Row,
  Typography
} from 'antd';
import PropTypes from 'prop-types';

const { Title } = Typography;

class HeadingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Card style={{ margin: '20px 15px 0' }}>
        <Row gutter={24}>
          <Col span={12}>
            <Title level={4} style={{ margin: '5px 0 0' }}>{this.props.title}</Title>
          </Col>
          <Col span={12}>
            {this.props.children}
          </Col>
        </Row>
      </Card>
    );
  }
}

export default HeadingPage;

HeadingPage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any
};

HeadingPage.defaultProps = {
  children: null
};
