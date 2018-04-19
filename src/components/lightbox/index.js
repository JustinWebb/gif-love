import React from 'react';
import PropTypes from 'prop-types';

import GifView from '../gif-view';
import GifUser from '../gif-user';
import './lightbox.css';


export default class LightBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
      subject: null,
      isFlexFrame: false,
    };

    this.lightboxElem = null;
  }

  static propTypes = {
    subject: PropTypes.object,
  }

  onClick = (e) => {
    if (e.target === e.currentTarget) {
      this.setState(nextState => {
        return { isActive: !nextState.isActive, subject: null }
      });
    }
  }

  onResize = (e) => {
    if (window.innerWidth < 768 && this.state.isFlexFrame) {
      this.setState({ isFlexFrame: false });
    } else if (window.innerWidth >= 768 && !this.state.isFlexFrame) {
      this.setState({ isFlexFrame: true });
    }
  }

  componentWillReceiveProps(props, nextState) {
    const isActive = (props.subject !== null) ? true : false;
    this.setState({ subject: props.subject, isActive });
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  render() {
    const klasses = ['lightbox'];
    const subject = this.state.subject;
    const figureWrap = (subject)
      ? (
        <div className="frame">
          <figure className="subject-view">
            <GifView gif={subject} displayAs={GifView.AS_PORTRAIT} constrained={this.state.isFlexFrame} />
            <figcaption className="caption">{subject.title}</figcaption>
          </figure>
          <GifUser user={subject.user} />
        </div>
      )
      : null;

    if (this.state.isActive) klasses.push('is-on');

    return (
      <div className={klasses.join(' ')} onClick={this.onClick}>
        {figureWrap}
      </div>
    );
  }
}
