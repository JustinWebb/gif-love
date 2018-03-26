import React from 'react';
import loaderImg from '../../assets/images/recycle-by-rivercon.svg';
import './gif-view.css';

const FIXED_WIDTH = '200w.gif';
const FIXED_WIDTH_SMALL_STILL = '100w.gif';
const IMG_SOURCES = [
  { name: FIXED_WIDTH_SMALL_STILL, mediaQuery: '(max-width: 619px)' },
  { name: FIXED_WIDTH, mediaQuery: '(min-width: 620px)' },
];

const GifView = (props) => {
  let picture = null;

  if (props.gif) {
    const url = props.gif.images.fixed_width.url.replace(FIXED_WIDTH, '');
    const img = <img src={url + FIXED_WIDTH} alt={props.gif.title} />;
    picture = (
      <picture className="gif-view">
        {IMG_SOURCES.map((src, idx) => {
          return <source key={idx} srcSet={url + src.name} media={src.mediaQuery} />
        })}
        {img}
      </picture>
    );
  } else {
    picture = (
      <picture className="gif-view ani-loading">
        <img src={loaderImg} alt="loading..." />
      </picture>
    );
  }

  return picture;
}

export default GifView;
