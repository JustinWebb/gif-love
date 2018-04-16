const GIPHY_API = 'http://api.giphy.com/v1/'
const SEARCH_ENDPOINT = 'gifs/search';
const TRENDING_ENDPOINT = 'gifs/trending';

const getUrl = (endpoint, options) => {
  const req = Object.assign(options, {
    fmt: 'json',
    api_key: process.env.REACT_APP_GIPHY_API_KEY,
  });
  const params = Object.keys(req).reduce((acc, elem) => {
    acc.push(`${elem}=${encodeURIComponent(req[elem])}`);
    return acc;
  }, []);

  return GIPHY_API + endpoint + '?' + params.join('&');
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const err = new Error(`HTTP Error ${response.statusText}`);
    err.status = response.statusText;
    err.response = response;
    console.error(err);
    throw err;
  }
}

const parseJSON = (response) => {
  return response.json();
}

export default class GiphyService {

  static sendQuery(query = '') {
    let endpoint = null, opts = {};

    if (query) {
      endpoint = SEARCH_ENDPOINT;
      opts = { q: query.replace('^', '') };
    } else {
      endpoint = TRENDING_ENDPOINT;
    }
    return fetch(getUrl(endpoint, opts))
      .then(checkStatus)
      .then(parseJSON);
  }
}