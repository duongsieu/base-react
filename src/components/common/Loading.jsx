import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default function loading(props) {
  return (
    <div className="loading-container">
      <Spin size={props.size} />
    </div>
  );
}

loading.propTypes = {
  size: PropTypes.string
};

loading.defaultProps = {
  size: 'large'
};

loading.displayName = 'Loading';
