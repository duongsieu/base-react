import React, { PureComponent } from 'react';
import { Select as SelectAntd, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import {
  get,
  indexOf,
  isArray,
  isEmpty
} from 'lodash';
import { convertArray } from 'helpers';

const { Option } = SelectAntd;
export default class Select extends PureComponent {
  /**
   * Lấy danh sách các tên trường sử dụng cho Select
   * @returns {Object}
   * @memberof Select
   */
  getFieldsName = () => {
    const fieldsName = {
      value: get(this.props.fieldsName, 'value', 'value'),
      name: get(this.props.fieldsName, 'name', 'name'),
      disabled: get(this.props.fieldsName, 'disabled', 'disabled')
    };
    return fieldsName;
  }

  render() {
    // Lấy các tên trường
    const fieldsName = this.getFieldsName();
    const {
      value: valueFieldName,
      name: nameFieldName,
      disabled: disabledFieldName
    } = fieldsName;
    let dataSelect = isArray(this.props.dataSelect) ? this.props.dataSelect : [];
    const defaultOption = this.props.defaultOption || null;
    if (!isEmpty(defaultOption)) {
      dataSelect = convertArray(dataSelect, { firstImp: [defaultOption] });
    }
    return (
      <SelectAntd
        dropdownClassName={`dropdown-${this.props.name}`}
        {...this.props}
        className={this.props.className}
        filterOption={(input, option) => {
          const title = get(option, 'props.title') || '';
          return !isEmpty(title) && title.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        }}
        showSearch={this.props.showSearch}
        style={this.props.style}
        value={dataSelect.length ? this.props.value : undefined}
      >
        {dataSelect.map((item, i) => {
          const value = get(item, valueFieldName);
          const name = get(item, nameFieldName);
          const disabled = get(item, disabledFieldName) || indexOf(this.props.dataDisable, value) !== -1;
          return (
            <Option
              key={`value-select-${i}`}
              disabled={disabled}
              name={name}
              record={item}
              title={name}
              value={value}
            >
              <Tooltip title={get(item, 'tooltip.title')}>
                {name}
              </Tooltip>
            </Option>
          );
        })}
      </SelectAntd>
    );
  }
}

Select.propTypes = {
  className: PropTypes.string,
  dataDisable: PropTypes.arrayOf(PropTypes.any),
  dataSelect: PropTypes.arrayOf(PropTypes.any),
  defaultOption: PropTypes.objectOf(PropTypes.any),
  disabled: PropTypes.bool,
  // Định nghĩa tên các trường sử dụng cho Select
  fieldsName: PropTypes.shape({
    value: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.string
  }),
  // moi element trong mot form se co "name" khac nhau
  name: PropTypes.string,
  onChange: PropTypes.func,
  showSearch: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array
  ]),
  style: PropTypes.objectOf(PropTypes.any)
};

Select.defaultProps = {
  className: '',
  dataDisable: [],
  dataSelect: [],
  defaultOption: null,
  disabled: false,
  fieldsName: {},
  name: '',
  onChange: null,
  showSearch: true,
  style: { width: '100%' }
};
