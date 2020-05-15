import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  PageHeader
} from 'antd';
import {
  get
} from 'lodash';

export default class Container extends PureComponent {
  render() {
    return (
      <React.Fragment>
        {this.props.title && (
          <div className="container-heading">
            <div className="heading-page">
              <PageHeader
                extra={get(this.props.pageHeader, 'extra')}
                ghost={get(this.props.pageHeader, 'ghost')}
                onBack={get(this.props.goBack, 'onClick')}
                title={this.props.title}
              />
            </div>
          </div>
        )}
        <div className={classnames(`content-wrapper ${this.props.containerClass}`)}>
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

Container.propTypes = {
  children: PropTypes.node,
  containerClass: PropTypes.string,
  goBack: PropTypes.objectOf(PropTypes.any),
  pageHeader: PropTypes.shape({
    ghost: PropTypes.bool,
    extra: PropTypes.object
  }),
  title: PropTypes.string
};
Container.defaultProps = {
  children: '',
  containerClass: '',
  goBack: undefined,
  pageHeader: {
    ghost: true,
    extra: undefined
  },
  title: ''
};
