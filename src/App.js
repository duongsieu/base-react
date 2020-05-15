import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ConfigProvider } from 'antd';
import viVN from 'antd/lib/locale-provider/vi_VN';
import 'react-quill/dist/quill.snow.css';
import 'moment/locale/vi';
import QueryString from 'query-string';
import { camelizeKeys } from 'humps';
import {
  get,
  isEmpty
} from 'lodash';
import { RenderRoutes } from 'routes';
import 'app.less';
import 'assets/style/main.css';
import {
  alertError,
  throwError
} from 'helpers';
import {
  LoadingWrapper
} from 'components/common';
import messages from 'constants/messages';
import {
  ALLOWED_ACCESS_ROUTE_FROM_EXTERNAL,
  CUSTOM_ERROR,
  HOME_ROUTE
} from 'constants/variables';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
    this.mounted = true;
  }

  async componentDidMount() {
    // Khởi tạo
    await this.initialLoad();
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof Login
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof Login
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof Login
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Khởi tạo APP
   * Get data ban đầu
   * @returns {void}
   * @memberof App
   */
  initialLoad = async () => {
    try {
      // Đường dẫn sẽ được điều hướng sau khi load thông tin người dùng thành công
      let path = get(this.props.history, 'location.pathname') || HOME_ROUTE;
      // Query params
      const search = get(this.props.history, 'location.search');
      const queryParams = QueryString.parse(search);
      const errorTypeFromQueryParams = get(queryParams, CUSTOM_ERROR.FIELD_NAME.TYPE);
      // Nếu tồn tại lỗi trên query params
      if (!isEmpty(errorTypeFromQueryParams)) {
        const errorData = {
          data: queryParams
        };
        throwError(errorData);
      }
      // Kiểm tra route sẽ được điều hướng có nằm trong danh sách cho phép không
      const expectPath = get(this.props.history, 'location.pathname');
      const isValidPath = ALLOWED_ACCESS_ROUTE_FROM_EXTERNAL.includes(expectPath);
      // Nếu route hợp lệ thì set giá trị cho path
      if (isValidPath) {
        path = expectPath;
      }
      await this.props.history.push({
        pathname: path
      });
    } catch (error) {
      this.handleErrorResponse(error);
    } finally {
      this.setStateData({ loading: false });
    }
  }

  /**
   * Xử lý response error
   * @param {Object} error Response error
   * @returns {void}
   * @memberof App
   */
  handleErrorResponse = async (error = null) => {
    // Hiển thị message
    const customError = camelizeKeys(error);
    const errorTypes = CUSTOM_ERROR.TYPE_ERROR.AUTH;
    const errorType = get(customError, `data.${CUSTOM_ERROR.FIELD_NAME.TYPE}`);
    const errorMessage = get(customError, `data.${CUSTOM_ERROR.FIELD_NAME.MESSAGE}`);
    const shouldUseCustomMessage = errorTypes.includes(errorType);
    const message = shouldUseCustomMessage ? errorMessage : messages.AUTH_FAILED;
    // Thông báo message (từ API/default) khi xóa không thành công
    alertError(message);
  }

  render() {
    return (
      <LoadingWrapper loading={this.state.loading || this.props.loadingApp}>
        <ConfigProvider locale={viVN}>
          <RenderRoutes history={this.props.history} routes={this.props.routes} />
        </ConfigProvider>
      </LoadingWrapper>
    );
  }
}

App.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.any).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  loadingApp: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loadingApp: state.common.loadingApp,
  shouldLoadInitialComboboxs: state.common.shouldLoadInitialComboboxs
});


export default connect(
  mapStateToProps,
  null
)(App);
