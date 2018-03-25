import React from 'react';
import GifView from '../gif-view';

const GifDataset = (props) => {
  return (
    <section className="gif-set">
      <header className="info">
        <h1>{props.heading}</h1>
      </header>
      <div className="viewport">
        <ul>
          {props.dataset.map(gif => {
            return (
              <li key={`gif-${gif.id}`}>
                <GifView gif={gif} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default GifDataset;
