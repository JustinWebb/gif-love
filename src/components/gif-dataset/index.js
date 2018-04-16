import React from 'react';
import PropTypes from 'prop-types';
import Viewport from '../viewport';
import './gif-dataset.css';

export default class GifDataset extends React.Component {

  static propTypes = {
    gifs: PropTypes.arrayOf(PropTypes.element).isRequired,
  }

  static defaultProps = {
    gifs: []
  }

  shouldComponentUpdate(prevProps, prevState) {
    const gifs = prevProps.gifs;
    return (gifs.length && gifs !== this.props.gifs) ? true : false;
  }

  render() {
    return (
      <section className="gif-dataset">
        <header className="info">
          <h1>{this.props.heading}</h1>
        </header>
        <Viewport
          childElems={this.props.gifs}
          scrollX={this.props.scrollX}
          onScroll={this.props.onViewportScroll}
        />
      </section>
    );
  }
}

