import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import SvgWrapper from '../../components/SvgWrapper';
import makeSelectHomePage from '../HomePage/selectors';
import VideoControls from '../../components/VideoControls';
import VideoList from '../../components/VideoList';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
		volume: 1,
		paused: true,
		elipsisOpen: false,
		playlist: [
			{
				title: 'Mark 2',
				id: 2,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 3',
				id: 3,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 4',
				id: 4,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 5',
				id: 5,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 6',
				id: 6,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
			{
				title: 'Mark 7',
				id: 7,
				duration: '05:00',
				poster: '/static/example_poster_image.png',
				source:
					'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
			},
		],
		currentVideo: {
			title: 'Mark 1',
			id: 1,
			duration: '05:00',
			poster: '/static/example_poster_image.png',
			source:
				'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
		},
	};

	componentDidMount() {
		this.initVideoStream();
	}

	setVideoRef = (el) => {
		this.videoRef = el;
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
		this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
			// console.log('Adding poster for video');
			this.videoRef.poster = currentVideo.poster;
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
		this.setState({ paused: true });
	};

	closePlayer = () => {
		this.setState({ playerOpen: false });
	};

	openPlayer = () => {
		this.setState({ playerOpen: true });
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
					<video
						ref={this.setVideoRef}
						onClick={this.handleVideoClick}
						poster={currentVideo.poster}
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
