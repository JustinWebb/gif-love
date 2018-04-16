import React from 'react';

import GifView from '../gif-view';
import GifUser from '../gif-user';
import './lightbox.css';

const LightBox = (props) => {
  const klasses = ['lightbox'];
  const figureWrap = props.gif
    ? (
      <div className="figure-box">
        <figure>
          <GifView gif={props.gif} />
          <figcaption>{props.gif.title}</figcaption>
        </figure>
        <GifUser user={props.gif.user} />
      </div>
    )
    : null;
  const overlayClick = props.clickHandler ? props.clickHandler : null;

  if (props.showOverlay) klasses.push('is-on');

  return (
    <div className={klasses.join(' ')} onClick={overlayClick}>
      {figureWrap}
    </div>
  );
}

export default LightBox;
