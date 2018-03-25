import React from 'react';
import GifView from '../gif-view';
import GifUser from '../gif-user';

const LightBox = () => (
  <div className="lightbox">
    <div className="figure-wrap">
      <figure>
        <GifView gif={props.gif} />
        <figcaption>{props.gif.title}</figcaption>
      </figure>
      <GifUser user={props.gif.user} />
    </div>
  </div>
);

export default LightBox;
