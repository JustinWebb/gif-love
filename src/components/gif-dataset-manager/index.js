import React from 'react';
import GifDataset from '../gif-dataset';
import './gif-dataset-manager.css';

const GifDatasetManager = (props) => {
  return (
    <div className="gif-dataset-manager">
      <GifDataset
        heading="Trending"
        dataset={props.trends}
        scrollX={true}
        onViewportScroll={props.onViewportScroll}
      />
      <GifDataset
        heading="Favorites"
        dataset={props.search}
      />
    </div>
  );
}

export default GifDatasetManager;
