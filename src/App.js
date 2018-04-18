import React, { Component } from 'react';
import './App.css';
import { data as favoritesdata } from './assets/data/giphy-trending.json';
import SearchForm from './components/search-form';
import GifDatasetManager from './components/gif-dataset-manager';
import MobileDetect from 'mobile-detect';
import GiphyService from './api/giphy-service';
import Lightbox from './components/lightbox';

const TRENDING_IMAGE_COUNT_DEFUALT = 9;
const SECTION_TITLE_SEARCH = 'Search Results';
const SECTION_TITLE_TRENDING = 'What\'s Trending';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchImgs: [],
      favoriteImgs: [],
      isForcedHeader: false,
      selectedGif: null,
      sectionTitle: SECTION_TITLE_TRENDING,
    };

    this.mobileDevice = null;
  }

  onContentScroll = (e) => {
    this.handleViewportScroll(e, { scrollX: false });
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

  sendQuery = (data) => {
    GiphyService.sendQuery(data.query)
      .then(json => {
        console.log('data', json)
        this.setState({ searchImgs: json.data, sectionTitle: SECTION_TITLE_SEARCH });
      });
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

  toggleLightbox = (gif) => {
    console.log('toggleLightbox', gif);
    this.setState(nextState => {
      return { selectedGif: gif };
    });
  }

  componentWillMount() {
    this.mobileDevice = new MobileDetect(window.navigator.userAgent).mobile();
  }

  componentDidMount() {
    const favoriteImgs = this.selectFromFavorites(favoritesdata);
    this.setState({ favoriteImgs });

    GiphyService.sendQuery()
      .then(json => {
        this.setState({ searchImgs: json.data });
      });
  }

  render() {
    const klasses = ['App'];

    if (this.state.isForcedHeader) klasses.push('fixed-header');

    return (
      <main className={klasses.join(' ')}>

        <header className="app-header">
          <SearchForm
            onSubmit={this.sendQuery}
            placeholder={'Search for GIFs'}
          />
        </header>

        <div className="app-content" onScroll={this.onContentScrol}>
          <GifDatasetManager
            sectionTitle={this.state.sectionTitle}
            search={this.state.searchImgs}
            favorites={this.state.favoriteImgs}
            onViewportScroll={this.handleViewportScroll}
            itemHandler={this.toggleLightbox}
          />
        </div>

        <Lightbox subject={this.state.selectedGif}
        />
      </main>
    );
  }
}

export default App;
