import React, { Component } from 'react';
import './App.css';
import { data as searchdata } from './assets/data/giphy-search.json';
import { data as favoritesdata } from './assets/data/giphy-trending.json';
import SearchForm from './components/search-form';
import GifDatasetManager from './components/gif-dataset-manager';
import MobileDetect from 'mobile-detect';

const TRENDING_IMAGE_COUNT_DEFUALT = 9;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchImgs: [],
      favoriteImgs: [],
      isForcedHeader: false,
      isLightboxOn: false,
    };

    this.mobileDevice = null;
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

  onContentScroll = (e) => {
    this.handleViewportScroll(e, { scrollX: false });
  }

  toggleForcedHeader = (scrollTop, maxDist) => {
    if (scrollTop === 0 && this.state.isForcedHeader) {
      this.setState({ isForcedHeader: !this.state.isForcedHeader });
    } else if (scrollTop === maxDist && !this.state.isForcedHeader) {
      this.setState({ isForcedHeader: !this.state.isForcedHeader });
    }
  }

  handleViewportScroll = (e, data) => {
    if (data.scrollX) {
    } else {
      const content = e.target.getBoundingClientRect();
      const reel = e.target.firstChild.getBoundingClientRect();
      const xPad = ['top', 'bottom'].reduce((acc, prop) => {
        return acc += Number(window
          .getComputedStyle(e.target, null)
          .getPropertyValue('padding-' + prop)
          .replace(/[a-z]/gi, ''));
      }, 0);
      const maxDist = (reel.height + xPad) - content.height;

      if (this.mobileDevice) {
        this.toggleForcedHeader(e.target.scrollTop, maxDist);
      }
    }
  }

  componentWillMount() {
    this.mobileDevice = new MobileDetect(window.navigator.userAgent).mobile();
  }

  componentDidMount() {
    const searchImgs = searchdata;
    const favoriteImgs = this.selectFromFavorites(favoritesdata);
    this.setState({ searchImgs, favoriteImgs });
  }

  render() {
    const klasses = ['App'];

    if (this.state.isForcedHeader) {
      klasses.push('fixed-header');
    }

    return (
      <main className={klasses.join(' ')}>

        <header className="app-header">
          <SearchForm />
        </header>

        <div className="app-content" onScroll={this.onContentScroll}>
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
