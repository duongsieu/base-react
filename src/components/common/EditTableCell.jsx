import React from 'react';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import {
  get,
  isFunction
} from 'lodash';

const EditableContext = React.createContext();

const EditTableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

export const EditTableFormRow = Form.create()(EditTableRow);

EditTableRow.propTypes = {
  form: PropTypes.objectOf(PropTypes.any).isRequired,
  index: PropTypes.string
};

EditTableRow.defaultProps = {
  index: ''
};

class EditTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
    this.inputRef = React.createRef();
  }

  componentWillUnmount() {
    // set mounted
    this.setMounted(false);
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof LoaiViTriForm
  */
 setMounted = (value = true) => {
   this.mounted = value;
   return this.mounted;
 }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof LoaiViTriForm
   */
  getMounted = () => this.mounted

  /**
   * Xử lý chuyển trạng thái record thành editting
   * @returns {void} Cập nhật state.editing, nếu đang ở trạng thái editing thì focus input
   * @memberof EditTableCell
   */
  toggleEdit = () => {
    this.setStateData(prevState => ({
      editing: !prevState.editing
    }), () => {
      if (this.state.editing) {
        if (isFunction(get(this.inputRef, 'current.focus'))) {
          this.inputRef.current.focus();
        }
      }
    });
  };

  /**
   * Xử lý lấy dữ liệu vừa nhập để truyền qua MucPhiTable
   * @param {String} dataIndex Key của values đang tương tác
   * @param {Object} e Event object
   * @returns {Function} Gọi props handeSave
   * @memberof EditTableCell
   */
  save = dataIndex => (e) => {
    const { record, rowIndex } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        // Trường hợp dữ liệu đầu vào lỗi sẽ gọi props onError
        if (isFunction(this.props.onError)) {
          this.props.onError(record, rowIndex, error);
        }
        return;
      }
      this.toggleEdit();
      const data = {
        ...record,
        ...values
      };
      // Trường hợp dữ liệu hợp lệ sẽ gọi props onSave
      if (isFunction(this.props.onSave)) {
        this.props.onSave(data, rowIndex, {
          values,
          dataIndex
        });
      }
    });
  };

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof LoaiViTriForm
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Render các cột cho table mức phí
   * @param {Object} form Khởi tạo giá trị cho form
   * @memberof EditTableCell
   */
  renderFormCell = (form) => {
    this.form = form;
    const {
      children,
      dataIndex,
      record,
      formItemRules,
      formItemProps
    } = this.props;
    const { editing } = this.state;
    const {
      name,
      value,
      ...restFormItemProps
    } = formItemProps || {};
    const Component = this.props.formItemComponent;
    // Render cột cho trường hợp chỉnh sửa dữ liệu
    if (editing) {
      return (
        <Form.Item>
          {form.getFieldDecorator(name || dataIndex, {
            rules: formItemRules,
            validateFirst: true,
            initialValue: value || record[dataIndex]
          })(
            <Component
              {...restFormItemProps}
              ref={this.inputRef}
              onBlur={this.save(dataIndex)}
              onPressEnter={this.save(dataIndex)}
            />
          )}
        </Form.Item>
      );
    }
    // Render cột cho trường hợp không chỉnh sửa dữ liệu
    return (
      <div
        className="editable-cell-value-wrap pr25"
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      formItemRules,
      rowIndex,
      formItemProps,
      formItemComponent,
      onSave,
      onError,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderFormCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

EditTableCell.propTypes = {
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
  dataIndex: PropTypes.string,
  editable: PropTypes.bool,
  formItemComponent: PropTypes.any,
  formItemProps: PropTypes.objectOf(PropTypes.any),
  formItemRules: PropTypes.any,
  onError: PropTypes.func,
  onSave: PropTypes.func,
  rowIndex: PropTypes.number,
  record: PropTypes.objectOf(PropTypes.any),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ])
};

EditTableCell.defaultProps = {
  dataIndex: null,
  editable: false,
  formItemComponent: undefined,
  formItemProps: undefined,
  formItemRules: undefined,
  onError: null,
  onSave: null,
  rowIndex: undefined,
  title: null,
  record: null
};

export default EditTableCell;
