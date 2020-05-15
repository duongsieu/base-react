import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { saveAs } from 'file-saver';
import {
  Icon,
  Tooltip,
  Typography
} from 'antd';
import {
  get,
  isEmpty,
  isFunction
} from 'lodash';
import {
  alertError,
  convertModelFile,
  getIconClassNameFile,
  getIconTypeFile,
  hasErrorResponseAPI,
  throwError
} from 'helpers';
import messages from 'constants/messages';

const { Paragraph } = Typography;

class FileView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  componentWillUnmount() {
    // Set mounted
    this.setMounted(false);
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof FileView
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof FileView
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof FileView
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Kiểm tra điều kiện có thể download
   * @returns {Boolean}
   * @memberof FileView
   */
  isCanDownload = () => {
    const fileId = get(this.props.file, 'fileId') || get(this.props.file, 'id');
    if (fileId) {
      return true;
    }
    return false;
  }

  /**
   * Kiểm tra điều kiện có thể remove file
   * @returns {Boolean}
   * @memberof FileView
   */
  isCanRemove = () => isFunction(this.props.onRemoveFile) && !this.props.disabled

  /**
   * Tải file
   * @returns {void} Gọi API tải file theo fileId
   * @memberof FileView
   */
  download = async () => {
    try {
      // Exit nếu đang tải file hoặc không thể tải file
      if (this.state.loading || !this.isCanDownload()) {
        return;
      }
      // Bắt đầu loading
      await this.setStateData({ loading: true });
      const file = convertModelFile(this.props.file);
      // Chuẩn bị dữ liệu đầu vào
      const fileName = get(file, 'originalName');
      const fileId = get(file, 'id');
      // Gọi API tải file
      let request = null;
      // Sử dụng request API từ props (nếu có)
      if (isFunction(this.props.requestAPI)) {
        request = this.props.requestAPI;
      }
      const response = await request(fileId);
      // Kiểm tra kết quả tải file có thành công hay không
      if (hasErrorResponseAPI(response)) {
        throwError(get(response, 'error', messages.ERROR_SYSTEM));
      }
      // Tiến hành lưu file
      await saveAs(get(response, 'payload'), fileName);
    } catch (error) {
      // Thông báo message khi tải file không thành công
      alertError(messages.ERROR_SYSTEM);
    } finally {
      // Kết thúc loading
      this.setStateData({ loading: false });
    }
  }

  /**
   * Get data hiển thị file
   * @returns {Object} Trả các properties {[className], [iconType], [name]}
   * @memberof FileView
   */
  getData = () => {
    const file = convertModelFile(this.props.file);
    // Lấy tên từ props.fileName hoặc tên file ban đầu hoặc tên file
    const name = this.props.fileName || get(file, 'originalName') || get(file, 'name');
    const iconType = getIconTypeFile(get(file, 'originalName') || get(file, 'name'));
    const className = getIconClassNameFile(iconType);
    return {
      className,
      iconType,
      name
    };
  }

  render() {
    if (isEmpty(this.props.file)) {
      return null;
    }
    const content = (
      <Paragraph className={`b-file-view mb0 ${this.props.className}`} ellipsis={this.props.ellipsis}>
        {this.state.loading ? (
          <Icon className="icon-medium mr5" type="loading" />
        ) : (
          <Icon
            className={`icon-medium mr5 ${this.getData().className}`}
            onClick={this.download}
            theme="filled"
            type={this.getData().iconType}
          />
        )}
        <span className="name" onClick={this.download}>{this.getData().name}</span>
        {this.isCanRemove() && (
          <span
            className="icon-small icon-xoa m5 color-red"
            onClick={this.props.onRemoveFile(this.props.file, this.props.index)}
          />
        )}
      </Paragraph>
    );
    if (this.props.showTooltip && this.isCanDownload()) {
      return (
        <Tooltip placement="topLeft" title={this.props.tooltipTitle}>
          {content}
        </Tooltip>
      );
    }
    return content;
  }
}

FileView.propTypes = {
  actions: PropTypes.objectOf(PropTypes.any).isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  ellipsis: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ]),
  file: PropTypes.objectOf(PropTypes.any),
  fileName: PropTypes.string,
  index: PropTypes.number,
  onRemoveFile: PropTypes.func,
  requestAPI: PropTypes.func,
  showTooltip: PropTypes.bool,
  tooltipTitle: PropTypes.string
};

FileView.defaultProps = {
  className: '',
  disabled: false,
  ellipsis: false,
  file: null,
  fileName: '',
  index: null,
  onRemoveFile: null,
  requestAPI: null,
  showTooltip: true,
  tooltipTitle: 'Click để tải file'
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
  }, dispatch)
});

export default connect(
  null,
  mapDispatchToProps
)(FileView);
