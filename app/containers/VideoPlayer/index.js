import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import Router from 'next/router';
import cachedFetch, { overrideCache } from '../../utils/cachedFetch';
import { openVideoPlayer, closeVideoPlayer, setHasVideo } from './actions';
import SvgWrapper from '../../components/SvgWrapper';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';
import VideoProgressBar from '../../components/VideoProgressBar';
import VideoOverlay from '../../components/VideoOverlay';
import deepDifferenceObject from '../../utils/deepDifferenceObject';
import { selectHasVideo } from './selectors';

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
			(nextProps.fileset &&
				this.props.fileset &&
				Object.keys(deepDifferenceObject(nextProps.fileset, this.props.fileset))
					.length)
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

	// Checks to see if we have video content for the selected chapter
	checkForBooks = async ({ filesetId, bookId, chapter }) => {
		if (!filesetId) return;
		const reqUrl = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${filesetId}/books?key=${
			process.env.DBP_API_KEY
		}&asset_id=dbp-vid&fileset_type=video_stream&v=4`;

		try {
			// TODO: Profile to see if caching helps here
			const res = await cachedFetch(reqUrl);

			if (res.data) {
				overrideCache(reqUrl, res);

				const hasVideo = !!res.data.filter(
					(stream) =>
						stream.book_id === bookId && stream.chapters.includes(chapter),
				).length;

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

	initHls = () => {
		// Destroying the old hls stream so that there aren't artifacts leftover in the new stream
		if (this.hls) {
			this.hls.destroy();
		}
		this.hls = new Hls();
		this.hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
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
		// Create the hls stream first
		this.initHls();
		try {
			// Check for the video element
			if (this.videoRef) {
				// Make sure that there is a valid source
				if (currentVideo.source) {
					this.hls.attachMedia(this.videoRef);
					this.hls.loadSource(
						`${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`,
					);
					this.hls.media.addEventListener(
						'timeupdate',
						this.timeUpdateEventListener,
					);
					this.hls.media.addEventListener('seeking', this.seekingEventListener);
					this.hls.media.addEventListener('seeked', this.seekedEventListener);
					this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
						if (this.state.playerOpen && thumbnailClick) {
							this.hls.media.play();
							this.setState({ paused: false });
						}
					});
					this.hls.on(Hls.Events.BUFFER_APPENDING, () => {
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
		const { currentVideo } = this.state;
		try {
			// if the current video has a source (initial load may be an empty object)
			if (currentVideo.source) {
				// if there is already an hls stream and that streams url is equal to this videos source then play the video
				if (
					this.hls.media &&
					this.hls.url ===
						`${currentVideo.source}?key=${process.env.DBP_API_KEY}&v=4`
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
			playerOpen,
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
						poster={`${process.env.CDN_STATIC_FILES}/${currentVideo.thumbnail}`}
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
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

const mapStateToProps = createStructuredSelector({
	hasVideo: selectHasVideo(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(VideoPlayer);
