import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';
import classnames from 'classnames';
import {
  GuestFooter,
  GuestHeader
} from 'components/layout';
import {
  SCREEN_TYPE,
  SCREEN_WIDTH
} from 'constants/variables';

const { Content } = Layout;

class GuestLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: window.innerWidth,
      collapsedLeft: window.innerWidth < SCREEN_WIDTH.DESKTOP,
      collapsedRight: true
    };
    this.mounted = true;
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    this.setMounted(false);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof GuestLayout
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof GuestLayout
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof GuestLayout
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  /**
   * Toogle left sidebar
   * @returns {void} Cập nhật state.collapsedLeft
   * @memberof GuestLayout
   */
  toggleLeft = () => {
    this.setStateData(prevState => ({
      collapsedLeft: !prevState.collapsedLeft,
      collapsedRight: true
    }));
  };

  /**
   * Toogle right menu user
   * @returns {void} Cập nhật state.collapsedRight
   * @memberof GuestLayout
   */
  toggleRight = () => {
    this.setStateData(prevState => ({
      collapsedRight: !prevState.collapsedRight,
      collapsedLeft: true
    }));
  };

  /**
   * Thực hiện resize
   * @returns {void} Cập nhật state.screenWidth và state.collapsedLeft
   * @memberof GuestLayout
   */
  updateWindowDimensions = () => {
    this.setStateData({
      screenWidth: window.innerWidth,
      collapsedLeft: window.innerWidth < SCREEN_WIDTH.DESKTOP
    });
  }

  /**
   * Lấy giá trị screen type
   * @param {Number} screenWidth Screen width
   * @returns {String} Screen type nằm trong SCREEN_WIDTH
   * @memberof GuestLayout
   */
  getTypeScreen = (screenWidth) => {
    if (screenWidth >= SCREEN_WIDTH.TABLET) {
      return SCREEN_TYPE.DESKTOP;
    }
    if (screenWidth < SCREEN_WIDTH.TABLET && screenWidth > SCREEN_WIDTH.MOBILE) {
      return SCREEN_TYPE.TABLET;
    }
    return SCREEN_TYPE.MOBILE;
  }

  render() {
    return (
      <Layout
        className={classnames('layout-container', {
          'closed-sidebar': this.state.collapsedLeft
        })}
      >
        <GuestHeader
          collapsedRight={this.state.collapsedRight}
          history={this.props.history}
          onToggleRight={this.toggleRight}
          typeScreen={this.getTypeScreen(this.state.screenWidth)}
        />
        <Layout>
          <Content
            className="container-content b-color-white"
          >
            {this.props.children}
          </Content>
        </Layout>
        <GuestFooter />
      </Layout>
    );
  }
}

GuestLayout.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default GuestLayout;
