import React from 'react';
import loading from '../../assets/images/recycle-by-rivercon.svg';

const FIXED_WIDTH = '200w.gif';
const FIXED_WIDTH_SMALL_STILL = '100w.gif';

const GifView = (props) => {
  let img = <img src={loading} alt="loading..." />;
  let url = '';
  if (props.gif) {
    url = props.gif.images.fixed_width.url.replace(FIXED_WIDTH, '');
    img = <img src={url + FIXED_WIDTH} alt={props.gif.title} />;
  }

  return (
    <picture className="gif-view">
      <source srcSet={url + FIXED_WIDTH_SMALL_STILL} media="(max-width: 599px)" />
      <source srcSet={url + FIXED_WIDTH} media="(min-width: 600px)" />
      {img}
    </picture>
  );
}

export default GifView;
