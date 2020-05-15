import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  Icon
} from 'antd';
import {
  get,
  isEmpty,
  isFunction
} from 'lodash';

export default function headingTab(props) {
  const { data, onClick, activeKey } = props;
  if (isEmpty(data)) {
    return null;
  }
  const handleClickTab = tab => () => {
    if (!isFunction(onClick)) {
      return;
    }
    onClick(tab);
  };
  const getTabItem = (tab, index) => {
    let icon = null;
    const iconClass = get(tab, 'iconClass');
    const iconType = get(tab, 'iconType');
    if (iconClass) {
      icon = (<span className={`icon pr10 ${iconClass}`} />);
    }
    if (iconType) {
      icon = (<Icon className={`icon-antd pr10 ${iconClass}`} type={iconType} />);
    }
    return (
      <div
        key={index}
        className={classnames('heading-tab-item', {
          active: get(tab, 'key') === activeKey
        })}
        onClick={handleClickTab(tab)}
      >
        {icon}
        <span className="name">{get(tab, 'name')}</span>
      </div>
    );
  };
  const headingTabContent = (tab, index) => {
    if (index === data.length - 1) {
      return getTabItem(tab, index);
    }
    return (
      <React.Fragment key={index}>
        {getTabItem(tab)}
        <span className="heading-tab-seperator" />
      </React.Fragment>
    );
  };
  return (
    <div className="heading-tab md-flex-column">
      {data.map((tab, index) => headingTabContent(tab, index))}
    </div>
  );
}

headingTab.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired,
  activeKey: PropTypes.string
};
headingTab.defaultProps = {
  activeKey: null
};

headingTab.displayName = 'HeadingTab';
