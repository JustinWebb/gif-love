import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import './viewport.css';

const VIEWPORT = 'viewport';
const VIEWPORT_SCROLL_Y = 'scroll-y';
const VIEWPORT_SCROLL_X = 'scroll-x';

export default class Viewport extends React.Component {

  static propTypes = {
    childElems: PropTypes.arrayOf(PropTypes.element).isRequired,
    xScroll: PropTypes.bool
  }

  render() {
    const klasses = [VIEWPORT];
    let listItems = null;

    if (this.props.childElems.length) {
      listItems = this.props.childElems.map(elem => <li key={uuid()}>{elem}</li>);
      // Set scrolling behaviors
      klasses.push((this.props.xScroll) ? VIEWPORT_SCROLL_X : VIEWPORT_SCROLL_Y);
    }

    return (
      <div className={klasses.join(' ')}>
        <ul>
          {listItems}
        </ul>
      </div>
    );
  };
}