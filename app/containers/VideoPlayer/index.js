import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import isEqual from 'lodash/isEqual';
import Router from 'next/router';
import cachedFetch, { overrideCache } from '../../utils/cachedFetch';
import { openVideoPlayer, closeVideoPlayer, setHasVideo } from './actions';
import SvgWrapper from '../../components/SvgWrapper';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';
import VideoProgressBar from '../../components/VideoProgressBar';
import VideoOverlay from '../../components/VideoOverlay';
import { selectHasVideo, selectPlayerOpenState } from './selectors';
import checkForVideoAsync from '../../utils/checkForVideoAsync';

class VideoPlayer extends React.PureComponent {
  state = {
    paused: true,
    elipsisOpen: false,
    volume: 1,
    currentTime: 0,
    bufferLength: 0,
    playlist: [],
    videos: [],
    currentVideo: {},
    poster: '',
    hlsSupported: true,
  };

  componentDidMount() {
    this.getHls();

    Router.router.events.on('routeChangeStart', this.handleRouteChange);
  }

  componentWillReceiveProps(nextProps) {
    const { fileset } = nextProps;

    if (
      nextProps.bookId !== this.props.bookId ||
      nextProps.chapter !== this.props.chapter ||
      (nextProps.fileset &&
        this.props.fileset &&
        !isEqual(nextProps.fileset, this.props.fileset))
    ) {
      if (nextProps.hasVideo) {
        this.getVideos({
          filesetId: fileset ? fileset.id : '',
          bookId: nextProps.bookId || '',
          chapter: nextProps.chapter,
        });
      }
    } else if (
      nextProps.hasVideo !== this.props.hasVideo &&
      nextProps.hasVideo
    ) {
      this.getVideos({
        filesetId: fileset ? fileset.id : '',
        bookId: nextProps.bookId || '',
        chapter: nextProps.chapter,
      });
    } else if (
      nextProps.hasVideo !== this.props.hasVideo &&
      !nextProps.hasVideo
    ) {
      this.props.dispatch(closeVideoPlayer());
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
      this.videoRef.removeEventListener('loadedmetadata', this.loadedMetadata);
    }

    Router.router.events.off('routeChangeStart', this.handleRouteChange);
  }

  getHls = async () => {
    const hls = await import('hls.js');
    const { fileset } = this.props;
    this.Hls = hls.default;
    this.isSupported = hls.isSupported;
    if (this.videoRef) {
      this.getVideos({
        filesetId: fileset ? fileset.id : '',
        bookId: this.props.bookId || '',
        chapter: this.props.chapter,
      });
      this.checkHlsSupport();
    }
  };

