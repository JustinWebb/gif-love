import React from 'react';
import loaderImg from '../../assets/images/recycle-by-rivercon.svg';
import './gif-view.css';

const PIC_SCHEMA = {
  defaultTypeName: 'fixed_width',
  types: [
    {
      name: 'fixed_width_small_still',
      filename: '100w.gif',
      mediaQuery: '(max-width: 767px)'
    },
    {
      name: 'fixed_width',
      filename: '200w.gif',
      mediaQuery: '(min-width: 768px)'
    },
  ]
}

const GifView = (props) => {
  let picture = null;

  if (props.gif) {
    const schema = props.gif.images[PIC_SCHEMA.defaultTypeName];
    const url = schema.url.substring(0, schema.url.lastIndexOf('/') + 1);
    const defaultImg = <img src={schema.url} alt={props.gif.title} />;
    picture = (
      <picture className="gif-view">
        {PIC_SCHEMA.types.map((src, idx) => {
          return <source key={idx} srcSet={url + src.filename} media={src.mediaQuery} />
        })}
        {defaultImg}
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
