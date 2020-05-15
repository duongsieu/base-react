import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect as TreeSelectAntd } from 'antd';
import classname from 'classnames';
import {
  convertArray,
  isValidCondition
} from 'helpers';
import {
  get,
  isArray,
  isEmpty
} from 'lodash';

const { TreeNode } = TreeSelectAntd;
export default class TreeSelect extends PureComponent {
  /**
   * Lấy danh sách các tên trường sử dụng cho TreeSect
   * @returns {Object}
   * @memberof TreeSelect
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
   * Lấy danh sách TreeNode
   * @param {Object} data
   * @param {Object} fieldsName Các tên trường sử dụng cho TreeSelect
   * @returns {Array<Node>}
   * @memberof TreeSelect
   */
  getTreeNode(data, fieldsName) {
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
    let dataTreeSelect = isArray(this.props.dataTreeSelect) ? this.props.dataTreeSelect : [];
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
        value={dataTreeSelect.length ? value : undefined}
      >
        {this.getTreeNode(dataTreeSelect, this.getFieldsName())}
      </TreeSelectAntd>
    );
  }
}

TreeSelect.propTypes = {
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

TreeSelect.defaultProps = {
  dataTreeSelect: [],
  defaultOption: null,
  disabledCheckboxCondition: {},
  disabledCondition: {},
  fieldsName: {},
  name: '',
  selectableCondition: {},
  treeCheckable: false
};
