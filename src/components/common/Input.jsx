import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input as InputAntd } from 'antd';
import {
  DEFAULT_VALUE
} from 'constants/variables';

const { TextArea, Search, Password } = InputAntd;

export default class Input extends PureComponent {
  render() {
    if (this.props.type === 'textArea') {
      return (<TextArea {...this.props} />);
    }
    if (this.props.type === 'search') {
      return (<Search {...this.props} />);
    }
    if (this.props.type === 'password') {
      return (<Password {...this.props} />);
    }
    return (<InputAntd {...this.props} />);
  }
}

Input.propTypes = {
  type: PropTypes.string,
  rows: PropTypes.number
};

Input.defaultProps = {
  type: '',
  rows: DEFAULT_VALUE.TEXTAREA_ROWS
};
