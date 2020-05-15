import React from 'react';
import { Modal as ModalAntd } from 'antd';
import PropTypes from 'prop-types';

const { confirm } = ModalAntd;

export default function modal(props) {
  if (props.type === 'confirm') {
    return confirm({
      okText: 'Có',
      cancelText: 'Không',
      centered: true,
      ...props
    });
  }
  return (
    <ModalAntd {...props}>
      <div style={{ textAlign: 'center' }}>
        {props.children}
      </div>
    </ModalAntd>
  );
}

modal.propTypes = {
  visible: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  title: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  confirmLoading: PropTypes.bool,
  cancelText: PropTypes.string,
  okText: PropTypes.string,
  okType: PropTypes.string,
  type: PropTypes.string
};

modal.defaultProps = {
  visible: false,
  children: '',
  title: '',
  onOk: null,
  onCancel: null,
  confirmLoading: false,
  cancelText: '',
  okText: '',
  okType: '',
  type: ''
};

modal.displayName = 'Modal';
