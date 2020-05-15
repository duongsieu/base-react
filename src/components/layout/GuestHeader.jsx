import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  get,
  isFunction
} from 'lodash';
import {
  Avatar,
  Button,
  Icon,
  Layout,
  Menu,
  Typography
} from 'antd';
import classnames from 'classnames';
import {
  TITLE_APP,
  TITLE_LOGO
} from 'constants/api';
import {
  SCREEN_TYPE,
  THONG_TIN_ROUTE,
  TYPE_GUEST_MENU
} from 'constants/variables';

const { Header: HeaderAntd } = Layout;
const { Paragraph } = Typography;


class GuestHeader extends PureComponent {
  /**
   * Xử lý dữ liệu hiển thị trên menu
   * @returns {Array} Trả về một mảng chứa thông tin menu
   * @memberof GuestHeader
   */
  getDataMenu = () => {
    // Data cho menu header
    const dataMenu = [
      {
        key: 'dangNhap',
        type: TYPE_GUEST_MENU.BUTTON,
        text: 'Đăng nhập',
        iconType: 'login',
        className: 'button-menu-header',
        link: '/thong-tin',
        conditions: [{
          operator: '<>',
          originValueName: 'isAuthenticated',
          targetValue: true
        }]
      },
      {
        key: 'dangKy',
        type: TYPE_GUEST_MENU.BUTTON,
        text: 'Đăng ký',
        iconType: 'form',
        className: 'button-menu-header',
        link: '/thong-tin',
        conditions: [{
          operator: '<>',
          originValueName: 'isAuthenticated',
          targetValue: true
        }]
      }
    ];
    return dataMenu;
  }

  /**
   * Xử lý click chuyển hướng các item trên menu
   * @param {String} link Đường dẫn của các item
   * @returns {void} Điều hướng tới trang được chỉ định
   * @memberof GuestHeader
   */
  redirectTo = path => () => {
    const redirectFunc = get(this.props.history, 'push');
    if (!isFunction(redirectFunc)) {
      return;
    }
    redirectFunc(path);
  }

  /**
   * Hiển thị menu item
   * @param {Object} menuItem Data menu item
   * @returns {Node}
   * @memberof GuestHeader
   */
  renderMenuItem = (menuItem) => {
    const type = get(menuItem, 'type');
    const data = get(menuItem, 'data') || {};
    switch (type) {
      // Trường hợp menu item là link
      case TYPE_GUEST_MENU.LINK:
        return (
          <Menu.Item
            key={get(menuItem, 'key')}
            className={get(menuItem, 'className')}
            onClick={this.redirectTo(get(menuItem, 'link'))}
          >
            {get(menuItem, 'text')}
          </Menu.Item>
        );
      // Trường hợp menu item là button
      case TYPE_GUEST_MENU.BUTTON:
        return (
          <Menu.Item
            key={get(menuItem, 'key')}
            className={get(menuItem, 'className')}
            onClick={this.redirectTo(get(menuItem, 'link'))}
          >
            <Button icon={get(menuItem, 'iconType')} shape="round">
              {get(menuItem, 'text')}
            </Button>
          </Menu.Item>
        );
      // Trường hợp menu item là thông tin user
      case TYPE_GUEST_MENU.USER_INFO:
        return (
          <Menu.Item
            key={get(menuItem, 'key')}
            className={get(menuItem, 'className')}
            onClick={this.redirectTo(get(menuItem, 'link'))}
          >
            <div className="info-user-item">
              <Avatar
                alt="icon"
                className="avatar-menu-header"
                size={32}
                src={data.avatar}
              />
              <Paragraph className="name-user" ellipsis={{ rows: 1 }}>
                {data.name}
              </Paragraph>
            </div>
          </Menu.Item>
        );
      default:
        return null;
    }
  }

  render() {
    const {
      typeScreen,
      onToggleRight,
      collapsedRight
    } = this.props;
    const dataMenu = this.getDataMenu();
    // Trường hợp màn hình desktop
    if (typeScreen === SCREEN_TYPE.DESKTOP) {
      return (
        <HeaderAntd className="guest-header b-color-blue pl100 pr100">
          <div className="logo-block b-color-blue">
            <div>
              <Link to={THONG_TIN_ROUTE}>
                <img alt="Logo" className="logo-image" src="/images/logo.png" />
              </Link>
            </div>
            <div className="block-title pl15">
              <div>
                <h2 className="title-logo">{TITLE_LOGO}</h2>
              </div>
              <div>
                <h3 className="title-app bold">{TITLE_APP}</h3>
              </div>
            </div>
          </div>
          <div className="nav-menu-block b-color-blue">
            <Menu className="menu-guest-header b-color-blue" mode="horizontal">
              {dataMenu.map(menuItem => this.renderMenuItem(menuItem))}
            </Menu>
          </div>
        </HeaderAntd>
      );
    }
    // Trường hợp màn hình tablet, mobile
    return (
      <HeaderAntd className={`guest-header b-color-blue pl100 pr100 ${typeScreen}`}>
        <div className="logo-block b-color-blue">
          <div>
            <Link to={THONG_TIN_ROUTE}>
              <img alt="Logo" className="logo-image" src="/images/logo.png" />
            </Link>
          </div>
          <div className="block-title pl15">
            <div>
              <p className="title-logo">{TITLE_LOGO}</p>
            </div>
            <div>
              <p className="title-app bold">{TITLE_APP}</p>
            </div>
          </div>
        </div>
        <div className="nav-menu-block b-color-blue">
          <span
            className="icon-menu btn-menu b-color-blue mt40 font-size-30"
            onClick={() => onToggleRight()}
          />
          <div className={classnames('menu-header-responsive b-color-blue', {
            'w-0': collapsedRight
          })}
          >
            <div className="header-responsive b-color-blue ml10">
              <img
                alt="logo"
                className="img-logo"
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
              />
              <span className="title color-white">{TITLE_LOGO}</span>
              <Icon className="header-close" onClick={() => onToggleRight()} type="close" />
            </div>
            <Menu
              className="menu-guest-header b-color-blue"
              mode="vertical"
            >
              {dataMenu.map(menuItem => this.renderMenuItem(menuItem))}
            </Menu>
          </div>
        </div>
      </HeaderAntd>
    );
  }
}

GuestHeader.propTypes = {
  typeScreen: PropTypes.string.isRequired,
  onToggleRight: PropTypes.func.isRequired,
  collapsedRight: PropTypes.bool.isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

export default GuestHeader;
