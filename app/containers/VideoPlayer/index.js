import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Hls from 'hls.js';
import SvgWrapper from '../../components/SvgWrapper';
import makeSelectHomePage from '../HomePage/selectors';
import VolumeSlider from '../../components/VolumeSlider';

class VideoPlayer extends React.PureComponent {
	state = {
		playerOpen: true,
		volume: 1,
		paused: true,
		volumeSliderState: false,
		elipsisOpen: true,
		playlist: [
			{ title: 'Mark 2', duration: '05:00', poster: '' },
			{ title: 'Mark 3', duration: '05:00', poster: '' },
			{ title: 'Mark 4', duration: '05:00', poster: '' },
			{ title: 'Mark 5', duration: '05:00', poster: '' },
			{ title: 'Mark 6', duration: '05:00', poster: '' },
			{ title: 'Mark 7', duration: '05:00', poster: '' },
		],
		source:
			'https://s3-us-west-2.amazonaws.com/dbp-vid/hls/FALTBL/FALTBLN2DA/Mark_1-1-20R_1FALTBL/FALTBLN2DA/Mark_1-1-20R_1.m3u8',
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

	handleVideoClick = () => {
		const { paused } = this.state;

		if (paused) {
			this.playVideo();
		} else {
			this.pauseVideo();
		}
	};

	initVideoStream = () => {
		const { source } = this.state;

		this.hls = new Hls();
		this.hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
				console.log('There was a fatal hls error', event, data);
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
		this.hls.loadSource(source);
		this.hls.attachMedia(this.videoRef);
		this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
			// this.videoRef.play();
			// this.videoRef.pause();
			// this.setState({ paused: true })
		});
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

	toggleElipsis = () => {
		this.setState((currentState) => ({
			elipsisOpen: !currentState.elipsisOpen,
		}));
	};

	updateVolume = (volume) => {
		this.videoRef.volume = volume;
		this.setState({ volume });
	};

	closeModals = () => {
		this.setState({ volumeSliderState: false });
	};

	openVolumeSlider = () => {
		this.setState({ volumeSliderState: true });
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
			volumeSliderState,
			elipsisOpen,
		} = this.state;
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
						<video ref={this.setVideoRef} onClick={this.handleVideoClick} />
						<div className={paused ? 'controls hide-controls' : 'controls'}>
							<div className={'left-controls'}>
								<div
									className={'video-volume-container'}
									onTouchEnd={(e) => {
										e.preventDefault();
										if (!volumeSliderState) {
											this.openVolumeSlider();
										}
									}}
									onClick={() => {
										if (!volumeSliderState) {
											this.openVolumeSlider();
										}
									}}
								>
									<VolumeSlider
										active={volumeSliderState}
										onCloseFunction={this.closeModals}
										updateVolume={this.updateVolume}
										volume={volume}
										railStyle={{
											width: '2px',
											backgroundColor: '#000',
										}}
										trackStyle={{
											backgroundColor: 'rgba(98, 177, 130, 1)',
											width: '2px',
										}}
										handleStyle={{
											width: '12.5px',
											height: '12.5px',
											backgroundColor: 'rgba(98, 177, 130, 1)',
											borderColor: 'rgba(98, 177, 130, 1)',
											left: '5px',
										}}
										sliderContainerClassName={'video-slider-container'}
										activeClassNames={'video-volume-slider-container active'}
										inactiveClassNames={'video-volume-slider-container'}
										vertical
									/>
									{this.getVolumeSvg(volume)}
								</div>
								<SvgWrapper
									onClick={this.pauseVideo}
									fill={'#fff'}
									svgid={'pause'}
								/>
							</div>
							<div className={'right-controls'}>
								<SvgWrapper
									fill={'#fff'}
									onClick={this.toggleElipsis}
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
						<div
							className={
								elipsisOpen
									? 'video-elipsis-container active'
									: 'video-elipsis-container'
							}
						>
							<div className={'video-elipsis-menu'}>
								<div className={'video-elipsis-header'}>
									<SvgWrapper
										className={'gospel-films'}
										svgid={'gospel_films'}
									/>
									<span className={'title-text'}>Gospel Films</span>
									<SvgWrapper
										className={'close-arrow'}
										fill={'#fff'}
										svgid={'arrow_down'}
									/>
								</div>
								<div className={'video-thumbnail-list'}>
									{playlist.map((video) => (
										<div className={'video-thumbnail'}>
											<img
												className={'thumbnail-poster'}
												src={video.poster}
												alt={`There was no video for: ${video.title}`}
											/>
											<div className={'thumbnail-metadata'}>
												<span className={'thumbnail-title'}>{video.title}</span>
												<span className={'thumbnail-duration'}>
													{video.duration}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
					<div onClick={this.closePlayer} className={'black-bar'}>
						<SvgWrapper className={'up-arrow'} svgid={'arrow_up'} />
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
