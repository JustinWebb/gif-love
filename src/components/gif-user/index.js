import React from 'react';

const GifUser = (props) => (
  <div className="gif-user">
    <div className="avatar"></div>
    <span className="display_name">{props.user.display_name}</span>
    <span className="twitter">{props.user.twitter}</span>
    <span className="is-verified"></span>
  </div>
);

export default GifUser;
