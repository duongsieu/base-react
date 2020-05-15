import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Button,
  Icon
} from 'antd';

const ButtonIcon = ({
  iconClass,
  iconType,
  htmlType,
  loading,
  onClick,
  size,
  type,
  text,
  ...otherProps
}) => {
  let icon = null;
  if (iconClass) {
    icon = (<span className={`icon ${iconClass}`} />);
  }
  if (iconType) {
    icon = (<Icon className={`icon-antd ${iconClass}`} type={iconType} />);
  }
  const getProp = (prop) => {
    if (loading) {
      return undefined;
    }
    return prop;
  };
  return (
    <Button
      size={size}
      {...otherProps}
      className={classnames(`btn-normal ${otherProps.className || ''}`, {
        'btn-loading': loading
      })}
      htmlType={getProp(htmlType)}
      onClick={getProp(onClick)}
    >
      <div className="content-btn">
        {loading ? (<Icon className="icon-antd" type="loading" />) : icon}
        <span className="name">{text}</span>
      </div>
    </Button>
  );
};

export default ButtonIcon;

ButtonIcon.propTypes = {
  iconClass: PropTypes.string,
  iconType: PropTypes.string,
  htmlType: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string,
  text: PropTypes.string
};

ButtonIcon.defaultProps = {
  iconClass: '',
  iconType: '',
  htmlType: undefined,
  loading: false,
  onClick: undefined,
  size: 'large',
  type: '',
  text: ''
};
