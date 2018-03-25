import React from 'react';
import GifDataset from '../gif-dataset'

const GifDatasetManager = (props) => {
  return (
    <div className="gif-set-manager">
      <GifDataset heading="Trending" dataset={props.trends} />
      <GifDataset heading="Favorites" dataset={props.search} />
    </div>
  );
}

export default GifDatasetManager;
