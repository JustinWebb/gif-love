import React from 'react';
import GifView from '../gif-view';
import Viewport from '../viewport';
import './gif-dataset.css';

const GifDataset = (props) => {
  let gifs = [];
  if (props.dataset.length) {
    // Create list of views
    gifs = props.dataset.map(gif => <GifView gif={gif} />);
  }
  return (
    <section className="gif-dataset">
      <header className="info">
        <h1>{props.heading}</h1>
      </header>
      <Viewport
        childElems={gifs}
        scrollX={props.scrollX}
        onScroll={props.onViewportScroll}
      />
    </section>
  );
}

export default GifDataset;
