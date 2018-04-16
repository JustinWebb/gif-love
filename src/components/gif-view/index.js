import React from 'react';
import PropTypes from 'prop-types';
import { parseGiphyVO, giphyTypes } from '../../api/giphy-parser';
import errorImg from '../../assets/images/error.svg';
import { once } from 'lodash';
import './gif-view.css';

export default class GifView extends React.Component {

  static propTypes = {
    gif: PropTypes.object.isRequired,
    reqKey: PropTypes.string,
    loader: PropTypes.func,
    itemHandler: PropTypes.func,
  };

  state = {
    mode: 'idle',
    hasError: false,
    isLoaded: false,
  };

  onImgLoad = once((e) => {
    console.log('onImgLoad');
    this.setState({ mode: 'ready', isLoaded: true });

    if (this.props.loader) {
      this.props.loader(e, this.props.reqKey);
    }
  });

  onImgError = (e) => {
    this.setState({ mode: 'error', hasError: true });
  }

  onClick = (e) => {
    if (this.props.itemHandler) {
      this.props.itemHandler(this.props.gif);
    }
  }

  componentWillReceiveProps(props, nextState) {
    console.log('wtf', props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.state.isLoaded && this.state.mode === 'ready' && !nextState.hasError) ? false : true;
  }

  componentDidCatch(error, info) {
    console.log('componentDidCatch', arguments);
    this.setState({ mode: 'error', hasError: true });
  }

  render() {
    const schema = parseGiphyVO(this.props.gif);
    if (!this.state.hasError) {
      const klasses = ['gif-view'];
      const img = <img src={schema.imgType.url} alt={schema.title}
        onLoad={this.onImgLoad}
        onError={this.onImgError}
      />;

      klasses.push(this.state.mode);

      return (
        <picture className={klasses.join(' ')} onClick={this.onClick}>
          {giphyTypes.map((src, idx) => {
            return <source key={idx} srcSet={schema.baseUrl + src.filename} media={src.mediaQuery} />
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
