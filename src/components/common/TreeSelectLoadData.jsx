import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect as TreeSelectAntd } from 'antd';
import classname from 'classnames';
import {
  convertArray,
  convertResponseAPI,
  isValidCondition
} from 'helpers';
import {
  get,
  isArray,
  isEmpty,
  isFunction
} from 'lodash';

const { TreeNode } = TreeSelectAntd;
export default class TreeSelectLoadData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dataTreeSelect: props.dataTreeSelect
    };
  }

  /**
   * Lấy danh sách các tên trường sử dụng cho TreeSect
   * @returns {Object}
   * @memberof TreeSelectLoadData
   */
  getFieldsName = () => {
    const fieldsName = {
      value: get(this.props.fieldsName, 'value', 'value'),
      name: get(this.props.fieldsName, 'name', 'name'),
      children: get(this.props.fieldsName, 'children', 'children'),
      isLeaf: get(this.props.fieldsName, 'isLeaf', 'isLeaf'),
      isParent: get(this.props.fieldsName, 'isParent', 'isParent'),
      disableCheckbox: get(this.props.fieldsName, 'disableCheckbox', 'disableCheckbox'),
      hiddenCheckbox: get(this.props.fieldsName, 'hiddenCheckbox', 'hiddenCheckbox'),
      disabled: get(this.props.fieldsName, 'disabled', 'disabled'),
      hidden: get(this.props.fieldsName, 'hidden', 'hidden')
    };
    return fieldsName;
  }

  /**
   * Cập nhật giá trị mới thuộc nhiều cấp trong mảng và object
   * @param {Array<Object>} data Dữ liệu ban đầu
   * @param {Array<Object>} value Giá trị mới
   * @param {String} keyFieldName Tên trường của giá trị mới
   * @returns {Array<Object>}
   * @memberof TreeSelectLoadData
   */
  setNestedValue = (data, indexList = [], value, keyFieldName = 'children') => {
    const newData = isArray(data) ? [...data] : [];
    if (!isArray(indexList)) {
      return newData;
    }
    // Khi indexList chỉ còn một giá trị thì cập nhật "value" cho index đó
    if (indexList.length === 1) {
      newData[indexList[0]] = {
        ...newData[indexList[0]],
        [keyFieldName]: value
      };
      return newData;
    }
    // Khi indexList nhiều hơn 1 giá trị thì tiến hành đệ quy lần lượt từng indexList
    const childData = get(newData, `[${indexList[0]}].${keyFieldName}`);
    const childIndexList = indexList.slice(1);
    newData[indexList[0]] = {
      ...newData[indexList[0]],
      [keyFieldName]: this.setNestedValue(childData, childIndexList, value, keyFieldName)
    };
    return newData;
  }

  /**
   * Load data cho TreeSelect
   * @param {Object} treeNode Node cha
   * @returns {Promise} Request và xử lý cập nhật state.dataTreeSelect
   * @memberof TreeSelectLoadData
   */
  loadData = async treeNode => new Promise(async (resolve) => {
    if (!isFunction(this.props.requestData)) {
      return resolve();
    }
    // Lấy fields name
    const { children: childrenFieldName } = this.getFieldsName();
    if (!isEmpty(get(treeNode, `props.record.${childrenFieldName}`))) {
      return resolve();
    }
    // Dữ liệu cho TreeSelect
    const originDataTreeSelect = !isEmpty(this.props.dataTreeSelect)
      ? [...this.props.dataTreeSelect]
      : [...this.state.dataTreeSelect];
    // Request dữ liệu con cho node hiện tại
    const response = await this.props.requestData(treeNode);
    // Dữ liệu con của node hiện tại
    const originChildNodeData = convertResponseAPI(response).list;
    // Dữ liệu con của node hiện tại đã được chuyển đổi
    const currentPos = get(treeNode, 'props.pos') || '';
    // Danh sách vị trí của node hiện tại
    const currentPosList = currentPos.split('-');
    // Xóa vị trí root
    currentPosList.shift();
    let newDataSelect = [...originDataTreeSelect];
    // Cập nhật danh sách dữ liệu con cho node hiện tại
    if (!isEmpty(treeNode)) {
      newDataSelect = this.setNestedValue(newDataSelect, currentPosList, originChildNodeData, childrenFieldName);
    } else {
      // Trường hợp load dữ liệu cấp root
      newDataSelect = originChildNodeData;
    }
    // Cập nhật state
    await this.setState({ dataTreeSelect: newDataSelect });
    // Trigger dữ liệu mới nhât
    if (isFunction(this.props.onAfterLoad)) {
      await this.props.onAfterLoad(this.state.dataTreeSelect);
    }
    return resolve();
  })

  /**
   * Lấy danh sách TreeNode
   * @param {Object} data
   * @param {Object} fieldsName Các tên trường sử dụng cho TreeSelect
   * @returns {Array<Node>}
   * @memberof TreeSelectLoadData
   */
  getTreeNode = (data, fieldsName) => {
    const {
      value: valueFieldName,
      name: nameFieldName,
      children: childrenFieldName,
      isLeaf: isLeafFieldName,
      isParent: isParentFieldName,
      disableCheckbox: disableCheckboxFieldName,
      hiddenCheckbox: hiddenCheckboxFieldName,
      disabled: disabledFieldName,
      hidden: hiddenFieldName
    } = fieldsName;
    return data.map((item) => {
      let addNoneSelectableClass = false;
      let selectable = !this.props.treeCheckable;
      if (selectable && !isEmpty(this.props.selectableCondition)) {
        const isValidSelectable = isValidCondition({
          conditions: get(this.props.selectableCondition, 'conditions'),
          isOrConditions: get(this.props.selectableCondition, 'isOrConditions'),
          record: item
        });

        selectable = isValidSelectable;
        addNoneSelectableClass = !selectable;
      }
      let disableCheckbox = false;
      if (this.props.treeCheckable && !isEmpty(this.props.disabledCheckboxCondition)) {
        disableCheckbox = isValidCondition({
          conditions: get(this.props.disabledCheckboxCondition, 'conditions'),
          isOrConditions: get(this.props.disabledCheckboxCondition, 'isOrConditions'),
          record: item
        });
      }
      let disabled = false;
      if (this.props.treeCheckable && !isEmpty(this.props.disabledCondition)) {
        disabled = isValidCondition({
          conditions: get(this.props.disabledCondition, 'conditions'),
          isOrConditions: get(this.props.disabledCondition, 'isOrConditions'),
          record: item
        });
      }
      const hiddenItem = get(item, hiddenFieldName);
      const disableCheckboxItem = get(item, disableCheckboxFieldName);
      const hiddenCheckboxItem = get(item, hiddenCheckboxFieldName);
      const disabledItem = get(item, disabledFieldName);
      const nameItem = get(item, nameFieldName);
      const valueItem = get(item, valueFieldName);
      const childrenItem = get(item, childrenFieldName);
      const isLeafItem = get(item, isLeafFieldName);
      const isParentItem = get(item, isParentFieldName);
      if (!isEmpty(childrenItem)) {
        return (
          <TreeNode
            key={valueItem}
            className={classname({
              'hidden-checkbox-tree': hiddenCheckboxItem,
              'none-selectable': addNoneSelectableClass,
              'hidden-node': hiddenItem
            })}
            disableCheckbox={disableCheckbox || disableCheckboxItem || hiddenCheckboxItem}
            disabled={disabled || disabledItem}
            record={item}
            selectable={selectable}
            title={nameItem}
            value={valueItem}
          >
            {this.getTreeNode(childrenItem, fieldsName)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={valueItem}
          className={classname({
            'hidden-checkbox-tree': hiddenCheckboxItem,
            'none-selectable': addNoneSelectableClass,
            'hidden-node': hiddenItem
          })}
          disableCheckbox={disableCheckbox || disableCheckboxItem || hiddenCheckboxItem}
          disabled={disabled || disabledItem}
          isLeaf={isLeafItem !== false && isParentItem !== true}
          record={item}
          selectable={selectable}
          title={nameItem}
          value={valueItem}
        />
      );
    });
  }

  render() {
    const { value, name } = this.props;
    let dataTreeSelect = !isEmpty(this.props.dataTreeSelect)
      ? [...this.props.dataTreeSelect]
      : [...this.state.dataTreeSelect];
    const defaultOption = this.props.defaultOption || null;
    if (!isEmpty(defaultOption)) {
      dataTreeSelect = convertArray(dataTreeSelect, { lastImp: [defaultOption] });
    }
    return (
      <TreeSelectAntd
        // muc dich su dung "props.name": xac dinh element theo dropdownClassName (auto test)
        dropdownClassName={`tree-dropdown tree-dropdown-${name}`}
        style={{ minWidth: 280, width: 'auto', maxWidth: '100%' }}
        treeNodeFilterProp="title"
        {...this.props}
        loadData={this.loadData}
        value={dataTreeSelect.length ? value : undefined}
      >
        {this.getTreeNode(dataTreeSelect, this.getFieldsName())}
      </TreeSelectAntd>
    );
  }
}

TreeSelectLoadData.propTypes = {
  onAfterLoad: PropTypes.func,
  dataTreeSelect: PropTypes.arrayOf(PropTypes.any),
  defaultOption: PropTypes.objectOf(PropTypes.any),
  disabledCheckboxCondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  disabledCondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  // Định nghĩa tên các trường sử dụng cho TreeSelect
  fieldsName: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.string,
    isLeaf: PropTypes.string,
    isParent: PropTypes.string,
    disableCheckbox: PropTypes.string,
    hiddenCheckbox: PropTypes.string,
    disabled: PropTypes.string,
    hidden: PropTypes.string
  }),
  requestData: PropTypes.func,
  // moi element trong mot form se co "name" khac nhau
  name: PropTypes.string,
  // same to isValidCondition params
  selectableCondition: PropTypes.shape({
    conditions: PropTypes.arrayOf(PropTypes.any),
    isOrConditions: PropTypes.bool
  }),
  treeCheckable: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ])
};

TreeSelectLoadData.defaultProps = {
  onAfterLoad: null,
  dataTreeSelect: [],
  defaultOption: null,
  disabledCheckboxCondition: {},
  disabledCondition: {},
  fieldsName: {},
  requestData: null,
  name: '',
  selectableCondition: {},
  treeCheckable: false
};
