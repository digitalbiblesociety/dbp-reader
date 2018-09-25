import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import makeSelectHomePage from '../HomePage/selectors';
import { openVideoPlayer, closeVideoPlayer } from './actions';
import SvgWrapper from '../../components/SvgWrapper';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';
import VideoProgessBar from '../../components/VideoProgressBar';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: false,
		volume: 1,
		paused: true,
		elipsisOpen: false,
		currentTime: 0,
		playlist: [
			{
				title: 'Mark 2',
				id: 2,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 3',
				id: 3,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 4',
				id: 4,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 5',
				id: 5,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 6',
				id: 6,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 7',
				id: 7,
				duration: 300,
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
		],
		currentVideo: {
			title: 'Mark 1',
			id: 1,
			duration: 300,
			poster: '/static/example_poster_image.png',
			source:
				'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
		},
	};

	componentDidMount() {
		this.initVideoStream();
	}

	componentWillUnmount() {
		this.hls.media.removeEventListener(
			'timeupdate',
			this.timeUpdateEventListener,
		);
		this.hls.media.removeEventListener('seeking', this.seekingEventListener);
		this.hls.media.removeEventListener('seeked', this.seekedEventListener);
	}

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
		this.hls.loadSource(currentVideo.source);
		this.hls.attachMedia(this.videoRef);
		if (this.hls.media && typeof this.hls.media.poster !== 'undefined') {
			this.hls.media.poster = currentVideo.poster;
		}
		this.hls.media.addEventListener('timeupdate', this.timeUpdateEventListener);
		this.hls.media.addEventListener('seeking', this.seekingEventListener);
		this.hls.media.addEventListener('seeked', this.seekedEventListener);
		this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
			// console.log('Adding poster for video');
			if (this.videoRef && typeof this.videoRef.poster !== 'undefined') {
				this.videoRef.poster = currentVideo.poster;
			}
		});
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

		if (this.hls.media) {
			// console.log('playing from hls media');
			this.hls.media.play();
			this.setState({ paused: false });
		} else {
			// console.log('playing without hls media');
			this.hls.loadSource(currentVideo.source);
			this.hls.attachMedia(this.videoRef);
			this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
				this.videoRef.play();
				this.setState({ paused: false });
			});
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
						<span className={'play-video-title'}>{currentVideo.title}</span>
						{this.playButton}
					</div>
					<video ref={this.setVideoRef} onClick={this.handleVideoClick} />
					<VideoProgessBar
						paused={paused}
						currentTime={currentTime}
						duration={currentVideo.duration}
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
};

const mapDispatchToProps = (dispatch) => ({
	dispatch,
});

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
});

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

export default compose(withConnect)(VideoPlayer);
