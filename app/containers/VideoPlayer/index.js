import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
// import makeSelectHomePage from '../HomePage/selectors';
// import { openVideoPlayer, closeVideoPlayer, getVideoList } from './actions';
import { openVideoPlayer, closeVideoPlayer } from './actions';
// import { selectVideoList } from './selectors';
import SvgWrapper from '../../components/SvgWrapper';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';
import VideoProgressBar from '../../components/VideoProgressBar';
// import injectReducer from '../../utils/injectReducer';
// import injectSaga from '../../utils/injectSaga';
// import reducer from './reducer';
// import saga from './sagas';
import request from '../../utils/request';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
		volume: 1,
		paused: true,
		elipsisOpen: false,
		currentTime: 0,
		playlist: [],
		currentVideo: {},
	};

	componentDidMount() {
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
		// console.log('this.props', this.props);
		// this.props.dispatch(getVideoList());
		const filesetId = this.props.filesets.filter(
			(f) => f.type === 'video_stream',
		)[0];
		// console.log('filesetid', filesetId);
		this.getVideos({
			filesetId: filesetId ? filesetId.id : 'FALTBLP2DV',
			bookId: this.props.bookId || 'MRK',
		});
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (((nextProps.videoList.length && !this.props.videoList.length) || nextProps.videoList.length !== this.props.videoList.length) && nextProps.videoList.length) {
	// 	}
	// }

	componentWillUnmount() {
		this.hls.media.removeEventListener(
			'timeupdate',
			this.timeUpdateEventListener,
		);
		this.hls.media.removeEventListener('seeking', this.seekingEventListener);
		this.hls.media.removeEventListener('seeked', this.seekedEventListener);
	}

	getVideos = async ({ filesetId, bookId }) => {
		// const urlForBible = `https://api.dbp4.org/bibles/FALTBL?key=${process.env.DBP_API_KEY}&v=4&bucket_id=dbp-vid`;

		// try {
		// 	const res = await request(urlForBible);

		// 	if (res.data) {

		// 	}
		// } catch (err) {
		// 	if (process.env.NODE_ENV === 'development') {
		// 		console.log('Error getting bible with video content', err);
		// 	}
		// }
		console.log('filesetId, bookId', filesetId, bookId);
		const requestUrl = `https://api.dbp4.org/bibles/filesets/${filesetId}?key=${
			process.env.DBP_API_KEY
		}&v=4&type=video_stream&bucket=dbp-vid&book_id=${bookId}`;

		try {
			const response = await request(requestUrl);
			console.log('all the vids', response);

			if (response.data) {
				const playlist = response.data.map((video) => ({
					title: `${video.book_name} ${video.chapter_start}`,
					id: `${video.book_id}_${video.chapter_start}_${video.verse_start}`,
					source: video.path,
					duration: video.duration || 300,
				}));

				this.setState({
					playlist: playlist.slice(1),
					currentVideo: playlist[0],
				});
				this.initVideoStream();
			} else {
				this.setState({ playlist: [], currentVideo: {} });
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

	handleVideoClick = () => {
		const { paused } = this.state;

		if (paused) {
			this.playVideo();
		} else {
			this.pauseVideo();
		}
	};

	handleThumbnailClick = (video) => {
		this.setState(
			(state) => ({
				playlist: state.playlist
					.filter((v) => v.id !== video.id)
					.concat([state.currentVideo])
					.sort(this.sortPlaylist),
				currentVideo: video,
			}),
			() => {
				// console.log('The current video ref', this.videoRef);
				this.playVideo();
			},
		);
	};

	initVideoStream = () => {
		const { currentVideo } = this.state;
		if (currentVideo.source) {
			console.log('loading source');
			this.hls.loadSource(currentVideo.source);
			this.hls.attachMedia(this.videoRef);
			if (this.hls.media && typeof this.hls.media.poster !== 'undefined') {
				this.hls.media.poster = currentVideo.poster;
			}
			this.hls.media.addEventListener(
				'timeupdate',
				this.timeUpdateEventListener,
			);
			this.hls.media.addEventListener('seeking', this.seekingEventListener);
			this.hls.media.addEventListener('seeked', this.seekedEventListener);
			this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
				// console.log('Adding poster for video');
				console.log('manifest was parsed');
				if (this.videoRef && typeof this.videoRef.poster !== 'undefined') {
					this.videoRef.poster = currentVideo.poster;
				}
			});
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

	sortPlaylist = (a, b) => a.id > b.id;

	playVideo = () => {
		const { currentVideo } = this.state;
		if (currentVideo.source) {
			if (this.hls.media) {
				console.log('playing from hls media');
				this.hls.media.play();
				this.setState({ paused: false });
			} else {
				console.log('loading source in else');
				this.hls.loadSource(currentVideo.source);
				this.hls.attachMedia(this.videoRef);
				this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
					this.videoRef.play();
					this.setState({ paused: false });
				});
			}
		}
	};

	pauseVideo = () => {
		this.videoRef.pause();
		this.setState({ paused: true, elipsisOpen: false });
	};

	closePlayer = () => {
		this.setState({ playerOpen: false, paused: true });
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

	render() {
		const {
			playerOpen,
			playlist,
			volume,
			paused,
			elipsisOpen,
			currentVideo,
			currentTime,
		} = this.state;
		console.log('playlist', playlist);
		console.log('currentVideo', currentVideo);
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
					<div
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
					</div>
					<video ref={this.setVideoRef} onClick={this.handleVideoClick} />
					<VideoProgressBar
						paused={paused}
						currentTime={currentTime}
						duration={currentVideo.duration || 300}
						setCurrentTime={this.setCurrentTime}
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
	filesets: PropTypes.array.isRequired,
	bookId: PropTypes.string.isRequired,
	// videoList: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

const mapStateToProps = createStructuredSelector({
	// homepage: makeSelectHomePage(),
	// videoList: selectVideoList(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

// const withReducer = injectReducer({ key: 'videoPlayer', reducer });
// const withSaga = injectSaga({ key: 'videoPlayer', saga})

export default compose(withConnect)(VideoPlayer);
// export default compose(withConnect, withReducer, withSaga)(VideoPlayer);
