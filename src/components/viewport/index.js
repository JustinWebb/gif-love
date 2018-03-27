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

  constructor(props) {
    super(props);
    this.state = {
      flexHeight: 0
    }
    this.port = null;
  }

  getColumnCount = () => {
    const portWidth = this.port.offsetWidth;
    let numCols = null
    if (portWidth <= 419) {
      numCols = 3;
    }
    else if (portWidth > 420 && portWidth <= 600) {
      numCols = 4;
    }
    else if (portWidth > 600 && portWidth <= 808) {
      numCols = 3;
    }
    else if (portWidth > 808 && portWidth <= 1010) {
      numCols = 4;
    }
    else if (portWidth > 1010 && portWidth <= 1240) {
      numCols = 5;
    }
    else {
      numCols = 6;
    }
    return numCols;
  };

  doMasonryReflow = (evt) => {
    const list = this.port.querySelector('ul');
    const reflowPx = Array
      .from(list.childNodes)
      .reduce((acc, child) => { return acc += child.offsetHeight }, 0);
    const numCols = this.getColumnCount();
    const flexHeight = Math
      .ceil((reflowPx / numCols) + (reflowPx / (list.childElementCount + 1)));

    this.setState({ flexHeight });
  }

  componentDidMount() {
    if (!this.props.xScroll) {
      window.addEventListener('load', this.doMasonryReflow.bind(this));
      window.addEventListener('resize', this.doMasonryReflow.bind(this));
    }
  }

  componentWillUnmount() {
    if (!this.props.xScroll) {
      window.removeEventListener('load', this.doMasonryReflow);
      window.addEventListener('resize', this.doMasonryReflow);
    }
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
      <div className={klasses.join(' ')} ref={div => this.port = div}>
        <ul style={
          this.props.xScroll ? null : { maxHeight: `${this.state.flexHeight}px` }
        }>
          {listItems}
        </ul>
      </div>
    );
  };
}