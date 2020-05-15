import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty
} from 'lodash';
import {
  Col,
  Row
} from 'antd';
import { rowLayout } from 'constants/form';

export default function ContentWrapper(props) {
  const title = props.title || '';
  const footer = props.footer || '';
  const headingRight = props.headingRight || '';
  // Col layout cho heading left
  let colLayoutLeft = get(props, 'colLayoutLeft');
  // Col layout cho heading right
  const colLayoutRight = get(props, 'colLayoutRight', {});
  // Hiển trị full width heading left nếu không có heading right
  if (isEmpty(headingRight)) {
    colLayoutLeft = {
      lg: 24,
      md: 24,
      sm: 24,
      xs: 24
    };
  }
  return (
    <div className={`b-normal-wrapper ${props.className}`}>
      {!isEmpty(title) && (
        <header className="heading-wrapper">
          <Row {...rowLayout} justify="space-between" type="flex">
            <Col {...colLayoutLeft}>
              <h3 className="heading2">{title}</h3>
            </Col>
            {!isEmpty(headingRight) && (
              <Col {...colLayoutRight}>
                <div className="heading-right">
                  {headingRight}
                </div>
              </Col>
            )}
          </Row>
        </header>
      )}
      <main className="body-wrapper">
        {props.children}
      </main>
      {!isEmpty(footer) && (
        <footer className="footer-wrapper">
          {footer}
        </footer>
      )}
    </div>
  );
}

ContentWrapper.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  // Col layout cho heading left
  colLayoutLeft: PropTypes.objectOf(PropTypes.any),
  // Col layout cho heading right
  colLayoutRight: PropTypes.objectOf(PropTypes.any),
  footer: PropTypes.objectOf(PropTypes.any),
  headingRight: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.string
};

ContentWrapper.defaultProps = {
  className: '',
  colLayoutLeft: {
    lg: 8,
    md: 12,
    sm: 12,
    xs: 24
  },
  colLayoutRight: {
    lg: 16,
    md: 12,
    sm: 12,
    xs: 24
  },
  footer: undefined,
  headingRight: undefined,
  title: ''
};
