/**
 *
 * JesusFilmVideoPlayer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import SvgWrapper from '../SvgWrapper';
import VideoControls from '../VideoControls';
import VideoProgressBar from '../VideoProgressBar';
import VideoOverlay from '../VideoOverlay';

class JesusFilmVideoPlayer extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  state = {
    paused: true,
    volume: 1,
    currentTime: 0,
    bufferLength: 0,
    hlsSupported: true,
  };

  componentDidMount() {
    if (this.videoRef) {
      this.getHls();
      this.videoRef.addEventListener(
        'webkitendfullscreen',
        this.webkitendfullscreen,
        false,
      );
      Router.router.events.on('routeChangeStart', this.handleRouteChange);
    }
  }

  componentWillUnmount() {
    if (this.hls && this.hls.media) {
      this.hls.media.removeEventListener(
        'timeupdate',
        this.timeUpdateEventListener,
      );
      this.hls.media.removeEventListener('seeking', this.seekingEventListener);
      this.hls.media.removeEventListener('seeked', this.seekedEventListener);
      this.hls.detachMedia();
      this.hls.stopLoad();
      this.hls.destroy();
    }
    if (this.videoRef) {
      this.videoRef.removeEventListener(
        'timeupdate',
        this.timeUpdateEventListener,
      );
      this.videoRef.removeEventListener('seeking', this.seekingEventListener);
      this.videoRef.removeEventListener('seeked', this.seekedEventListener);
      this.videoRef.removeEventListener(
        'webkitendfullscreen',
        this.webkitendfullscreen,
      );
      this.videoRef.removeEventListener('loadedmetadata', this.loadedMetadata);
    }

    Router.router.events.off('routeChangeStart', this.handleRouteChange);
  }

  webkitendfullscreen = () => {
    this.pauseVideo();
  };

  getHls = async () => {
    const hls = await import('hls.js');

    this.Hls = hls.default;
    this.isSupported = hls.isSupported;

    if (this.videoRef) {
      this.checkHlsSupport();
      this.initVideoStream();
    }
  };

  get playButton() {
    const { paused } = this.state;

    return (
      <SvgWrapper
        onClick={this.playVideo}
        className={paused ? 'play-video show-play' : 'play-video hide-play'}
        fill={'#fff'}
        svgid={'play_video'}
        viewBox={'0 0 90 40'}
      />
    );
  }

  setVideoRef = (el) => {
    this.videoRef = el;
  };

  setBuffer = () => {
    // Can accept current time as the first parameter
    if (this.hls && this.hls.media) {
      const buf = this.hls.media.buffered;
      if (buf && buf.length) {
        this.setState({ bufferLength: buf.end(buf.length - 1) });
      }
    }
  };

  setCurrentTime = (time) => {
    if (this.hls.media) {
      this.hls.media.currentTime = time;
      this.setState({ currentTime: time });
    } else {
      this.videoRef.currentTime = time;
      this.setState({ currentTime: time });
    }
  };

  handleRouteChange = () => {
    if (this.hls) {
      this.hls.destroy();
    }
    if (this.videoRef) {
      this.pauseVideo();
    }
  };

  handleVideoClick = () => {
    const { paused } = this.state;

    if (paused) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  };

  checkHlsSupport = () => {
    if (typeof this.isSupported === 'function') {
      this.setState({
        hlsSupported: this.isSupported(),
      });
    } else {
      this.setState({
        hlsSupported: false,
      });
    }
  };

  initHls = () => {
    // Destroying the old hls stream so that there aren't artifacts leftover in the new stream
    if (this.hls) {
      this.hls.destroy();
    }
    this.hls = new this.Hls();
    this.hls.on(this.Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case this.Hls.ErrorTypes.NETWORK_ERROR:
            this.hls.startLoad();
            break;
          case this.Hls.ErrorTypes.MEDIA_ERROR:
            this.hls.recoverMediaError();
            break;
          default:
            this.hls.destroy();
            break;
        }
      }
    });
  };

  loadedMetadata = () => {
    this.videoRef.play();
    this.setState({ paused: false });
  };

  initVideoStream = () => {
    const { hlsSupported } = this.state;
    const { hlsStream } = this.props;
    if (!hlsSupported) {
      if (this.videoRef.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoRef.src = `${hlsStream}?key=${
          process.env.DBP_API_KEY
        }&v=4&asset_id=dbp-vid`;
        this.videoRef.addEventListener(
          'timeupdate',
          this.timeUpdateEventListener,
        );
        this.videoRef.addEventListener('seeking', this.seekingEventListener);
        this.videoRef.addEventListener('seeked', this.seekedEventListener);
      }
    } else {
      // Create the hls stream first
      this.initHls();
      try {
        // Check for the video element
        if (this.videoRef) {
          // Make sure that there is a valid source
          if (hlsStream) {
            this.hls.attachMedia(this.videoRef);
            this.hls.loadSource(
              `${hlsStream}?key=${
                process.env.DBP_API_KEY
              }&v=4&asset_id=dbp-vid`,
            );
            this.hls.media.addEventListener(
              'timeupdate',
              this.timeUpdateEventListener,
            );
            this.hls.media.addEventListener(
              'seeking',
              this.seekingEventListener,
            );
            this.hls.media.addEventListener('seeked', this.seekedEventListener);
            this.hls.on(this.Hls.Events.MANIFEST_PARSED, () => {
              this.hls.media.play();
              this.setState({ paused: false });
            });
            this.hls.on(this.Hls.Events.BUFFER_APPENDING, () => {
              this.setBuffer();
            });
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('initVideoStream', err); // eslint-disable-line no-console
        }
      }
    }
  };

  timeUpdateEventListener = (e) => {
    this.setState({
      currentTime: e.target.currentTime,
    });
  };

  seekingEventListener = (e) => {
    this.setState({
      currentTime: e.target.currentTime,
    });
  };

  seekedEventListener = (e) => {
    this.setState({
      currentTime: e.target.currentTime,
    });
  };

  playVideo = ({ thumbnailClick }) => {
    const { hlsSupported } = this.state;
    const { hlsStream } = this.props;
    if (!hlsSupported) {
      if (
        this.videoRef.src ===
        `${hlsStream}?key=${process.env.DBP_API_KEY}&v=4&asset_id=dbp-vid`
      ) {
        this.videoRef.play();
        this.setState({ paused: false });
        // if the sources didn't match then this is a new video and the hls stream needs to be updated
      } else {
        // Init a new hls stream
        this.initVideoStream({ thumbnailClick });
      }
    } else {
      try {
        // if the current video has a source (initial load may be an empty object)
        if (hlsStream) {
          // if there is already an hls stream and that streams url is equal to this videos source then play the video
          if (
            this.hls.media &&
            this.hls.url ===
              `${hlsStream}?key=${process.env.DBP_API_KEY}&v=4&asset_id=dbp-vid`
          ) {
            this.hls.media.play();
            this.setState({ paused: false });
            // if the sources didn't match then this is a new video and the hls stream needs to be updated
          } else {
            // Stop the current player from loading anymore video
            this.hls.stopLoad();
            // Remove the old hls stream
            this.hls.destroy();
            // Init a new hls stream
            this.initVideoStream({ thumbnailClick });
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error('caught in playVideo', err); // eslint-disable-line no-console
        }
      }
    }
  };

  pauseVideo = () => {
    this.videoRef.pause();
    this.setState({ paused: true });
  };

  toggleFullScreen = () => {
    const isFullScreen = !!(
      document.fullScreen ||
      document.webkitIsFullScreen ||
      document.mozFullScreen ||
      document.msFullscreenElement ||
      document.fullscreenElement
    );

    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    } else if (this.videoRef) {
      if (this.videoRef.requestFullscreen) {
        this.videoRef.requestFullscreen();
      } else if (this.videoRef.mozRequestFullScreen) {
        this.videoRef.mozRequestFullScreen();
      } else if (this.videoRef.webkitRequestFullScreen) {
        this.videoRef.webkitRequestFullScreen();
      } else if (this.videoRef.msRequestFullscreen) {
        this.videoRef.msRequestFullscreen();
      }
    }
  };

  updateVolume = (volume) => {
    this.videoRef.volume = volume;
    this.setState({ volume });
  };

  render() {
    const { volume, paused, currentTime, bufferLength } = this.state;
    const { hasVideo, hlsStream, duration } = this.props;
    // console.log('hlsStream', hlsStream, 'duration', duration);
    // Don't render anything if there is no video for the chapter
    if (!hasVideo || !hlsStream) {
      return (
        <div
          key={'video-player-container'}
          className={'video-player-container jesus-film-override'}
        >
          <h2>
            Something went wrong. Please refresh the page or go back to try
            again!
          </h2>
        </div>
      );
    }
    /* eslint-disable jsx-a11y/media-has-caption */
    return (
      <div
        key={'video-player-container'}
        className={'video-player-container jesus-film-override'}
      >
        <div className={'video-player'}>
          <VideoOverlay
            paused={paused}
            playFunction={this.playVideo}
            pauseFunction={this.pauseVideo}
            isJesusFilm
          />
          <video ref={this.setVideoRef} onClick={this.handleVideoClick} />
          <VideoProgressBar
            paused={paused}
            currentTime={currentTime}
            duration={duration || 300}
            setCurrentTime={this.setCurrentTime}
            bufferLength={bufferLength}
          />
          <VideoControls
            paused={paused}
            pauseVideo={this.pauseVideo}
            toggleFullScreen={this.toggleFullScreen}
            updateVolume={this.updateVolume}
            volume={volume}
          />
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/media-has-caption */
  }
}

JesusFilmVideoPlayer.propTypes = {
  hlsStream: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  hasVideo: PropTypes.bool.isRequired,
};

export default JesusFilmVideoPlayer;
