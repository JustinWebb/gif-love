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
const MIN_MEDIA_WIDTH = 294;

export default class GifView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: MODE_LOADING,
      hasError: false,
      isLoaded: false,
      giphySrcSet: (props.displayAs === DISPLAY_AS_GRID) ? GifView.getSrcSet() : [],
      mediaQueries: (props.displayAs === DISPLAY_AS_GRID)
        ? [MQ_GRID_SM, MQ_GRID_LG]
        : [MQ_PORTRAIT_SM, MQ_PORTRAIT_LG],
    };
  }

  static propTypes = {
    gif: PropTypes.object.isRequired,
    reqKey: PropTypes.string,
    loader: PropTypes.func,
    itemHandler: PropTypes.func,
    displayAs: PropTypes.oneOf([DISPLAY_AS_GRID, DISPLAY_AS_PORTRAIT]),
    constrained: PropTypes.bool,
  };

  static defaultProps = {
    displayAs: DISPLAY_AS_GRID,
    constrained: true,
  }

  static getSrcSet = function () {
    return giphySchemas.filter(type => type.displayAs === DISPLAY_AS_GRID);
  }

  static get AS_PORTRAIT() {
    return DISPLAY_AS_PORTRAIT;
  }

  static get AS_GRID() {
    return DISPLAY_AS_GRID;
  }

  onMediaLoad = once((e) => {
    console.log('onMediaLoad');
    this.setState({ mode: MODE_READY, isLoaded: true });

    if (this.props.loader) {
      this.props.loader(e, this.props.reqKey);
    }
  });

  onMediaError = (e) => {
    this.setState({ mode: MODE_ERROR, hasError: true });
  }

  onClick = (e) => {
    if (this.props.itemHandler) {
      this.props.itemHandler(this.props.gif);
    }
  }

  getSizeStyle = (media) => {
    let style = null;

    if (this.props.displayAs === DISPLAY_AS_GRID) {
      style = { minWidth: `${media.width}px`, minHeight: `${media.height}px` };
    } else {
      const isMinWidth = (media.width < MIN_MEDIA_WIDTH) ? true : false;
      if (this.props.constrained) {
        const heightStyle = (isMinWidth) ? {} : { minHeight: `${media.height}px` };
        style = Object.assign({
          minWidth: (isMinWidth) ? `${MIN_MEDIA_WIDTH}px` : `${media.width}px`,
        }, heightStyle);
      } else {
        style = (isMinWidth) ? { minWidth: `${MIN_MEDIA_WIDTH}px` } : null;
      }
    }
    return style;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.isLoaded && this.state.mode === MODE_READY && !nextState.hasError) ? false : true;
  }

  componentDidCatch(error, info) {
    console.log('componentDidCatch', arguments);
    this.setState({ mode: MODE_ERROR, hasError: true });
  }

  render() {
    const klasses = ['gif-view'];
    let view = null;
    let typeName = null;
    let sizeStyle = null;

    if (this.props.displayAs === DISPLAY_AS_GRID) {
      typeName = giphyTypes.FIXED_WIDTH_SMALL_STILL;
      klasses.push('as-grid');
    } else {
      typeName = giphyTypes.PREVIEW;
      klasses.push('as-portrait');
    }
    const schema = parseGiphyVO(this.props.gif, typeName);
    sizeStyle = this.getSizeStyle(schema.media);

    if (!this.state.hasError) {
      klasses.push(this.state.mode);

      // media may be GIF or MP4
      if (schema.media.url) {
        const img = <img src={schema.media.url} alt={schema.title}
          onLoad={this.onMediaLoad}
          onError={this.onMediaError}
        />;
        view = (
          <picture
            className={klasses.join(' ')}
            onClick={this.onClick}
            style={sizeStyle}
          >
            {this.state.giphySrcSet.map((src, idx) => {
              return <source
                key={idx}
                srcSet={schema.baseUrl + src.filename}
                media={this.state.mediaQueries[idx]} />
            })}
            {img}
          </picture>
        );
      } else if (schema.media.mp4) {
        view = (
          <div
            className={klasses.join(' ')}
            onClick={this.onClick}
            style={sizeStyle}
          >
            <video
              src={schema.media.mp4}
              onCanPlay={this.onMediaLoad}
              onError={this.onMediaError}
              autoPlay="true"
              loop="true"
              muted="true"
              playsInline="true"
            />
          </div>
        );
      }
    } else {
      klasses.push('error');
      view = (
        <picture className={klasses.join(' ')} style={sizeStyle}>
          <img src={errorImg} alt="This content is not available"
            height={`${schema.media.height}px`} />
        </picture>
      );
    }
    // Return JSX for Picture or Video element
    return view;
  }
}
