import React, { Component } from 'react';
import './App.css';
import { data as searchdata } from './assets/data/giphy-search.json';
import { data as trenddata } from './assets/data/giphy-trending.json';
import SearchForm from './components/search-form';
import GifDatasetManager from './components/gif-dataset-manager';

const TRENDING_IMAGE_COUNT_DEFUALT = 9;

class App extends Component {
  state = {
    isLightboxOn: false,
    trendingImgs: [],
    searchImgs: []
  }

  selectFromTrending = (data) => {
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

  componentDidMount() {
    const trendingImgs = this.selectFromTrending(trenddata);
    this.setState({ trendingImgs });
  }

  render() {
    return (
      <main className="App">

        <SearchForm />

        <GifDatasetManager
          trends={this.state.trendingImgs}
          search={searchdata}
        />

      </main>
    );
  }
}

export default App;
