import React from 'react';
import Viewport from '../viewport';
import './gif-dataset.css';

const GifDataset = (props) => {

  return (
    <section className="gif-dataset">
      <header className="info">
        <h1>{props.heading}</h1>
      </header>
      <Viewport
        childElems={props.gifs}
        scrollX={props.scrollX}
        onScroll={props.onViewportScroll}
      />
    </section>
  );
}

export default GifDataset;
