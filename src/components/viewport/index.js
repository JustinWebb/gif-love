import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';
import MobileDetect from 'mobile-detect';
import './viewport.css';

const VIEWPORT = 'viewport';
const VIEWPORT_SCROLL_Y = 'scroll-y';
const VIEWPORT_SCROLL_X = 'scroll-x';
const DEBUG_COLORED = 'debug-colored'


export default class Viewport extends React.Component {

  static propTypes = {
    childElems: PropTypes.arrayOf(PropTypes.element).isRequired,
    scrollX: PropTypes.bool,
    onScroll: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      flexHeight: 0,
      reflowInterval: null,
    }
    this.port = null;
    this.resizeObserver = null
  }

  onMasonryReflow = (e) => {
    console.log('onMasonryReflow', e.type);

    // Debounce (No need to run if presently running)
    if (this.state.reflowInterval) {
      cancelAnimationFrame(this.state.reflowInterval);
    }
    // Queue next resize for browser repaint
    this.setState({
      reflowInterval: requestAnimationFrame(this.handleMasonryReflow)
    });
  }

  handleObserverResize = (entries) => {
    const flexHeight = entries[0].contentRect.height;
    console.log('handleObserverResize', flexHeight);
    this.handleMasonryReflow(flexHeight);
  }

  handleMasonryReflow = (explicitHeight) => {
    const list = this.port.childNodes[0];
    const reflowPx = Array
      .from(list.childNodes)
      .reduce((acc, child) => { return acc += child.offsetHeight }, 0);
    const numCols = this.getColumnCount();
    const flexHeight = Math
      .ceil((reflowPx / numCols) + (reflowPx / (list.childElementCount + 1)));
    console.log('reflowing\tcol:' + numCols, ', fh: ' + flexHeight + '\n\n');
    this.setState({ flexHeight });
  }

  getColumnCount = () => {
    const portWidth = this.port.offsetWidth;
    let numCols = null;

    if (portWidth <= 419) {
      numCols = 3;
    }
    else if (portWidth > 420 && portWidth <= 730) {
      numCols = 4;
    }
    else if (portWidth > 731 && portWidth <= 808) {
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

  onPortScroll = (e) => {
    const scrollX = this.props.scrollX;
    const xMax = e.target.scrollWidth - e.target.offsetWidth;

    if (e.target.scrollLeft <= 0 || e.target.scrollLeft >= xMax) {

    }

    if (this.props.onScroll) {
      this.props.onScroll(e, { scrollX });
    }
  };

  componentDidMount() {
    if (this.port) {
      this.port.addEventListener('scroll', this.onPortScroll, true);
    }

    if (!this.props.scrollX) {
      window.addEventListener('load', this.onMasonryReflow, false);
      window.addEventListener('resize', this.onMasonryReflow, false);
      window.addEventListener('orientationchange', this.onMasonryReflow, false);
    }

    if (!this.props.scrollX && this.port) {
      const md = new MobileDetect(window.navigator.userAgent);
      if (md.mobile()) {
        this.resizeObserver = (window.ResizeObserver !== undefined)
          ? new window.ResizeObserver(this.handleObserverResize.bind(this))
          : new ResizeObserver(this.handleObserverResize.bind(this))
        this.resizeObserver.observe(this.port);
      }
    }
  }

  componentWillUnmount() {
    if (this.port) {
      this.port.removeEventListener('scroll', this.onPortScroll, true);
    }

    if (!this.props.scrollX) {
      window.removeEventListener('load', this.onMasonryReflow, false);
      window.removeEventListener('resize', this.onMasonryReflow, false);
      window.removeEventListener('orientationchange', this.onMasonryReflow, false);
    }
  }

  render() {
    const klasses = [VIEWPORT];
    let listItems = null;

    if (this.props.childElems.length) {
      listItems = this.props.childElems.map(elem => <li key={uuid()}>{elem}</li>);
      // Set scrolling behaviors
      klasses.push((this.props.scrollX) ? VIEWPORT_SCROLL_X : VIEWPORT_SCROLL_Y);
    }

    if (this.resizeObserver) {
      klasses.push(DEBUG_COLORED);
    }

    return (
      <div className="foo">
        <span>{`${this.state.flexHeight}px`}</span>
        <div className={klasses.join(' ')} ref={div => this.port = div}>
          <ul style={
            this.props.scrollX ? null : { maxHeight: `${this.state.flexHeight}px` }
          }>
            {listItems}
          </ul>
        </div>
      </div>
    );
  };
}
