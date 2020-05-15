
import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Upload
} from 'antd';
import {
  compact,
  get,
  isFunction,
  isString
} from 'lodash';
import {
} from 'components/common';
import messages from 'constants/messages';
import {
  MAX_SIZE_FILE,
  STRING_FORMAT,
  VALID_FILE_TYPE
} from 'constants/variables';
import {
  getReplaceString,
  isValidSize,
  isValidType
} from 'helpers';

function getBase64(file) {
  if (!file) {
    return null;
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/**
 * Lấy data từ props
 * @param {Object} props
 * @returns {Object} { file, image }
 * @memberof UploadAvatar
 */
async function getDataFromProps(props) {
  const value = get(props, 'value');
  const file = get(props, 'value.data', null);
  const image = isString(file) ? file : await getBase64(file);
  return ({ file, image, value });
}

export default class UploadAvatar extends React.Component {
  constructor(props) {
    super(props);
    const { value } = props;
    const file = get(value, 'data');
    const image = isString(file) ? file : props.defaultImage;
    this.state = {
      image,
      value
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  async componentDidUpdate(prevProps) {
    if (this.state.value !== this.props.value) {
      const { file, image, value } = await getDataFromProps(this.props);
      this.setStateData({ file, image, value });
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
   * @memberof UploadAvatar
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof UploadAvatar
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof UploadAvatar
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Thay đổi file
   * @param {Object} info Thông tin file lấy từ component [Upload] của antd
   * @returns {void} Kiểm tra file có hợp lệ không, cập nhật file, image, errors
   * @memberof UploadAvatar
   */
  handleChange = async (info) => {
    let { file } = info;
    let image = await getBase64(file);
    const errors = [];
    // Kiểm tra file có hợp lệ không
    const hasError = !isValidSize(file, MAX_SIZE_FILE.AVATAR) || !isValidType(file, this.props.typesFile);
    if (hasError) {
      const typesFileString = this.props.typesFile.join(', ').toUpperCase();
      const invalidMessage = getReplaceString(messages.INVALID_FILE, [
        {
          format: STRING_FORMAT.SIZE,
          value: MAX_SIZE_FILE.AVATAR
        },
        {
          format: STRING_FORMAT.TYPE,
          value: typesFileString
        }
      ]);
      // cập nhật errors
      errors.push(new Error(invalidMessage));
      ({ file, image } = this.state);
    }
    // Giữ lại giá trị cũ
    if (this.props.shouldKeepOldIfUploadError) {
      file = file || image;
    }
    // update state
    this.setStateData({ image, file });
    // gọi props.onChange
    if (isFunction(this.props.onChange)) {
      this.props.onChange({
        data: file,
        errors: compact(errors)
      });
    }
  };

  /**
   * Không sử dụng chức năng upload lên server của antd
   * @returns {Boolean} false
   * @memberof UploadAvatar
   */
  handleBeforeUpload = () => false

  render() {
    const { image } = this.state;
    return (
      <div className="b-avatar-upload">
        <Avatar alt="avatar" icon={this.props.icon} size={this.props.sizeAvatar} src={image} />
        <Upload
          beforeUpload={this.handleBeforeUpload}
          className="avatar-uploader"
          name="avatar"
          onChange={this.handleChange}
          showUploadList={false}
        >
          <div className="b-btn-upload">
            <Button
              className="btn-normal btn-upload"
              size="large"
            >
              <div className="content-btn">
                <span className="icon icon-chon-tai-lieu" />
                <span className="name">{this.props.uploadText}</span>
              </div>
            </Button>
          </div>
        </Upload>
      </div>
    );
  }
}

UploadAvatar.propTypes = {
  typesFile: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line react/require-default-props
  value: PropTypes.any,
  onChange: PropTypes.func,
  uploadText: PropTypes.string,
  defaultImage: PropTypes.string,
  icon: PropTypes.string,
  sizeAvatar: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  // Giữ lại giá trị cũ khi upload lỗi
  shouldKeepOldIfUploadError: PropTypes.bool
};

UploadAvatar.defaultProps = {
  typesFile: VALID_FILE_TYPE.AVATAR,
  defaultImage: null,
  icon: 'user',
  onChange: null,
  uploadText: 'Cập nhật ảnh',
  sizeAvatar: 120,
  shouldKeepOldIfUploadError: false
};
