import React from 'react';
import PropTypes from 'prop-types';
import {
  Empty
} from 'antd';
import messages from 'constants/messages';

export default function ErrorSystem(props) {
  return (
    <div className={`content-notfound ${props.className}`}>
      <Empty
        className="center-block"
        description={props.message}
        image={<img alt={props.message} className="bg-notdata" src={`${process.env.PUBLIC_URL}/images/error.png`} />}
      >
        {props.children}
      </Empty>
    </div>
  );
}

ErrorSystem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  message: PropTypes.string
};

ErrorSystem.defaultProps = {
  className: '',
  children: undefined,
  message: messages.ERROR_SYSTEM
};
