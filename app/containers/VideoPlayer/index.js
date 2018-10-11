import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import Router from 'next/router';
// import { BufferHelper } from 'hls.js/src/utils/buffer-helper';
import { openVideoPlayer, closeVideoPlayer, setHasVideo } from './actions';
import SvgWrapper from '../../components/SvgWrapper';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';
import VideoProgressBar from '../../components/VideoProgressBar';
import VideoOverlay from '../../components/VideoOverlay';
import deepDifferenceObject from '../../utils/deepDifferenceObject';
import request from '../../utils/request';
import { selectHasVideo } from './selectors';
// import makeSelectHomePage from '../HomePage/selectors';
// import { openVideoPlayer, closeVideoPlayer, getVideoList } from './actions';
// import injectReducer from '../../utils/injectReducer';
// import injectSaga from '../../utils/injectSaga';
// import reducer from './reducer';
// import saga from './sagas';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
		paused: true,
		elipsisOpen: false,
		volume: 1,
		currentTime: 0,
		bufferLength: 0,
		playlist: [],
		videos: [],
		currentVideo: {},
		poster: '',
	};

	componentDidMount() {
		const { fileset } = this.props;
		this.initHls();
		this.checkForBooks({
			filesetId: fileset ? fileset.id : '',
			bookId: this.props.bookId || '',
			chapter: this.props.chapter,
		});
		if (this.videoRef) {
			this.getVideos({
				filesetId: fileset ? fileset.id : '',
				bookId: this.props.bookId || '',
				chapter: this.props.chapter,
			});
		}

		Router.router.events.on('routeChangeStart', this.handleRouteChange);
	}

	componentWillReceiveProps(nextProps) {
		const { fileset } = nextProps;

		if (
			nextProps.bookId !== this.props.bookId ||
			nextProps.chapter !== this.props.chapter ||
			Object.keys(deepDifferenceObject(nextProps.fileset, this.props.fileset))
				.length
		) {
			if (nextProps.hasVideo) {
				this.getVideos({
					filesetId: fileset ? fileset.id : '',
					bookId: nextProps.bookId || '',
					chapter: nextProps.chapter,
				});
			} else {
				this.checkForBooks({
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

		Router.router.events.off('routeChangeStart', this.handleRouteChange);
	}

	getVideos = async ({ filesetId, bookId, chapter }) => {
		// console.log('filesetId, bookId', filesetId, bookId);
		if (!filesetId) return;
		// const requestUrl = `${
		// 	process.env.BASE_API_ROUTE
		// }/bibles/filesets/${filesetId}?key=${
		// 	process.env.DBP_API_KEY
		// }&v=4&type=video_stream&bucket=dbp-vid&book_id=${bookId}&chapter_id=${chapter}`;
		const requestUrl = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${filesetId}?key=${
			process.env.DBP_API_KEY
		}&v=4&type=video_stream&bucket=dbp-vid&book_id=${bookId}`;

		try {
			const response = await request(requestUrl);
			// console.log('all the vids', response);

			if (response.data) {
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
				// console.log('videos', videos);
				// console.log('playlist', playlist);

				this.setState({
					videos,
					playlist: playlist.slice(1),
					currentVideo: playlist[0],
					poster: playlist[0] ? playlist[0].thumbnail : '',
				});
				this.initVideoStream({ thumbnailClick: false });
				if (!this.props.hasVideo) {
					this.props.dispatch(setHasVideo({ state: true }));
				}
			} else {
				this.setState({ playlist: [], currentVideo: {} });
				if (this.props.hasVideo) {
					this.props.dispatch(setHasVideo({ state: false }));
				}
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.log('Error getting video playlist', err); // eslint-disable-line no-console
			}
		}
	};

	setVideoRef = (el) => {
		this.videoRef = el;
	};

	setBuffer = () => {
		// Can accept current time as the first parameter
		if (this.hls && this.hls.media) {
			const buf = this.hls.media.buffered;
			if (buf && buf.length) {
				// console.log('buffer start', buf.start(0));
				// console.log('buffer end', buf.end(0));
				this.setState({ bufferLength: buf.end(buf.length - 1) });
			}
		}
		// Iterate over buffers to find the latest buffer
		// Use the latest buffer to indicate how far the buffer has loaded
		// const info = BufferHelper.bufferInfo(this.hls.media, pos, 1);
		// console.log('Find buffer info', info);
		// this.setState({ bufferLength: info.len });
	};

	setCurrentTime = (time) => {
		if (this.hls.media) {
			// console.log('Setting hls media time');
			this.hls.media.currentTime = time;
			this.setState({ currentTime: time });
		} else {
			// console.log('Setting video ref time');
			this.videoRef.currentTime = time;
			this.setState({ currentTime: time });
		}
	};

	checkForBooks = async ({ filesetId, bookId, chapter }) => {
		// console.log('running check for books', filesetId, bookId, chapter);
		if (!filesetId) return;
		const reqUrl = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${filesetId}/books?key=${
			process.env.DBP_API_KEY
		}&bucket=dbp-vid&fileset_type=video_stream&v=4`;

		try {
			const res = await request(reqUrl);
			// console.log('res', res);

			if (res.data) {
				const hasVideo = !!res.data.filter(
					(stream) =>
						stream.book_id === bookId && stream.chapters.includes(chapter),
				).length;
				// console.log('has video', hasVideo);
				this.props.dispatch(setHasVideo({ state: hasVideo }));
			} else {
				this.props.dispatch(setHasVideo({ state: false }));
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.log('Error checking for context', err); // eslint-disable-line no-console
			}
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
		// console.log('called handle with: ', video, '\nand state: ', this.state);
		const { bookId, chapter } = this.props;
		// console.log('bookId, chapter', bookId, chapter);

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
				// console.log('new curprent video', this.state.currentVideo);
				// console.log('The current video ref', this.videoRef);

				this.playVideo({ thumbnailClick: true });
			},
		);
	};

	initHls = () => {
		// Not really sure I need to do this, but it seems like I do
		if (this.hls) {
			this.hls.destroy();
		}
		this.hls = new Hls();
		this.hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
				// console.log('There was a fatal hls error', event, data);
				switch (data.type) {
					case Hls.ErrorTypes.NETWORK_ERROR:
						this.hls.startLoad();
						break;
					case Hls.ErrorTypes.MEDIA_ERROR:
						this.hls.recoverMediaError();
						break;
					default:
						this.hls.destroy();
						break;
				}
			}
		});
	};

	initVideoStream = ({ thumbnailClick }) => {
		const { currentVideo } = this.state;
		this.initHls();
		try {
			if (this.videoRef) {
				if (currentVideo.source) {
					// console.log('currentVideo.source', currentVideo.source);
					// console.log('this.hls.url after new init', this.hls.url);

					this.hls.attachMedia(this.videoRef);
					this.hls.loadSource(
						`${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`,
					);

					// if (this.hls.media && typeof this.hls.media.poster !== 'undefined') {
					// 	this.hls.media.poster = currentVideo.poster;
					// }
					this.hls.media.addEventListener(
						'timeupdate',
						this.timeUpdateEventListener,
					);
					this.hls.media.addEventListener('seeking', this.seekingEventListener);
					this.hls.media.addEventListener('seeked', this.seekedEventListener);
					this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
						// this.hls.media.volume = 0;
						if (this.state.playerOpen && thumbnailClick) {
							// console.log('manifest parsed for init hls');
							this.hls.media.play();
							this.setState({ paused: false });
						}
					});
					this.hls.on(Hls.Events.BUFFER_APPENDING, () => {
						// console.log('buffer was APPENDING', this.hls.media.buffered);
						this.setBuffer();
					});
				}
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.log('initVideoStream', err); // eslint-disable-line no-console
			}
		}
	};

	timeUpdateEventListener = (e) => {
		// console.log('timeUpdateEventListener buffer', this.findBuffer(e.target.currentTime));
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	seekingEventListener = (e) => {
		// console.log('seekingEventListener buffer', this.hls.media.buffered);
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	seekedEventListener = (e) => {
		// console.log('seekedEventListener buffer', this.hls.media.buffered);
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	sortPlaylist = (a, b) => {
		// if vids are from the same chapter
		if (a.chapterStart === b.chapterStart) {
			return a.verse_start > b.verse_start;
		} else if (a.chapterStart > b.chapterStart) {
			// vids are from different chapters and a is after b
			return false;
		} else if (a.chapterStart < b.chapterStart) {
			// a is before b
			return true;
		}
		// Last resort is to just sort by the ids, this breaks because mrk_10_12 will be listed before mrk_10_2
		return a.id > b.id;
	};

	playVideo = ({ thumbnailClick }) => {
		const { currentVideo } = this.state;
		try {
			// if the current video has a source (initial load may be an empty object)
			if (currentVideo.source) {
				// console.log('current === hls.url', this.hls.url === `${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`);
				// if there is already an hls stream and that streams url is equal to this videos source then play the video
				// console.log('this.hls.url in play video', this.hls.url);
				if (
					this.hls.media &&
					this.hls.url ===
						`${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`
				) {
					// console.log('playing from old hls media');
					this.hls.media.play();
					this.setState({ paused: false });
					// if the sourcees didn't match then this is a new video and the hls stream needs to be updated
				} else {
					// console.log('loading source in else with new hls');
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
	};

	pauseVideo = () => {
		this.videoRef.pause();
		this.setState({ paused: true, elipsisOpen: false });
	};

	closePlayer = () => {
		this.setState({ playerOpen: false, paused: true });
		this.pauseVideo();
		this.props.dispatch(closeVideoPlayer());
	};

	openPlayer = () => {
		this.setState({ playerOpen: true });
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
		playlist.forEach((video) => {
			if (video.id < currentVideo.id) {
				previousVideo = video;
			}
		});
		// console.log('previous video', previousVideo);

		return previousVideo;
	}

	get nextVideo() {
		const { playlist, currentVideo } = this.state;
		let nextVideo;
		let foundNext = false;
		playlist.forEach((video) => {
			if (video.id > currentVideo.id && !foundNext) {
				nextVideo = video;
				foundNext = true;
			}
		});
		// console.log('next video', nextVideo);

		return nextVideo;
	}

	previousFunction = (e) => {
		e.stopPropagation();
		if (this.previousVideo) {
			this.handleThumbnailClick(this.previousVideo);
		}
		// console.log('clicked the previous function');
	};

	nextFunction = (e) => {
		e.stopPropagation();
		if (this.nextVideo) {
			this.handleThumbnailClick(this.nextVideo);
		}
		// console.log('clicked the next function');
	};

	render() {
		const {
			playerOpen,
			playlist,
			volume,
			paused,
			elipsisOpen,
			currentVideo,
			currentTime,
			bufferLength,
		} = this.state;
		const { hasVideo, fileset } = this.props;
		// console.log('playlist', playlist);
		// console.log('currentVideo', currentVideo);
		// console.log('hasVideo', hasVideo);
		// Don't bother rendering anything if there is no video for the chapter
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
						playFunction={this.playVideo}
						previousVideo={this.previousVideo}
						nextVideo={this.nextVideo}
						previousFunction={this.previousFunction}
						nextFunction={this.nextFunction}
					/>
					{/* <div
						className={
							paused
								? 'play-video-container show-play'
								: 'play-video-container hide-play'
						}
					>
						<span className={'play-video-title'}>
							{currentVideo.title || 'Loading'}
						</span>
						{this.playButton}
					</div> */}
					<video
						ref={this.setVideoRef}
						onClick={this.handleVideoClick}
						poster={`${process.env.CDN_STATIC_FILES}/${currentVideo.thumbnail}`}
					/>
					<VideoProgressBar
						paused={paused}
						currentTime={currentTime}
						duration={currentVideo.duration || 300}
						setCurrentTime={this.setCurrentTime}
						bufferLength={bufferLength}
					/>
					<VideoControls
						paused={paused}
						pauseVideo={this.pauseVideo}
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
	// videoList: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

const mapStateToProps = createStructuredSelector({
	// homepage: makeSelectHomePage(),
	// videoList: selectVideoList(),
	hasVideo: selectHasVideo(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'videoPlayer', reducer });
// const withSaga = injectSaga({ key: 'videoPlayer', saga})

export default compose(withConnect)(VideoPlayer);
// export default compose(withConnect, withReducer, withSaga)(VideoPlayer);
