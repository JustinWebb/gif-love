import React from 'react';
import GifDataset from '../gif-dataset';
import './gif-dataset-manager.css';

const GifDatasetManager = (props) => {
  return (
    <div className="gif-dataset-manager">
      <GifDataset
        heading="Trending"
        dataset={props.trends}
        horizontalScroll={true}
      />
      <GifDataset
        heading="Favorites"
        dataset={props.search}
      />
    </div>
  );
}

export default GifDatasetManager;
