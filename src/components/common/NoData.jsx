import React from 'react';
import PropTypes from 'prop-types';
import {
  Empty
} from 'antd';
import messages from 'constants/messages';

export default function NoData(props) {
  return (
    <div className={`content-notfound ${props.className}`}>
      <Empty
        className="center-block"
        description={props.message}
      >
        {props.children}
      </Empty>
    </div>
  );
}

NoData.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  message: PropTypes.string
};

NoData.defaultProps = {
  className: '',
  children: undefined,
  message: messages.NO_DATA
};
