import React from 'react';
import './gif-user.css';

const generateLinks = (user) => {
  const links = ['twitter', 'facebook', 'instagram']
    .reduce((acc, site) => {
      const url = user[`${site}_url`];
      if (url) acc.push(
        // eslint-disable-next-line
        <a className={`${site}`} href={url} alt={`visit on ${site}`} target="_blank" />
      );
      return acc;
    }, [])
    .map((link, idx) => {
      return <li key={idx}>{link}</li>
    });
  return (links.length) ? <ul>{links}</ul> : null;
}

const GifUser = (props) => {
  if (props.user) {
    const user = props.user;
    const klasses = ['gif-user'];
    console.log('User: ', user);
    const avatar = (user.avatar_url)
      ? <img src={user.avatar_url} alt={user.attribution_display_name || null} />
      : null;
    const socialLinks = generateLinks(user);

    if (socialLinks) klasses.push('has-social-links');

    return (
      <div className={klasses.join(' ')}>
        <div className="details">
          <div className="avatar">
            {avatar}
          </div>
          <span className="display-name">{user.display_name || null}</span>
        </div>
        <div className="social-links">
          {socialLinks}
        </div>

      </div>
    );
  } else {
    return null;
  }
}

export default GifUser;
