/**
 *
 * AudioPlayer
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import injectReducer from '../../utils/injectReducer';
import SvgWrapper from '../../components/SvgWrapper';
import SpeedControl from '../../components/SpeedControl';
import AudioProgressBar from '../../components/AudioProgressBar';
import VolumeSlider from '../../components/VolumeSlider';
import makeSelectAudioPlayer, { selectHasAudio } from './selectors';
import reducer from './reducer';
import messages from './messages';
import getNextChapterUrl from '../../utils/getNextChapterUrl';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
/* eslint-disable jsx-a11y/media-has-caption */
/* disabled the above eslint config options because you can't add tracks to audio elements */

export class AudioPlayer extends React.Component {
	// eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		// need to get next and prev audio tracks if I want to enable continuous playing
		this.state = {
			playing: false,
			loadingNextChapter: false,
			speedControlState: false,
			volumeSliderState: false,
			elipsisState: false,
			volume: props.initialVolume || 1,
			duration: 0,
			currentTime: 0,
			currentSpeed: props.initialPlaybackRate || 1,
			autoPlayChecked: props.autoPlay,
			nextTrack: {
				index: 0,
				path: props.audioPaths[0],
				last: props.audioPaths.length === 0,
			},
		};
	}

	componentDidMount() {
		if (this.props.audioPaths.length) {
			this.props.audioPaths.forEach((path) => this.preLoadPath(path));
		}
		// If auto play is enabled I need to start the player
		if (this.props.autoPlay) {
			// Checking User Agent because the canplay event fails silently on mobile apple devices
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

		Router.router.events.on('routeChangeStart', this.handleRouteChange);
		if (this.props.audioSource) {
			this.audioRef.load();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.hasVideo && nextProps.videoPlayerOpen) {
			this.pauseAudio();
		}
		if (nextProps.audioSource !== this.props.audioSource) {
			if (nextProps.audioSource) {
				this.setState({ playing: false, loadingNextChapter: false });
			} else if (this.props.audioPlayerState && !nextProps.audioSource) {
				this.setState({ playing: false }, () =>
					this.props.setAudioPlayerState(false),
				);
			}
		}

		if (nextProps.autoPlay) {
			if (
				navigator &&
				navigator.userAgent &&
				/iPhone|iPod|iPad/i.test(navigator.userAgent)
			) {
				this.audioRef.addEventListener('loadedmetadata', this.autoPlayListener);
			} else {
				this.audioRef.addEventListener('canplay', this.autoPlayListener);
			}
			this.setState({ autoPlayChecked: nextProps.autoPlay });
		} else if (!nextProps.autoPlay) {
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
		// Ensure that the player volume and state volume stay in sync
		if (this.audioRef) {
			if (this.audioRef.volume !== this.state.volume) {
				this.audioRef.volume = this.state.volume;
			}
			// Ensure that the player playback rate and state playback rate stay in sync
			if (this.audioRef.playbackRate !== this.state.currentSpeed) {
				this.audioRef.playbackRate = this.state.currentSpeed;
			}
		}
	}

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

		Router.router.events.off('routeChangeStart', this.handleRouteChange);
	}

	setCurrentTime = (time) => {
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
		this.audioRef = el;
	};

	handleRouteChange = () => {
		this.setCurrentTime(0);
		this.pauseAudio();
		this.setState({ loadingNextChapter: true });
	};

	handleBackgroundClick = () => {
		if (!this.props.audioPlayerState) {
			this.toggleAudioPlayer();
		}
	};

	updateVolume = (volume) => {
		if (volume !== this.state.volume) {
			document.cookie = `bible_is_volume=${volume};path=/`;
			this.audioRef.volume = volume;
			this.setState({
				volume,
			});
		}
	};

	autoPlayListener = () => {
		// can accept event as a parameter
		// If the chapter is loaded and the player is open
		if (!this.state.loadingNextChapter && this.props.audioPlayerState) {
			this.playAudio();
		}
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
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	seekedEventListener = (e) => {
		this.setState({
			currentTime: e.target.currentTime,
		});
	};

	endedEventListener = () => {
		if (!this.state.nextTrack.last && this.props.audioPaths.length) {
			this.audioRef.src = this.state.nextTrack.path;
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
			if (this.props.autoPlay) {
				this.skipForward();
			}
			this.pauseAudio();
		}
	};

	preLoadPath = (path) => {
		const audio = new Audio();
		audio.src = path;
	};

	playingEventListener = (e) => {
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
		if (this.state.loadingNextChapter) {
			return;
		}
		const playPromise = this.audioRef.play();
		// All modern browsers return a promise
		if (this.props.videoPlayerOpen && this.props.hasVideo) {
			this.pauseAudio();
			return;
		}
		// This is only because IE doesn't return a promise
		if (playPromise) {
			playPromise
				.then(() => {
					if (this.state.currentTime !== this.audioRef.currentTime) {
						this.audioRef.currentTime = this.state.currentTime;
					}
					this.setState({
						playing: true,
					});
				})
				.catch((err) => {
					if (process.env.NODE_ENV !== 'production') {
						/* eslint-disable no-console */
						console.error('Error with playing audio: ', err);
						/* eslint-enable no-console */
					}
				});
		} else {
			// This is so IE will still show the svg for the pause button and such
			if (this.state.currentTime !== this.audioRef.currentTime) {
				this.audioRef.currentTime = this.state.currentTime;
			}
			this.setState({
				playing: true,
			});
		}
	};

	updatePlayerSpeed = (rate) => {
		if (this.state.currentSpeed !== rate) {
			document.cookie = `bible_is_playbackrate=${JSON.stringify(rate)};path=/`;
			this.audioRef.playbackRate = rate;
			this.setState({
				currentSpeed: rate,
			});
		}
	};

	skipForward = () => {
		this.setCurrentTime(0);
		this.pauseAudio();
		this.setState(
			{
				playing: false,
				loadingNextChapter: true,
			},
			() => {
				Router.push(
					getNextChapterUrl({
						books: this.props.books,
						chapter: this.props.activeChapter,
						bookId: this.props.activeBookId.toLowerCase(),
						textId: this.props.activeTextId.toLowerCase(),
						verseNumber: this.props.verseNumber,
						text: this.props.text,
						isHref: true,
					}),
					getNextChapterUrl({
						books: this.props.books,
						chapter: this.props.activeChapter,
						bookId: this.props.activeBookId.toLowerCase(),
						textId: this.props.activeTextId.toLowerCase(),
						verseNumber: this.props.verseNumber,
						text: this.props.text,
						isHref: false,
					}),
				);
			},
		);
	};

	toggleAudioPlayer = () => {
		if (this.props.audioSource && this.props.hasAudio) {
			this.props.setAudioPlayerState(!this.props.audioPlayerState);
		}
	};

	handleAutoPlayChange = (e) => {
		this.setState({ autoPlayChecked: e.target.checked });
		this.props.toggleAutoPlay({ state: e.target.checked });
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

		// If speed came from cookie it is stored as a string since there is not a parse float
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

	get classNamesForHandle() {
		const {
			audioSource: source,
			hasAudio,
			audioPlayerState,
			videoPlayerOpen,
			hasVideo,
			isScrollingDown,
		} = this.props;

		let classNames = '';

		if (
			audioPlayerState &&
			hasAudio &&
			(!videoPlayerOpen || !hasVideo) &&
			source !== ''
		) {
			classNames += 'audioplayer-handle';
		} else {
			classNames += 'audioplayer-handle closed';
		}

		if (isScrollingDown) {
			classNames += ' scrolled-down';
		}

		return classNames;
	}

	get classNamesForBackground() {
		const {
			audioSource: source,
			hasAudio,
			audioPlayerState,
			videoPlayerOpen,
			isScrollingDown,
			hasVideo,
		} = this.props;

		let classNames = '';

		if (
			audioPlayerState &&
			hasAudio &&
			(!videoPlayerOpen || !hasVideo) &&
			source !== ''
		) {
			classNames += 'audio-player-background';
		} else {
			classNames += 'audio-player-background closed';
		}

		if (isScrollingDown) {
			classNames += ' scrolled-down';
		}

		return classNames;
	}

	nextIcon = (
		<div
			id={'next-chapter-audio'}
			onClick={this.pauseAudio}
			className={'icon-wrap'}
			title={messages.nextTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="next" />
			<FormattedMessage {...messages.next} />
		</div>
	);

	prevIcon = (
		<div
			id={'previous-chapter-audio'}
			onClick={this.pauseAudio}
			className={'icon-wrap'}
			title={messages.prevTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="previous" />
			<FormattedMessage {...messages.prev} />
		</div>
	);

	pauseIcon = (
		<div
			id={'pause-audio'}
			onClick={this.pauseAudio}
			className={'icon-wrap'}
			title={messages.pauseTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" fill="#fff" svgid="pause" />
			<FormattedMessage {...messages.pause} />
		</div>
	);

	playIcon = () => (
		<div
			id={'play-audio'}
			onClick={this.playAudio}
			className={'icon-wrap'}
			style={{ color: `${this.state.loadingNextChapter ? '#aaa' : '#fff'}` }}
			title={messages.playTitle.defaultMessage}
		>
			<SvgWrapper className="svgitem icon" svgid="play" />
			<FormattedMessage {...messages.play} />
		</div>
	);

	render() {
		const {
			audioSource: source,
			hasAudio,
			audioPlayerState,
			videoPlayerOpen,
			hasVideo,
		} = this.props;
		const { autoPlayChecked, currentSpeed } = this.state;

		return (
			<>
				<div
					className={this.classNamesForHandle}
					onClick={(e) => {
						e.stopPropagation();
						this.toggleAudioPlayer();
					}}
				>
					<SvgWrapper
						width="26px"
						height="26px"
						className={
							(!videoPlayerOpen || !hasVideo) && audioPlayerState
								? 'audio-gripper'
								: 'audio-gripper closed'
						}
						style={{ cursor: source ? 'pointer' : 'inherit' }}
						svgid="arrow_down"
					/>
				</div>
				<div
					className={this.classNamesForBackground}
					ref={this.setAudioPlayerRef}
					onClick={this.handleBackgroundClick}
				>
					<div
						className={
							audioPlayerState &&
							(!videoPlayerOpen || !hasVideo) &&
							hasAudio &&
							source !== ''
								? 'audio-player-container'
								: 'audio-player-container closed'
						}
					>
						<Link
							as={getPreviousChapterUrl({
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.text,
								isHref: false,
							})}
							href={getPreviousChapterUrl({
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.text,
								isHref: true,
							})}
						>
							{this.prevIcon}
						</Link>
						{this.state.playing ? this.pauseIcon : this.playIcon()}
						<Link
							as={getNextChapterUrl({
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.text,
								isHref: false,
							})}
							href={getNextChapterUrl({
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.text,
								isHref: true,
							})}
						>
							{this.nextIcon}
						</Link>
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
								className={
									this.state.volumeSliderState ? 'item active' : 'item'
								}
								id={'volume-button'}
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
								id={'speed-button'}
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
								options={[0.75, 1, 1.25, 1.5, 2]}
								onCloseFunction={this.closeModals}
								setSpeed={this.updatePlayerSpeed}
								currentSpeed={currentSpeed}
							/>
						</div>
					</div>
					<audio
						ref={this.handleRef}
						className="audio-player"
						src={source || '_'}
					/>
				</div>
			</>
		);
	}
}

AudioPlayer.propTypes = {
	audioSource: PropTypes.string,
	audioPaths: PropTypes.array,
	setAudioPlayerState: PropTypes.func.isRequired,
	toggleAutoPlay: PropTypes.func,
	hasAudio: PropTypes.bool,
	hasVideo: PropTypes.bool,
	autoPlay: PropTypes.bool,
	videoPlayerOpen: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	audioPlayerState: PropTypes.bool.isRequired,
	books: PropTypes.array,
	text: PropTypes.array,
	activeBookId: PropTypes.string,
	activeTextId: PropTypes.string,
	verseNumber: PropTypes.string,
	activeChapter: PropTypes.number,
	initialPlaybackRate: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
	initialVolume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
