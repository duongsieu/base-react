import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container
} from 'components/common';
import { get, isFunction } from 'lodash';

export default class PageExample1 extends Component {
  constructor(props) {
    super(props);
    // Kiểm tra component có đang được "mounted"
    this.mounted = true;
  }

  componentWillUnmount() {
    // set mounted
    this.setMounted(false);
    // cancel API
  }

  /**
   * Set mounted
   * @param {Boolean} value
   * @returns {Boolean}
   * @memberof PageExample1
  */
  setMounted = (value = true) => {
    this.mounted = value;
    return this.mounted;
  }

  /**
   * Get mounted
   * @returns {Boolean}
   * @memberof PageExample1
   */
  getMounted = () => this.mounted

  /**
   * Set state properties
   * @param {Object} data the data input
   * @param {Function} callback the function which will be called after setState
   * @returns {void} call this.setState to update state
   * @memberof PageExample1
   */
  setStateData = (state, callback) => {
    if (!this.getMounted()) {
      return;
    }
    this.setState(state, callback);
  }

  goBackExample = () => {
    const goBack = get(this.props.history, 'push');
    if (!isFunction(goBack)) {
      return;
    }
    goBack('/');
  }

  render() {
    return (
      <Container
        goBack={{
          onClick: this.goBackExample
        }}
        title="Title"
      >
        <div
          style={{
            width: '100%',
            minHeight: '300px',
            textAlign: 'center'
          }}
        >
          <h1 style={{ padding: '50px 0 20px', fontWeight: 600, fontSize: '18px' }}>This is the example page</h1>
          <p style={{ padding: '20px', color: 'darkviolet' }}>
            Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
            Cras sagittis. Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc.
            Phasellus gravida semper nisi. Phasellus gravida semper nisi.
            Nullam sagittis. Suspendisse eu ligula. Vestibulum fringilla pede sit amet augue.
            Ut non enim eleifend felis pretium feugiat. Praesent egestas tristique nibh.
          </p>
        </div>
      </Container>
    );
  }
}

PageExample1.propTypes = {
  history: PropTypes.objectOf(PropTypes.any).isRequired
};

PageExample1.displayName = 'PageExample1';
