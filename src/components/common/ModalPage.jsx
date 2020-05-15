import React from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isString
} from 'lodash';
import {
  Icon,
  Modal as ModalAntd
} from 'antd';

export default function ModalPage({
  title,
  children,
  wrapClassName,
  ...otherProps
}) {
  const iconType = get(title, 'iconType');
  const iconClass = get(title, 'iconClass');
  const text = isString(title) ? title : get(title, 'text');
  let icon = null;
  if (iconClass) {
    icon = (<span className={`icon ${iconClass}`} />);
  }
  if (iconType) {
    icon = (<Icon className={`icon-antd ${iconClass}`} type={iconType} />);
  }
  const titleContent = text ? (
    <div className="modal-page-title">
      {icon}
      <span className="name">{text}</span>
    </div>
  ) : null;
  return (
    <ModalAntd
      {...otherProps}
      footer={null}
      title={titleContent}
      wrapClassName={`${wrapClassName} modal-page`}
    >
      <div>
        {children}
      </div>
    </ModalAntd>
  );
}

ModalPage.propTypes = {
  wrapClassName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  style: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.shape({
    iconClass: PropTypes.string,
    iconType: PropTypes.string,
    text: PropTypes.string
  }),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};

ModalPage.defaultProps = {
  wrapClassName: '',
  children: '',
  style: {
    maxWidth: '90%'
  },
  title: {
    iconClass: '',
    iconType: '',
    text: ''
  },
  width: 1000
};
