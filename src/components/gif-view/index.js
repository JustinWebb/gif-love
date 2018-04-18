import React from 'react';
import PropTypes from 'prop-types';
import { parseGiphyVO, giphySchemas, giphyTypes } from '../../api/giphy-parser';
import errorImg from '../../assets/images/error.svg';
import { once } from 'lodash';
import './gif-view.css';

const DISPLAY_AS_GRID = 'grid';
const DISPLAY_AS_PORTRAIT = 'portrait';
const MODE_LOADING = 'loading';
const MODE_READY = 'ready';
const MODE_ERROR = 'error';
const MQ_GRID_SM = '(max-width: 767px)';
const MQ_GRID_LG = '(min-width: 768px)';
const MQ_PORTRAIT_SM = '(max-width: 1024px)';
const MQ_PORTRAIT_LG = '(min-width: 1025px)';

export default class GifView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: MODE_LOADING,
      hasError: false,
      isLoaded: false,
      giphySrcSet: GifView.getSrcSet(props.displayAs),
      mediaQueries: (props.displayAs === DISPLAY_AS_GRID)
        ? [MQ_GRID_SM, MQ_GRID_LG]
        : [MQ_PORTRAIT_SM, MQ_PORTRAIT_LG]
    };
  }

  static propTypes = {
    gif: PropTypes.object.isRequired,
    reqKey: PropTypes.string,
    loader: PropTypes.func,
    itemHandler: PropTypes.func,
    displayAs: PropTypes.oneOf([DISPLAY_AS_GRID, DISPLAY_AS_PORTRAIT]),
  };

  static defaultProps = {
    displayAs: DISPLAY_AS_GRID
  }

  static getSrcSet = function (displayAs) {
    return giphySchemas.filter(type => type.displayAs === displayAs);
  }

  static get AS_PORTRAIT() {
    return DISPLAY_AS_PORTRAIT;
  }

  static get AS_GRID() {
    return DISPLAY_AS_GRID;
  }

  onImgLoad = once((e) => {
    console.log('onImgLoad');
    this.setState({ mode: MODE_READY, isLoaded: true });

    if (this.props.loader) {
      this.props.loader(e, this.props.reqKey);
    }
  });

  onImgError = (e) => {
    this.setState({ mode: MODE_ERROR, hasError: true });
  }

  onClick = (e) => {
    if (this.props.itemHandler) {
      this.props.itemHandler(this.props.gif);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.isLoaded && this.state.mode === MODE_READY && !nextState.hasError) ? false : true;
  }

  componentDidCatch(error, info) {
    console.log('componentDidCatch', arguments);
    this.setState({ mode: 'error', hasError: true });
  }

  render() {
    const typeName = (this.props.displayAs === DISPLAY_AS_GRID)
      ? giphyTypes.FIXED_WIDTH_SMALL_STILL
      : giphyTypes.PREVIEW;
    const schema = parseGiphyVO(this.props.gif, typeName);

    if (!this.state.hasError) {
      const klasses = ['gif-view'];
      const img = <img src={schema.imgType.url} alt={schema.title}
        onLoad={this.onImgLoad}
        onError={this.onImgError}
      />;

      klasses.push(this.state.mode);

      return (
        <picture className={klasses.join(' ')} onClick={this.onClick}>
          {this.state.giphySrcSet.map((src, idx) => {
            return <source
              key={idx}
              srcSet={schema.baseUrl + src.filename}
              media={this.state.mediaQueries[idx]} />
          })}
          {img}
        </picture>
      );
    } else {

      return (
        <picture className="gif-view error">
          <img src={errorImg} alt="This content is not available"
            height={`${schema.imgType.height}px`} />
        </picture>
      );
    }
  }
}