  // If there ended up being video for the selected chapter get the actual stream
  getVideos = async ({ filesetId, bookId, chapter }) => {
    if (!filesetId) return;
    const requestUrl = `${
      process.env.BASE_API_ROUTE
    }/bibles/filesets/${filesetId}?key=${
      process.env.DBP_API_KEY
    }&v=4&type=video_stream&asset_id=dbp-vid&book_id=${bookId}`;

    try {
      // TODO: Profile to see how much time the caching actually saves here
      const response = await cachedFetch(requestUrl);

      if (response.data) {
        overrideCache(requestUrl, response);

        const videos = response.data.map((video, index) => ({
          title: `${video.book_name} ${video.chapter_start}:${
            video.verse_start
          }-${video.verse_end}`,
          id: `${video.book_id}_${video.chapter_start}_${video.verse_start}`,
          chapterStart: video.chapter_start,
          bookId: video.book_id,
          source: video.path,
          duration: video.duration || 300,
          reference: `${video.chapter_start}:${
            video.verse_end
              ? `${video.verse_start}-${video.verse_end}`
              : video.verse_start
          }`,
          thumbnail: `${'mark' ||
            video.book_name}_${video.book_id.toLowerCase()}_${index}.jpg`,
        }));
        const playlist = videos.filter(
          (video) => video.bookId === bookId && video.chapterStart === chapter,
        );
        this.setState({
          videos,
          playlist: playlist.slice(1),
          currentVideo: playlist[0],
          poster: playlist[0] ? playlist[0].thumbnail : '',
        });
        this.initVideoStream({ thumbnailClick: false });
        this.openPlayer();
        if (!this.props.hasVideo) {
          this.props.dispatch(
            setHasVideo({
              videoPlayerOpen: true,
              state: true,
              videoChapterState: true,
            }),
          );
        }
      } else {
        this.setState({ playlist: [], currentVideo: {} });
        if (this.props.hasVideo) {
          this.props.dispatch(
            setHasVideo({
              videoPlayerOpen: false,
              state: false,
              videoChapterState: false,
            }),
          );
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Error getting video playlist', err); // eslint-disable-line no-console
      }
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

  get previousVideo() {
    const { playlist, currentVideo } = this.state;
    let previousVideo;
    // Need to find the video directly before the current one
    playlist.forEach((video) => {
      if (video.id < currentVideo.id) {
        previousVideo = video;
      }
    });
    return previousVideo;
  }

  get nextVideo() {
    const { playlist, currentVideo } = this.state;
    let nextVideo;
    let foundNext = false;
    // Need to find the video immediately after the current one
    playlist.forEach((video) => {
      if (video.id > currentVideo.id && !foundNext) {
        nextVideo = video;
        foundNext = true;
      }
    });

    return nextVideo;
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
  };

  handleVideoClick = () => {
    const { paused } = this.state;

    if (paused) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  };

  handleThumbnailClick = (video) => {
    const { bookId, chapter } = this.props;

    this.setState(
      (state) => ({
        playlist: state.videos
          .filter(
            (v) =>
              v.id !== video.id &&
              v.bookId === bookId &&
              v.chapterStart === chapter,
          )
          .sort(this.sortPlaylist),
        currentVideo: video,
        poster: video.thumbnail,
        paused: true,
      }),
      () => {
        this.playVideo({ thumbnailClick: true });
      },
    );
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

  // Checks to see if we have video content for the selected chapter
  // This seems somewhat repetitive and unnecessary
  checkForBooks = async ({ filesetId, bookId, chapter }) => {
    if (!filesetId) {
      this.props.dispatch(
        setHasVideo({
          videoPlayerOpen: false,
          state: false,
          videoChapterState: false,
        }),
      );
      return;
    }

    try {
      // TODO: Profile to see if caching helps here
      const hasVideo = await checkForVideoAsync(filesetId, bookId, chapter);

      if (hasVideo) {
        this.props.dispatch(
          setHasVideo({
            videoPlayerOpen: hasVideo,
            state: hasVideo,
            videoChapterState: hasVideo,
          }),
        );
      } else {
        this.props.dispatch(
          setHasVideo({
            videoPlayerOpen: false,
            state: false,
            videoChapterState: false,
          }),
        );
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error checking for video context', err); // eslint-disable-line no-console
      }
      this.props.dispatch(
        setHasVideo({
          videoPlayerOpen: false,
          state: false,
          videoChapterState: false,
        }),
      );
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

  initVideoStream = ({ thumbnailClick }) => {
    const { currentVideo, hlsSupported } = this.state;
    if (!hlsSupported) {
      if (this.videoRef.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoRef.src = `${currentVideo.source}?key=${
          process.env.DBP_API_KEY
        }&v=4&asset_id=dbp-vid`;
        this.videoRef.addEventListener(
          'timeupdate',
          this.timeUpdateEventListener,
        );
        this.videoRef.addEventListener('seeking', this.seekingEventListener);
        this.videoRef.addEventListener('seeked', this.seekedEventListener);
        if (thumbnailClick) {
          this.videoRef.addEventListener('loadedmetadata', this.loadedMetadata);
        }
      }
    } else {
      // Create the hls stream first
      this.initHls();
      try {
        // Check for the video element
        if (this.videoRef) {
          // Make sure that there is a valid source
          if (currentVideo.source) {
            this.hls.attachMedia(this.videoRef);
            this.hls.loadSource(
              `${currentVideo.source}?key=${
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
              if (this.props.playerOpen && thumbnailClick) {
                this.hls.media.play();
                this.setState({ paused: false });
              }
            });
            this.hls.on(this.Hls.Events.BUFFER_APPENDING, () => {
              this.setBuffer();
            });
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('initVideoStream', err); // eslint-disable-line no-console
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

  sortPlaylist = (a, b) => {
    // if videos are from the same chapter
    if (a.chapterStart === b.chapterStart) {
      return a.verse_start > b.verse_start;
    } else if (a.chapterStart > b.chapterStart) {
      // videos are from different chapters and a is after b
      return false;
    } else if (a.chapterStart < b.chapterStart) {
      // a is before b
      return true;
    }
    // Last resort is to just sort by the ids, this breaks in some cases i.e. mrk_10_12 < mrk_10_2
    return a.id > b.id;
  };

  playVideo = ({ thumbnailClick }) => {
    const { currentVideo, hlsSupported } = this.state;
    if (!hlsSupported) {
      if (
        this.videoRef.src ===
        `${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`
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
        if (currentVideo.source) {
          // if there is already an hls stream and that streams url is equal to this videos source then play the video
          if (
            this.hls.media &&
            this.hls.url ===
              `${currentVideo.source}?key=${
                process.env.DBP_API_KEY
              }&v=4&asset_id=dbp-vid`
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
          console.log('caught in playVideo', err); // eslint-disable-line no-console
        }
      }
    }
  };

  pauseVideo = () => {
    this.videoRef.pause();
    this.setState({ paused: true, elipsisOpen: false });
  };

  closePlayer = () => {
    this.setState({ paused: true });
    this.pauseVideo();
    this.props.dispatch(closeVideoPlayer());
  };

  openPlayer = () => {
    this.props.dispatch(openVideoPlayer());
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

  toggleElipsis = () => {
    this.setState((currentState) => ({
      elipsisOpen: !currentState.elipsisOpen,
    }));
  };

  updateVolume = (volume) => {
    this.videoRef.volume = volume;
    this.setState({ volume });
  };

  previousFunction = (e) => {
    e.stopPropagation();
    if (this.previousVideo) {
      this.handleThumbnailClick(this.previousVideo);
    }
  };

  nextFunction = (e) => {
    e.stopPropagation();
    if (this.nextVideo) {
      this.handleThumbnailClick(this.nextVideo);
    }
  };

  render() {
    const {
      playlist,
      volume,
      paused,
      elipsisOpen,
      currentVideo,
      currentTime,
      bufferLength,
    } = this.state;
    const {
      hasVideo,
      playerOpen,
      fileset,
      books,
      bookId,
      chapter,
      textId,
      text,
    } = this.props;
    // Don't render anything if there is no video for the chapter
    if (!hasVideo || !fileset || !currentVideo) {
      return null;
    }
    /* eslint-disable jsx-a11y/media-has-caption */
    return [
      <div
        key={'video-player-container'}
        className={
          playerOpen
            ? 'video-player-container active'
            : 'video-player-container'
        }
      >
        <div className={'video-player'}>
          <VideoOverlay
            paused={paused}
            currentVideo={currentVideo}
            closePlayer={this.closePlayer}
            playFunction={this.playVideo}
            pauseFunction={this.pauseVideo}
            previousVideo={this.previousVideo}
            nextVideo={this.nextVideo}
            previousFunction={this.previousFunction}
            nextFunction={this.nextFunction}
            books={books}
            bookId={bookId}
            chapter={chapter}
            textId={textId}
            text={text}
          />
          <video
            ref={this.setVideoRef}
            onClick={this.handleVideoClick}
            poster={`${process.env.CDN_STATIC_FILES}/${currentVideo.thumbnail ||
              'mark_mrk_0.jpg'}`}
          />
          <VideoProgressBar
            paused={paused}
            elipsisOpen={elipsisOpen}
            currentTime={currentTime}
            duration={currentVideo.duration || 300}
            setCurrentTime={this.setCurrentTime}
            bufferLength={bufferLength}
          />
          <VideoControls
            paused={paused}
            pauseVideo={this.pauseVideo}
            elipsisOpen={elipsisOpen}
            toggleElipsis={this.toggleElipsis}
            toggleFullScreen={this.toggleFullScreen}
            updateVolume={this.updateVolume}
            volume={volume}
          />
          <VideoList
            elipsisOpen={elipsisOpen}
            toggleElipsis={this.toggleElipsis}
            handleThumbnailClick={this.handleThumbnailClick}
            playlist={playlist}
          />
        </div>
        <div onClick={this.closePlayer} className={'black-bar'}>
          <SvgWrapper className={'up-arrow'} svgid={'arrow_up'} />
        </div>
      </div>,
      <div
        key={'black-bar-key'}
        onClick={this.openPlayer}
        className={playerOpen ? 'black-bar closed' : 'black-bar'}
      >
        <SvgWrapper className={'gospel-films'} svgid={'gospel_films'} />
      </div>,
    ];
    /* eslint-enable jsx-a11y/media-has-caption */
  }
}

VideoPlayer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  fileset: PropTypes.object,
  bookId: PropTypes.string.isRequired,
  chapter: PropTypes.number.isRequired,
  hasVideo: PropTypes.bool.isRequired,
  books: PropTypes.array,
  textId: PropTypes.string,
  text: PropTypes.array,
  playerOpen: PropTypes.bool,
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

const mapStateToProps = createStructuredSelector({
  hasVideo: selectHasVideo(),
  playerOpen: selectPlayerOpenState(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(VideoPlayer);
