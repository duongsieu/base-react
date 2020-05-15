import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Icon, Popover as PopoverAntd } from 'antd';
import {
  get,
  isEmpty,
  isEqual,
  isFunction
} from 'lodash';
import {
  isValidCondition
} from 'helpers';

export default class Popover extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isShow: false,
      contentPopover: null
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  componentDidMount = () => {
    const contentPopover = this.contentPopover();
    this.setContentPopover(contentPopover);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.record, prevProps.record) || !isEqual(this.props.params, prevProps.params)) {
      const contentPopover = this.contentPopover(this.props);
      this.setContentPopover(contentPopover);
    }
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof Popover
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof Popover
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof Popover
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Xử lý khi một phần tử của popover được click
   * @param {Object} element Phần tử được click
   * @returns {void}
   * @memberof Popover
   */
  clickPopoverElement = element => (e) => {
    e.stopPropagation();
    this.setStateData({ visible: false });
    if (isFunction(get(element, 'onClick'))) {
      return element.onClick(this.props.record);
    }
    return false;
  }

  /**
   * Lấy nội dung mặc định cho một phần tử thuộc popover
   * @param {Object} element Phần tử đang xử lý
   * @param {Number} key Key duy nhất của phần tử
   * @returns {Node} Giá trị render
   * @memberof Popover
   */
  defaultPopoverElement = (element, key = 0) => (
    <p
      key={key}
      className="popover-content-item"
      onClick={this.clickPopoverElement(element)}
      role="presentation"
    >
      {get(element, 'iconClass') && (
        <span className={`icon pr10 ${get(element, 'iconClass')}`} />
      )}
      {get(element, 'iconType') && (
        <Icon className={`icon-antd pr10 ${get(element, 'iconClass')}`} type={get(element, 'iconType')} />
      )}
      <span className="action-name">{get(element, 'name')}</span>
    </p>
  )

  /**
   * Lấy nội dung hiển thị của một phần từ popover
   * @param {Object} element Phần tử đang xử lý
   * @param {Number} key Key duy nhất của phần tử
   * @returns {Node} Sử dụng giá trị mặc định hoặc hiệu chỉnh
   * @memberof Popover
   */
  getPopopverElement = (element, key = 0) => {
    // set this.state.isShow if there is any element
    const { isShow = false } = this.state;
    if (!isShow) {
      this.setIsShow(true);
    }
    const { isDefault = true } = element;
    if (isDefault) {
      return this.defaultPopoverElement(element, key);
    }
    return (
      <React.Fragment key={key}>
        element.content
      </React.Fragment>
    );
  }

  /**
   * Set giá trị cho state.isShow
   * @param {Boolean} isShow
   * @returns {void}
   * @memberof Popover
   */
  setIsShow = (isShow = false) => {
    this.setStateData({ isShow });
  }

  /**
   * Set giá trị cho state.contentPopover
   * @param {Node} contentPopover
   * @returns {void}
   * @memberof Popover
   */
  setContentPopover = (contentPopover = null) => {
    this.setStateData({ contentPopover });
  }

  /**
   * Chuyển đổi nội dung cho popover từ props.params
   * @return {Node} Kết quả từ this.getPopopverElement
   * @memberof Popover
   */
  contentPopover = (props = {}) => {
    const {
      params = this.props.params,
      record = this.props.record,
      userPermission = this.props.userPermission
    } = props;
    if (isEmpty(params)) {
      return null;
    }
    return (
      <div className="popover-content">
        {params.map((param, i) => {
          if (isValidCondition({
            conditions: param.conditions,
            record,
            userPermission,
            isOrConditions: param.isOrConditions
          })) {
            return this.getPopopverElement(param, i);
          }
          return null;
        })}
      </div>
    );
  }

  /**
   * Thay đổi thuộc tính visible của popover
   * @param {Boolean} value
   * @returns {void}
   * @memberof Popover
   */
  handleChangeVisible = (value) => {
    this.setStateData({ visible: value });
  }

  /**
   * Xử lý khi popover được click
   * @param {Object} e
   * @returns {void}
   * @memberof Popover
   */
  clickPopover = e => e.stopPropagation()

  render() {
    return (
      <PopoverAntd
        className="popover"
        content={this.state.contentPopover}
        onClick={this.clickPopover}
        onVisibleChange={this.handleChangeVisible}
        placement={this.props.placement}
        trigger="hover"
        visible={this.state.visible}
      >
        {this.state.isShow && this.props.content}
      </PopoverAntd>
    );
  }
}

Popover.propTypes = {
  content: PropTypes.node,
  params: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    iconClass: PropTypes.string,
    onClick: PropTypes.func,
    isDefault: PropTypes.bool,
    content: PropTypes.node,
    conditions: PropTypes.arrayOf(PropTypes.shape({
      operator: PropTypes.string,
      originValueName: PropTypes.string,
      targetValueName: PropTypes.string,
      originValue: PropTypes.any,
      targetValue: PropTypes.any,
      permission: PropTypes.arrayOf(PropTypes.string),
      isOrPermission: PropTypes.bool
    })),
    isOrConditions: PropTypes.bool
  })),
  placement: PropTypes.string,
  record: PropTypes.any,
  userPermission: PropTypes.arrayOf(PropTypes.string)
};

Popover.defaultProps = {
  content: (
    <Icon className="font-size-20" type="setting" />
  ),
  record: {},
  params: [{
    type: '',
    name: '',
    iconClass: '',
    isDefault: true,
    content: '',
    conditions: [],
    orConditions: false
  }],
  userPermission: [],
  placement: 'bottomRight'
};

/*
  Format this.props.params
  params: [{
    content: (<span>This is the content of popover</span>),
    conditions: [
      // this.state.check === true
      {
        type: 'chinh-sua',
        name: 'chinh sua'
        operator: '=',
        originValue: this.state.check,
        targetValue: true
        permission: [],
        isOrPermission: false
      },
      // (record.value !== record.compareValue)
      {
        operator: '<>',
        originValueName: value,
        targetValueName: compareValue,
        permission: [],
        isOrPermission: false
    ],
    isOrCondition: true
  }]
*/
