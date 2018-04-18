import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';
import MobileDetect from 'mobile-detect';
import { debounce } from 'lodash';
import './viewport.css';

const VIEWPORT = 'viewport';
const VIEWPORT_SCROLL_Y = 'scroll-y';
const VIEWPORT_SCROLL_X = 'scroll-x';
const RESIZE_OBSERVER_DEBOUNCE_RATE = 264;

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
    this.mobileDetect = null;
    this.resizeObserver = null;
    this.isFlexReady = true;
  }

  onMasonryReflow = (e) => {
    console.log('onMasonryReflow', e.type);

    // Debounce (No need to run if presently running)
    if (this.state.reflowInterval) {
      cancelAnimationFrame(this.state.reflowInterval);
    }
    // Queue next resize for browser repaint
    this.setState({
      reflowInterval: requestAnimationFrame(this.handleMasonryReflow),
    });
  }

  handleMasonryReflow = () => {
    const list = this.port.childNodes[0];
    const reflowPx = Array
      .from(list.childNodes)
      .reduce((acc, child) => { return acc += child.offsetHeight }, 0);
    const numCols = this.getColumnCount();
    const flexHeight = Math
      .ceil((reflowPx / numCols) + (reflowPx / (list.childElementCount + 1)));
    console.log('reflowing\tcol:' + numCols + ', fh: ' + flexHeight, this.port.childNodes[0]);
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

  attachResizeObserver = () => {
    this.resizeObserver = (window.ResizeObserver !== undefined)
      ? new window.ResizeObserver(this.updateMasonry)
      : new ResizeObserver(this.updateMasonry);
    this.resizeObserver.observe(this.port.childNodes[0]);
  }

  onMobileOrientationChange = (e) => {
    this.isFlexReady = true;
  }

  updateMasonry = debounce((entries, observer) => {
    if (this.isFlexReady) {
      this.handleMasonryReflow();
    }
  }, RESIZE_OBSERVER_DEBOUNCE_RATE, { trailing: true });

  onPortScroll = (e) => {
    const scrollX = this.props.scrollX;
    const xMax = e.target.scrollWidth - e.target.offsetWidth;

    if (e.target.scrollLeft <= 0 || e.target.scrollLeft >= xMax) {

    }

    if (this.props.onScroll) {
      this.props.onScroll(e, { scrollX });
    }
  };

  componentWillMount() {
    this.mobileDetect = new MobileDetect(window.navigator.userAgent);
  }

  componentDidMount() {
    if (this.port) {
      this.port.addEventListener('scroll', this.onPortScroll, true);
    }

    if (!this.props.scrollX) {
      window.addEventListener('load', this.onMasonryReflow, false);

      // Setup dynamic masonry effect event handling
      if (this.mobileDetect.mobile() !== null) {
        // Mobile devices resize elements as the URL bar toggles
        // visibility on scroll events. This behavior forces 
        // property changes that interfere with the masonry
        // algorithm. It is best to update masonry passively
        // with ResizeObserver after mobile does its thing.
        window.addEventListener('load', this.attachResizeObserver, false);
        window.addEventListener('orientationchange', this.onMobileOrientationChange, false);
        // ResizeObserver determines when ready from here on.
        this.isFlexReady = false;
      } else {
        window.addEventListener('resize', this.onMasonryReflow, false);
        window.addEventListener('orientationchange', this.onMasonryReflow, false);
      }
    }
  }

  componentWillUnmount() {
    if (this.port) {
      this.port.removeEventListener('scroll', this.onPortScroll, true);
    }
    window.removeEventListener('load', this.onMasonryReflow, false);
    window.removeEventListener('resize', this.onMasonryReflow, false);
    window.removeEventListener('orientationchange', this.onMasonryReflow, false);
    window.removeEventListener('load', this.attachResizeObserver, false);
    window.removeEventListener('orientationchange', this.onMobileOrientationChange, false);

    this.updateMasonry.cancel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.childElems !== nextProps.childElems) {
      return true;
    } else if (!this.props.scrollX) {
      const fh = this.state.flexHeight;
      return (fh !== 0 && fh === nextState.flexHeight) ? false : true;
    }
  }

  render() {
    const klasses = [VIEWPORT];
    const flexHeight = this.state.flexHeight;
    const listStyle = this.props.scrollX
      ? null
      : { maxHeight: (flexHeight ? `${flexHeight}px` : null) }

    let listItems = null;
    if (this.props.childElems.length) {
      listItems = this.props.childElems.map(elem => <li key={uuid()}>{elem}</li>);
      // Set scrolling behaviors
      klasses.push((this.props.scrollX) ? VIEWPORT_SCROLL_X : VIEWPORT_SCROLL_Y);
    }

    return (
      <div className={klasses.join(' ')} ref={div => this.port = div}>
        <ul style={listStyle}>
          {listItems}
        </ul>
      </div>
    );
  };
}
