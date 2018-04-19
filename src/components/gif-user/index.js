import React from 'react';
import './gif-user.css';

const GifUser = (props) => {
  if (props.user) {
    const user = props.user;
    return (
      <div className="gif-user">
        <div className="avatar"></div>
        <span className="display-name">{user.display_name || null}</span>
        <span className="twitter">{user.twitter || null}</span>
        <span className="is-verified"></span>
      </div>
    );
  } else {
    return null;
  }
}

export default GifUser;
