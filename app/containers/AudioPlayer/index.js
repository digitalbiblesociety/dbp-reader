/**
 *
 * AudioPlayer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import injectReducer from 'utils/injectReducer';
// import closeEventHoc from 'components/CloseEventHoc';
import SvgWrapper from 'components/SvgWrapper';
import SpeedControl from 'components/SpeedControl';
import AudioProgressBar from 'components/AudioProgressBar';
import VolumeSlider from 'components/VolumeSlider';
// import AudioPlayerMenu from 'components/AudioPlayerMenu';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import makeSelectAudioPlayer, { selectHasAudio } from './selectors';
import reducer from './reducer';
import messages from './messages';
/* eslint-disable jsx-a11y/media-has-caption */
/* disabled the above eslint config options because you can't add tracks to audio elements */

export class AudioPlayer extends React.Component {
	// eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		// need to get next and prev audio tracks if I want to enable continuous playing
		this.state = {
			playing: false,
			speedControlState: false,
			volumeSliderState: false,
			elipsisState: false,
			volume: 1,
			duration: 100,
			currentTime: 0,
			currentSpeed: 1,
			autoPlayChecked: this.props.autoPlay,
			nextTrack: {
				index: 0,
				path: this.props.audioPaths[0],
				last: this.props.audioPaths.length === 0,
			},
		};
	}

	componentDidMount() {
		if (this.props.audioPaths.length) {
			this.props.audioPaths.forEach((path) => this.preLoadPath(path));
		}
		// If auto play is enabled I need to start the player
		if (this.props.autoPlay) {
			// console.log('component mounted and auto play was true');
			if (
				navigator &&
				navigator.userAgent &&
				/iPhone|iPod|iPad/i.test(navigator.userAgent)
			) {
				this.audioRef.addEventListener('loadedmetadata', this.autoPlayListener);
			} else {
				this.audioRef.addEventListener('canplay', this.autoPlayListener);
			}
		}
		this.audioRef.playbackRate = this.state.currentSpeed;
		// Add all the event listeners I need for the audio player
		this.audioRef.addEventListener(
			'durationchange',
			this.durationChangeEventListener,
		);
		this.audioRef.addEventListener('timeupdate', this.timeUpdateEventListener);
		this.audioRef.addEventListener('seeking', this.seekingEventListener);
		this.audioRef.addEventListener('seeked', this.seekedEventListener);
		this.audioRef.addEventListener('ended', this.endedEventListener);
		this.audioRef.addEventListener('playing', this.playingEventListener);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.audioSource !== this.props.audioSource) {
			// this.pauseAudio();
			if (nextProps.audioSource) {
				this.setState({ playing: false });
			} else if (this.props.audioPlayerState && !nextProps.audioSource) {
				this.setState({ playing: false }, () =>
					this.props.setAudioPlayerState(false),
				);
			}
			if (nextProps.autoPlay) {
				// console.log('source changed and auto play is true');
				if (
					navigator &&
					navigator.userAgent &&
					/iPhone|iPod|iPad/i.test(navigator.userAgent)
				) {
					this.audioRef.addEventListener(
						'loadedmetadata',
						this.autoPlayListener,
					);
				} else {
					this.audioRef.addEventListener('canplay', this.autoPlayListener);
				}
			}
		}

		if (!nextProps.autoPlay) {
			// console.log('auto play is now false');
			if (
				navigator &&
				navigator.userAgent &&
				/iPhone|iPod|iPad/i.test(navigator.userAgent)
			) {
				this.audioRef.removeEventListener(
					'loadedmetadata',
					this.autoPlayListener,
				);
			} else {
				this.audioRef.removeEventListener('canplay', this.autoPlayListener);
			}
		}

		if (
			!isEqual(nextProps.audioPaths, this.props.audioPaths) &&
			nextProps.audioPaths.length
		) {
			nextProps.audioPaths.forEach((path) => this.preLoadPath(path));
			// console.log('prev audio paths', this.props.audioPaths);
			// console.log('next audio paths', nextProps.audioPaths);
			this.setState({
				nextTrack: {
					index: 0,
					path: nextProps.audioPaths[0],
					last: nextProps.audioPaths.length === 0,
				},
			});
		}
	}

	componentDidUpdate() {
		if (this.audioRef) {
			this.audioRef.playbackRate = this.state.currentSpeed;
		}
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (nextState.volume !== this.state.volume || nextState.currentTime !== this.state.currentTime) {
	// 		console.log('audio player should not update');
	// 		return false;
	// 	}
	// 	if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
	// 		console.log('audio player should update');
	// 		return true;
	// 	}
	// 	return false;
	// }

	componentWillUnmount() {
		// Removing all the event listeners in the case that this component is unmounted
		if (
			navigator &&
			navigator.userAgent &&
			/iPhone|iPod|iPad/i.test(navigator.userAgent)
		) {
			this.audioRef.removeEventListener(
				'loadedmetadata',
				this.autoPlayListener,
			);
		} else {
			this.audioRef.removeEventListener('canplay', this.autoPlayListener);
		}
		this.audioRef.removeEventListener(
			'durationchange',
			this.durationChangeEventListener,
		);
		this.audioRef.removeEventListener(
			'timeupdate',
			this.timeUpdateEventListener,
		);
		this.audioRef.removeEventListener('seeking', this.seekingEventListener);
		this.audioRef.removeEventListener('seeked', this.seekedEventListener);
		this.audioRef.removeEventListener('ended', this.endedEventListener);
		this.audioRef.removeEventListener('playing', this.playingEventListener);
	}

	setCurrentTime = (time) => {
		// alert(`value in set time function: ${time}`);
		this.setState(
			{
				currentTime: time,
			},
			() => {
				this.audioRef.currentTime = time;
			},
		);
	};

	setAudioPlayerRef = (el) => {
		this.audioPlayerContainer = el;
	};

	setSpeedControlState = (state) =>
		this.setState({
			speedControlState: state,
		});

	setVolumeSliderState = (state) =>
		this.setState({
			volumeSliderState: state,
		});

	setElipsisState = (state) =>
		this.setState({
			elipsisState: state,
		});

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

	handleRef = (el) => {
		// alert('Audio ref changed');
		this.audioRef = el;
	};

	handleBackgroundClick = () => {
		if (!this.props.audioPlayerState) {
			this.toggleAudioPlayer();
		}
	};

	updateVolume = (volume) => {
		this.audioRef.volume = volume;
		this.setState({
			volume,
		});
	};

	autoPlayListener = () => {
		// alert('auto play listener fired');
		// can accept event as a parameter
		// console.log('can play fired and was true');
		this.playAudio();
	};

	durationChangeEventListener = (e) => {
		this.setState({
			duration: e.target.duration,
		});
	};

	timeUpdateEventListener = (e) => {
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	seekingEventListener = (e) => {
		// console.log('player is seeking', e);
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	seekedEventListener = (e) => {
		// console.log('player is done seeking', e);
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	endedEventListener = () => {
		// console.log('ended and autoplay was ', this.props.autoPlay);
		if (!this.state.nextTrack.last && this.props.audioPaths.length) {
			// console.log('tracks in state', this.state.nextTrack);
			// console.log('src before', this.audioRef.src);
			this.audioRef.src = this.state.nextTrack.path;
			// console.log('src after', this.audioRef.src);
			this.setState(
				(prevState) => ({
					nextTrack: {
						path: this.props.audioPaths[prevState.nextTrack.index + 1],
						index: prevState.nextTrack.index + 1,
						last:
							this.props.audioPaths.length === prevState.nextTrack.index + 1,
					},
					// May need to trigger a play event after the next track loaded in
				}),
				() => this.playAudio(),
			);
		} else {
			// console.log('in else for ended event listener');
			if (this.props.autoPlay) {
				this.skipForward();
			}
			this.pauseAudio();
		}
	};

	preLoadPath = (path) => {
		// console.log('loading path', path);
		const audio = new Audio();

		// audio.addEventListener('loadedmetadata', () => console.log('can play through'), false);
		audio.src = path;
	};

	playingEventListener = (e) => {
		// console.log('playing status', e.target.paused);
		// console.log('playing ended', e.target.ended);
		if (this.state.playing && e.target.paused) {
			this.setState({
				playing: false,
			});
		} else if (!this.state.playing && !e.target.paused) {
			this.setState({
				playing: true,
			});
		}
	};

	pauseAudio = () => {
		this.audioRef.pause();
		this.setState({
			playing: false,
		});
	};

	playAudio = () => {
		// alert(`audio ref\n ${this.audioRef}`);
		// alert(`play function\n ${this.audioRef.play}`);
		this.audioRef.play().then(() => {
			// alert('audio should be playing now');
			this.setState({
				playing: true,
			});
		}); // .catch((e) => alert(`There was a problem playing the audio: \n${e}`));
	};

	updatePlayerSpeed = (rate) => {
		if (this.state.currentSpeed !== rate) {
			this.audioRef.playbackRate = rate;
			this.setState({
				currentSpeed: rate,
			});
		}
	};

	skipBackward = () => {
		this.setCurrentTime(0);
		this.pauseAudio();
		this.props.skipBackward();
		this.setState({
			playing: false,
		});
	};

	skipForward = () => {
		this.setCurrentTime(0);
		this.pauseAudio();
		this.props.skipForward();
		this.setState({
			playing: false,
		});
	};

	toggleAudioPlayer = () => {
		if (this.props.audioSource && this.props.hasAudio) {
			this.props.setAudioPlayerState(!this.props.audioPlayerState);
		}
	};

	handleAutoPlayChange = (e) => {
		this.setState({ autoPlayChecked: e.target.checked });
		this.props.toggleAutoPlay();
	};
	// Simpler to close all modals than to try and figure out which one to close
	closeModals = ({ speed, volume }) => {
		if (speed === 'speed') {
			this.setState({
				speedControlState: false,
			});
		} else if (volume === 'volume') {
			this.setState({
				volumeSliderState: false,
			});
		} else {
			this.setState({
				volumeSliderState: false,
				speedControlState: false,
				elipsisState: false,
			});
		}
	};

	get currentSpeedSvg() {
		const { currentSpeed } = this.state;

		if (currentSpeed === 0.75) {
			return (
				<SvgWrapper className={'icon'} fill="#fff" svgid="playback_0.75x" />
			);
		} else if (currentSpeed === 1) {
			return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_1x" />;
		} else if (currentSpeed === 1.25) {
			return (
				<SvgWrapper className={'icon'} fill="#fff" svgid="playback_1.25x" />
			);
		} else if (currentSpeed === 1.5) {
			return (
				<SvgWrapper className={'icon'} fill="#fff" svgid="playback_1.5x" />
			);
		}
		return <SvgWrapper className={'icon'} fill="#fff" svgid="playback_2x" />;
	}

	nextIcon = (
		<div
			role={'button'}
			tabIndex={0}
			onClick={this.skipForward}
			className={'icon-wrap'}
			title={messages.nextTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="next" />
			<FormattedMessage {...messages.next} />
		</div>
	);

	prevIcon = (
		<div
			onClick={this.skipBackward}
			role={'button'}
			tabIndex={0}
			className={'icon-wrap'}
			title={messages.prevTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="previous" />
			<FormattedMessage {...messages.prev} />
		</div>
	);

	pauseIcon = (
		<div
			onClick={this.pauseAudio}
			role={'button'}
			tabIndex={0}
			className={'icon-wrap'}
			title={messages.pauseTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="pause" />
			<FormattedMessage {...messages.pause} />
		</div>
	);

	playIcon = (
		<div
			onClick={this.playAudio}
			role={'button'}
			tabIndex={0}
			className={'icon-wrap'}
			title={messages.playTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="play" />
			<FormattedMessage {...messages.play} />
		</div>
	);

	render() {
		const {
			audioSource: source,
			hasAudio,
			audioPlayerState,
			isScrollingDown,
		} = this.props;
		const { autoPlayChecked, currentSpeed } = this.state;

		return (
			<GenericErrorBoundary affectedArea="AudioPlayer">
				<div
					role={'button'}
					tabIndex={0}
					className={
						audioPlayerState && hasAudio && source !== ''
							? `audioplayer-handle${isScrollingDown ? ' scrolled-down' : ''}`
							: `audioplayer-handle closed${
									isScrollingDown ? ' scrolled-down' : ''
							  }`
					}
					onClick={(e) => {
						e.stopPropagation();
						this.toggleAudioPlayer();
					}}
				>
					<SvgWrapper
						width="26px"
						height="26px"
						className={
							audioPlayerState ? 'audio-gripper' : 'audio-gripper closed'
						}
						style={{ cursor: source ? 'pointer' : 'inherit' }}
						svgid="arrow_down"
					/>
				</div>
				<div
					role="button"
					tabIndex={0}
					className={
						audioPlayerState && hasAudio && source !== ''
							? `audio-player-background${
									isScrollingDown ? ' scrolled-down' : ''
							  }`
							: `audio-player-background closed${
									isScrollingDown ? ' scrolled-down' : ''
							  }`
					}
					ref={this.setAudioPlayerRef}
					onClick={this.handleBackgroundClick}
				>
					<div
						className={
							audioPlayerState && hasAudio && source !== ''
								? 'audio-player-container'
								: 'audio-player-container closed'
						}
					>
						{this.prevIcon}
						{this.state.playing ? this.pauseIcon : this.playIcon}
						{this.nextIcon}
						<AudioProgressBar
							setCurrentTime={this.setCurrentTime}
							duration={this.state.duration}
							currentTime={this.state.currentTime}
						/>
						<div
							id={'autoplay-wrap'}
							className={'icon-wrap'}
							title={messages.autoplayTitle.defaultMessage}
						>
							<input
								id={'autoplay'}
								className={'custom-checkbox'}
								type="checkbox"
								onChange={this.handleAutoPlayChange}
								defaultChecked={autoPlayChecked}
							/>
							<label htmlFor={'autoplay'}>
								<FormattedMessage {...messages.autoplay} />
							</label>
						</div>
						<div id="volume-wrap" className={'icon-wrap'}>
							<div
								title={messages.volumeTitle.defaultMessage}
								role="button"
								tabIndex="0"
								className={
									this.state.volumeSliderState ? 'item active' : 'item'
								}
								onTouchEnd={(e) => {
									e.preventDefault();
									if (!this.state.volumeSliderState) {
										this.setVolumeSliderState(true);
									}
									this.setSpeedControlState(false);
									this.setElipsisState(false);
								}}
								onClick={() => {
									if (!this.state.volumeSliderState) {
										this.setVolumeSliderState(true);
									}
									this.setSpeedControlState(false);
									this.setElipsisState(false);
								}}
							>
								{this.getVolumeSvg(this.state.volume)}
								<FormattedMessage {...messages.volume} />
							</div>
							{/* <this.volumeControl updateVolume={this.updateVolume} volume={this.state.volume} /> */}
							<VolumeSlider
								active={this.state.volumeSliderState}
								onCloseFunction={this.closeModals}
								updateVolume={this.updateVolume}
								volume={this.state.volume}
							/>
						</div>
						<div id="speed-wrap" className={'icon-wrap'}>
							<div
								title={messages.speedTitle.defaultMessage}
								role="button"
								tabIndex="0"
								className={
									this.state.speedControlState ? 'item active' : 'item'
								}
								onTouchEnd={(e) => {
									e.preventDefault();
									if (!this.state.speedControlState) {
										this.setSpeedControlState(true);
									}
									this.setElipsisState(false);
									this.setVolumeSliderState(false);
								}}
								onClick={() => {
									if (!this.state.speedControlState) {
										this.setSpeedControlState(true);
									}
									this.setElipsisState(false);
									this.setVolumeSliderState(false);
								}}
							>
								{this.currentSpeedSvg}
								<FormattedMessage {...messages.speed} />
							</div>
							<SpeedControl
								active={this.state.speedControlState}
								options={[0.75, 1, 1.25, 1.5, 1.75]}
								onCloseFunction={this.closeModals}
								setSpeed={this.updatePlayerSpeed}
								currentSpeed={currentSpeed}
							/>
						</div>
					</div>
					<audio ref={this.handleRef} className="audio-player" src={source} />
				</div>
			</GenericErrorBoundary>
		);
	}
}

AudioPlayer.propTypes = {
	audioSource: PropTypes.string,
	audioPaths: PropTypes.array,
	skipBackward: PropTypes.func.isRequired,
	skipForward: PropTypes.func.isRequired,
	setAudioPlayerState: PropTypes.func.isRequired,
	toggleAutoPlay: PropTypes.func,
	hasAudio: PropTypes.bool,
	autoPlay: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	audioPlayerState: PropTypes.bool.isRequired,
	// prevAudioSource: PropTypes.string,
	// nextAudioSource: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
	audioplayer: makeSelectAudioPlayer(),
	hasAudio: selectHasAudio(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'audioPlayer', reducer });

export default compose(
	withReducer,
	withConnect,
)(AudioPlayer);
