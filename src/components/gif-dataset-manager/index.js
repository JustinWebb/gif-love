import React from 'react';
import GifDataset from '../gif-dataset';
import GifView from '../gif-view';
import { parseGiphyVO } from '../../api/giphy-parser';
import './gif-dataset-manager.css';

const REQ_VIEW_SEARCH = 'search';
const REQ_VIEW_FAVORITES = 'favorites';
const CACHE_KEY_DELIM = '-@';

export default class GifDatasetManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchViews: [],
      favoritesViews: [],
    };

    this.cache = {};
  }

  onGifLoaded = (e, key) => {
    this.cache[key] = true;
  }

  getViews = (nextProps, reqType) => {
    const giphy = nextProps[reqType];
    return giphy.map(gif => {
      const key = [gif.id, parseGiphyVO(gif).filename, reqType].join(CACHE_KEY_DELIM);
      const loader = (this.cache[key] === undefined)
        ? this.onGifLoaded
        : null;
      return <GifView gif={gif} reqKey={key} loader={loader} itemHandler={this.props.itemHandler} />;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.search !== nextProps.search) {
      this.setState({
        searchViews: this.getViews(nextProps, REQ_VIEW_SEARCH)
      });
    }
    if (this.props.favorites !== nextProps.favorites) {
      this.setState({
        favoritesViews: this.getViews(nextProps, REQ_VIEW_FAVORITES)
      });
    }
  }

  shouldComponentUpdate(prevProps, prevState) {
    const search = prevProps.search;
    const favorites = prevProps.favorites;
    const isSearchDirty = (search.length && search !== this.props.search) ? true : false;
    const isFavoritesDirty = (favorites.length && favorites !== this.props.favorites) ? true : false;

    return (isSearchDirty || isFavoritesDirty) ? true : false;
  }

  render() {
    return (
      <div className="gif-dataset-manager">
        <GifDataset
          gifs={this.state.favoritesViews}
          heading="Favorites"
          scrollX={true}
          onViewportScroll={this.props.onViewportScroll}
        />
        <GifDataset
          gifs={this.state.searchViews}
          heading={this.props.sectionTitle}
        />
      </div>
    );
  }
}


