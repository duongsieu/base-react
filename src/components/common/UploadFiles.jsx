
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Col,
  Icon,
  Row,
  Upload
} from 'antd';
import {
  compact,
  get,
  isArray,
  isEmpty,
  isFunction
} from 'lodash';
import {
  FileView
} from 'components/common';
import messages from 'constants/messages';
import { colLayout, rowLayout } from 'constants/form';
import {
  MAX_SIZE_FILE,
  STRING_FORMAT,
  VALID_FILE_TYPE
} from 'constants/variables';
import {
  getArray,
  getReplaceString,
  isValidSize,
  isValidType
} from 'helpers';

export default class UploadFiles extends PureComponent {
  constructor(props) {
    super(props);
    const files = get(props, 'value.data', []);
    this.state = {
      files
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      const value = { ...this.props.value };
      const files = get(value, 'data');
      await this.setStateData({ files, value });
    }
  }

  componentWillUnmount() {
    // set mounted
    this.setMounted(false);
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof UploadFiles
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Lấy mounted
   * @returns {Boolean}
   * @memberof UploadFiles
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof UploadFiles
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Xóa file
   * @returns {Boolean} void
   * @memberof UploadFiles
   */
  handleRemoveFile = (file, index) => async () => {
    if (isEmpty(file) || index === -1) {
      return;
    }
    const files = [...this.state.files];
    files.splice(index, 1);
    // Cập nhật state.files
    await this.setStateData({ files });
    // Gọi props.onChange
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        data: files,
        errors: compact(this.state.errors)
      });
    }
  }

  /**
   * Không sử dụng chức năng upload lên server của antd
   * @returns {Boolean} false
   * @memberof UploadFiles
   */
  handleBeforeUpload = (file, fileList) => {
    let filesPrevious = this.props.multiple ? getArray(this.state.files) : [];
    let filesChange = this.props.multiple ? getArray(fileList) : [file];
    const errors = [];
    // Kiểm tra tổng size file có hợp lệ không
    const dataCheckSize = { size: this.getSizeFiles([...filesPrevious, ...filesChange]) };
    let hasError = !isValidSize(dataCheckSize, MAX_SIZE_FILE.DOCUMENT_FILE);
    // Kiểm tra định dạng file có hợp lệ không
    for (let i = 0; i < filesChange.length; i += 1) {
      if (!isValidType(filesChange[i], this.props.typesFile)) {
        hasError = true;
        break;
      }
    }
    // Nếu có lỗi validation
    if (hasError) {
      const typesFileString = this.props.typesFile.join(', ').toUpperCase();
      const invalidMessage = getReplaceString(messages.INVALID_FILE, [
        {
          format: STRING_FORMAT.SIZE,
          value: MAX_SIZE_FILE.DOCUMENT_FILE
        },
        {
          format: STRING_FORMAT.TYPE,
          value: typesFileString
        }
      ]);
      // Cập nhật errors
      errors.push(new Error(invalidMessage));
      filesChange = [];
      // Giữ lại dữ liệu trước đó khi upload 1 file
      if (!this.props.multiple && !isEmpty(this.state.files)) {
        filesPrevious = [this.state.files[0]];
      }
    }
    const files = [...filesPrevious, ...filesChange];
    // Cập nhật state
    this.setStateData({ files });
    // Gọi props.onChange
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        data: files,
        errors: compact(errors)
      });
    }
    // Không sử dụng request API của Upload - Antd
    return false;
  }

  /**
   * Lấy chuỗi đuôi file hợp lệ
   * @returns {String}
   * @memberof UploadFiles
   */
  getTypeFileString = () => {
    const typesFileString = this.props.typesFile.join(', ').toUpperCase();
    return typesFileString;
  }

  /**
   * Lấy tổng size của danh sách files
   * @returns {Number} Size của tất cả files (KB)
   * @memberof UploadFiles
   */
  getSizeFiles = (files) => {
    const getTotalSize = (accumulator, file) => accumulator + file.size;
    const sum = files.reduce(getTotalSize, 0);
    return sum;
  }

  render() {
    return (
      <div className="files-upload-block">
        <Upload
          beforeUpload={this.handleBeforeUpload}
          multiple={this.props.multiple}
          name="files"
          showUploadList={false}
        >
          {!this.props.disabled && (
            <Button
              className="mr10"
              size="large"
            >
              <div className="content-btn">
                <Icon className="icon" type="upload" />
                <span className="name">{this.props.uploadText}</span>
              </div>
            </Button>
          )}
        </Upload>
        {!this.props.disabled && (
          <div className="d-inline-block">
            <span className="decription">{`Định dạng file: ${this.getTypeFileString()}`}</span>
          </div>
        )}
        {this.props.showUploadList && (
          <div className="list-files">
            <Row {...rowLayout}>
              {
                isArray(this.state.files) && this.state.files.map((file, index) => (
                  <Col
                    {...get(colLayout, this.props.colLayoutFileName)}
                    key={get(file, 'uid') || get(file, 'fileId') || get(file, 'id') || index}
                  >
                    <FileView
                      disabled={this.props.disabled}
                      file={file}
                      index={index}
                      onRemoveFile={this.handleRemoveFile}
                    />
                  </Col>
                ))
              }
            </Row>
          </div>
        )}
      </div>
    );
  }
}


UploadFiles.propTypes = {
  colLayoutFileName: PropTypes.oneOf(Object.keys(colLayout)),
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  typesFile: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  onChange: PropTypes.func,
  showUploadList: PropTypes.bool,
  uploadText: PropTypes.string
};

UploadFiles.defaultProps = {
  colLayoutFileName: 'half',
  disabled: false,
  multiple: true,
  typesFile: VALID_FILE_TYPE.DOCUMENT,
  onChange: null,
  showUploadList: true,
  uploadText: 'Tải lên'
};
