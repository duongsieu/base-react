import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

export default function table(props) {
  return (
    <Table {...props} />
  );
}

table.propTypes = {
  className: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.any),
  loading: PropTypes.bool,
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
};

table.defaultProps = {
  className: '',
  dataSource: [],
  loading: false,
  pagination: false
};

table.displayName = 'Table';
