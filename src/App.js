import React, { Component } from 'react';
import './App.css';
import { data as searchdata } from './assets/data/giphy-search.json';
import { data as favoritesdata } from './assets/data/giphy-trending.json';
import SearchForm from './components/search-form';
import GifDatasetManager from './components/gif-dataset-manager';

const TRENDING_IMAGE_COUNT_DEFUALT = 9;

class App extends Component {
  state = {
    isLightboxOn: false,
    searchImgs: [],
    favoriteImgs: [],
  }

  selectFromFavorites = (data) => {
    const randImgs = [];
    if (Array.isArray(data) && data.length) {
      let imgCount = (data.length >= TRENDING_IMAGE_COUNT_DEFUALT)
        ? TRENDING_IMAGE_COUNT_DEFUALT
        : data.length;
      let countCache = {};

      // Get random, unique images from the trending data
      while (imgCount > 0) {
        let idx = Math.floor((Math.random() * data.length - 1) + 1);
        if (countCache[idx] === undefined) {
          randImgs.push(data[idx]);
          countCache[idx] = true;
          imgCount--;
        }
      }
    }
    return randImgs;
  }

  handleViewportScroll = (evt, data) => {
    if (data.scrollX) {
      console.log('wtf', evt.type, data);
    }
  }

  componentDidMount() {
    const searchImgs = searchdata;
    const favoriteImgs = this.selectFromFavorites(favoritesdata);
    this.setState({ searchImgs, favoriteImgs });
  }

  render() {
    return (
      <main className="App">

        <header className="app-header">
          <SearchForm />
        </header>

        <div className="app-content">
          <GifDatasetManager
            search={this.state.searchImgs}
            favorites={this.state.favoriteImgs}
            onViewportScroll={this.handleViewportScroll}
          />
        </div>

      </main>
    );
  }
}

export default App;
