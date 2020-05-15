
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Upload } from 'antd';
import {
  compact,
  get,
  isEmpty,
  isFunction
} from 'lodash';
import messages from 'constants/messages';
import { findObjectInArray } from 'helpers';

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

let isMounted = true;

/**
 * Set isMounted
 * @param {Boolean} value
 */
const setMounted = (value = true) => {
  isMounted = value;
  return isMounted;
};

/**
 * Get isMounted
 */
const getMounted = () => isMounted;

class UploadImages extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if ('value' in props && !isEmpty(props.value) && props.value !== state.value) {
      return ({ fileList: get(props, 'value.data', []) });
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      fileList: [],
      previewVisible: false,
      previewImage: ''
    };
    setMounted(true);
  }

  componentWillUnmount() {
    setMounted(false);
  }

  /**
   * Set state properties
   * @param {Object} data The data which will be merged to this.state
   * @param {Function} callback the function which will be called after setState
   * @returns {void} Call this.setState to update state
   * @memberof UploadImages
   */
  setStateData = (state, callback) => {
    if (!getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Cancel file
   * @returns {void} Update state
   * @memberof UploadImages
   */
  handleCancel = () => this.setStateData({ previewVisible: false });

  /**
   * Preview file khi click vào xem chi tiết một hình ảnh
   * @param {Object} file
   * @returns {void} Update state: previewImage, previewVisible
   * @memberof UploadImages
   */
  handlePreview = async (file) => {
    const newFile = { ...file };
    if (!newFile.url && !newFile.preview) {
      newFile.preview = await getBase64(newFile.originFileObj);
    }
    this.setStateData({
      previewImage: newFile.url || newFile.preview,
      previewVisible: true
    });
  };

  /**
   * Cập nhật files
   * @param {Object} obj.file File được thay đổi
   * @param {Object} obj.fileList Danh sách files hiện tại
   * @returns {void} Update state: previewImage, previewVisible
   * @memberof UploadImages
   */
  handleChange = async ({ file, fileList }) => {
    const newFileList = [...fileList];
    // check type file
    const fileName = get(file, 'name', '');
    const extension = fileName.split('.').pop().toLowerCase();
    const errors = [];
    // file không hợp lệ
    if (this.props.typesFile.indexOf(extension) === -1) {
      // cập nhật errors
      const typesFileString = this.props.typesFile.join(', ');
      const invalidMessage = messages.INVALID_TYPE_FILE.replace('{types}', typesFileString);
      errors.push(new Error(invalidMessage));
      // tìm kiếm vị trí của file trong newFileList
      const indexFile = findObjectInArray({
        source: newFileList,
        key: 'uid',
        value: file.uid
      });
      // xóa file không hợp lệ khỏi fileList
      if (indexFile > -1) {
        newFileList[indexFile] = undefined;
      }
    }
    // update state
    this.setStateData({ fileList: compact(newFileList) });
    // gọi props.onChange
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        data: compact(newFileList),
        errors: compact(errors)
      });
    }
  }

  /**
   * Không sử dụng chức năng upload lên server của antd
   * @returns {Boolean} false
   * @memberof UploadImages
   */
  handleBeforeUpload = () => false

  render() {
    const UploadComponent = this.props.dragger ? Dragger : Upload;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{this.props.uploadText}</div>
      </div>
    );
    return (
      <div className="clearfix">
        <UploadComponent
          beforeUpload={this.handleBeforeUpload}
          fileList={fileList}
          listType="picture-card"
          multiple={this.props.multiple}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
        >
          {uploadButton}
        </UploadComponent>
        <Modal footer={null} onCancel={this.handleCancel} visible={previewVisible}>
          <img alt="example" src={previewImage} style={{ width: '100%' }} />
        </Modal>
      </div>
    );
  }
}

UploadImages.propTypes = {
  typesFile: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  dragger: PropTypes.bool,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  uploadText: PropTypes.string
};

UploadImages.defaultProps = {
  typesFile: ['png', 'jpg', 'jpeg'],
  dragger: true,
  multiple: true,
  onChange: null,
  uploadText: 'Chọn hình'
};

export default UploadImages;
