import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import SvgWrapper from '../../components/SvgWrapper';
import makeSelectHomePage from '../HomePage/selectors';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
		volume: 1,
		paused: true,
		source: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
	};

	componentDidMount() {
		this.initVideoStream();
	}

	setVideoRef = (el) => {
		this.videoRef = el;
	};

	getVolumeSvg(volume) {
		if (volume <= 0.25) {
			return <SvgWrapper className={'icon'} fill="#fff" svgid="volume_low" />;
		} else if (volume <= 0.5) {
			return <SvgWrapper className={'icon'} fill="#fff" svgid="volume_1" />;
		} else if (volume <= 0.75) {
			return <SvgWrapper className={'icon'} fill="#fff" svgid="volume_2" />;
		}
		return <SvgWrapper className={'icon'} fill="#fff" svgid="volume_max" />;
	}

	initVideoStream = () => {
		this.hls = new Hls();
		this.hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
				console.log('There was a fatal hls error');
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
		// this.hls.loadSource(
		// 	'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
		// );
		// this.hls.attachMedia(this.videoRef);
	};

	playVideo = () => {
		const { source } = this.state;
		if (this.hls.media) {
			console.log('playing hls media');
			this.hls.media.play();
			this.setState({ paused: false });
		} else {
			console.log('first play');
			this.hls.loadSource(source);
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

	get playButton() {
		const { paused } = this.state;

		return (
			<SvgWrapper
				onClick={this.playVideo}
				className={paused ? 'play-video show-play' : 'play-video hide-play'}
				fill={'#fff'}
				svgid={'play_video'}
				viewBox={'0 0 40 40'}
			/>
		);
	}

	render() {
		const { playerOpen, volume, paused } = this.state;
		/* eslint-disable jsx-a11y/media-has-caption */
		if (playerOpen) {
			return (
				<div className={'video-player-container'}>
					<div className={'video-player'}>
						<div
							className={
								paused
									? 'play-video-container show-play'
									: 'play-video-container hide-play'
							}
						>
							{this.playButton}
						</div>
						<video ref={this.setVideoRef} />
						<div className={paused ? 'controls hide-controls' : 'controls'}>
							<div className={'left-controls'}>
								{this.getVolumeSvg(volume)}
								<SvgWrapper
									onClick={this.pauseVideo}
									fill={'#fff'}
									svgid={'pause'}
								/>
							</div>
							<div className={'right-controls'}>
								<SvgWrapper
									fill={'#fff'}
									className={'video-elipsis'}
									svgid={'elipsis'}
								/>
								<SvgWrapper
									fill={'#fff'}
									className={'video-fullscreen'}
									onClick={this.toggleFullScreen}
									svgid={'fullscreen'}
								/>
							</div>
						</div>
					</div>
					<div onClick={this.closePlayer} className={'black-bar'}>
						<SvgWrapper className={'gospel-films'} svgid={'arrow_up'} />
					</div>
				</div>
			);
		}
		/* eslint-enable jsx-a11y/media-has-caption */
		return (
			<div onClick={this.openPlayer} className={'black-bar'}>
				<SvgWrapper className={'gospel-films'} svgid={'gospel_films'} />
			</div>
		);
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
