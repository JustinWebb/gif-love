import React, { Component } from 'react';
import './App.css';
import { data as searchdata } from './assets/data/giphy-search.json';
import { data as trenddata } from './assets/data/giphy-trending.json';
import SearchForm from './components/search-form';
import GifDatasetManager from './components/gif-dataset-manager';

class App extends Component {
  state = {
    isLightboxOn: false
  }
  render() {
    console.log('searchdata', searchdata);

    return (
      <div className="App">

        <SearchForm />

        <GifDatasetManager
          trends={trenddata}
          search={searchdata}
        />

      </div>
    );
  }
}

export default App;
