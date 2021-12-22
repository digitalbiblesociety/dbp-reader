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
// import dynamic from 'next/dynamic';
import injectReducer from '../../utils/injectReducer';
import SvgWrapper from '../../components/SvgWrapper';
import SpeedControl from '../../components/SpeedControl';
import AudioProgressBar from '../../components/AudioProgressBar';
import VolumeSlider from '../../components/VolumeSlider';
import makeSelectAudioPlayer, {
	selectorGenerator,
	selectAutoPlay,
	selectPlaybackRate,
	selectVolume,
} from './selectors';
import { selectUserNotes } from '../HomePage/selectors';
import { setAudioPlayerState, toggleAutoPlay } from '../HomePage/actions';
import reducer from './reducer';
import messages from './messages';
import getNextChapterUrl from '../../utils/getNextChapterUrl';
import getPreviousChapterUrl from '../../utils/getPreviousChapterUrl';
import getAudioAsyncCall from '../../utils/getAudioAsyncCall';
import getClassNamesForAudioHandle from '../../utils/getClassNamesForAudioHandle';
import getClassNamesForAudioBackground from '../../utils/getClassNamesForAudioBackground';
import { setPlaybackRate, setVolume } from './actions';
import PlaybackRateSvg from '../../components/PlaybackRateSvg';
import NewChapterArrow from '../../components/NewChapterArrow';
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
			duration: 0,
			currentTime: 0,
			nextTrack: {
				index: 0,
				path: props.audioPaths[0],
				last: props.audioPaths.length === 0,
			},
			clickedPlay: false,
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
		this.audioRef.playbackRate = this.props.playbackRate;
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

		if (!this.props.hasAudio && this.props.audioPlayerState) {
			this.setAudioPlayerState(false);
		}

		if (typeof window !== 'undefined') {
			this.getAudio(
				this.props.activeFilesets,
				this.props.activeBookId,
				this.props.activeChapter,
				this.props.audioType,
			);
		} else {
			this.getAudio(
				this.props.activeFilesets,
				this.props.activeBookId,
				this.props.activeChapter,
				this.props.audioType,
			);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.hasVideo && nextProps.videoPlayerOpen) {
			this.pauseAudio();
		}
		if (
			nextProps.activeTextId !== this.props.activeTextId ||
			nextProps.activeBookId !== this.props.activeBookId ||
			nextProps.activeChapter !== this.props.activeChapter ||
			nextProps.audioType !== this.props.audioType ||
			nextProps.verseNumber !== this.props.verseNumber
		) {
			this.getAudio(
				nextProps.activeFilesets,
				nextProps.activeBookId,
				nextProps.activeChapter,
				nextProps.audioType,
			);
		}
		if (nextProps.audioSource !== this.props.audioSource) {
			if (nextProps.audioSource && !this.props.audioSource) {
				this.setAudioPlayerState(true);
			}
			if (nextProps.audioSource) {
				this.setState({ playing: false, loadingNextChapter: false });
			} else if (
				this.props.audioPlayerState &&
				(!nextProps.audioSource || !nextProps.hasAudio)
			) {
				this.setState({ playing: false }, () =>
					this.setAudioPlayerState(false),
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
			if (this.audioRef.volume !== this.props.volume) {
				this.audioRef.volume = this.props.volume;
			}
			// Ensure that the player playback rate and state playback rate stay in sync
			if (this.audioRef.playbackRate !== this.props.playbackRate) {
				this.audioRef.playbackRate = this.props.playbackRate;
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
		this.setState({ currentTime: time }, () => {
			this.audioRef.currentTime = time;
		});
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

	setAudioPlayerState = (state) =>
		this.props.dispatch(setAudioPlayerState(state));

	getAudio = async (filesets, bookId, chapter, audioType) => {
		const audio = await getAudioAsyncCall(filesets, bookId, chapter, audioType);
		this.props.dispatch({ type: 'loadaudio', ...audio });
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
		if (volume !== this.props.volume) {
			document.cookie = `bible_is_volume=${volume};path=/`;
			this.audioRef.volume = volume;
			this.props.dispatch(setVolume({ value: volume }));
		}
	};

	autoPlayListener = () => {
		const { loadingNextChapter, clickedPlay } = this.state;
		const { audioPlayerState, changingVersion } = this.props;

		// can accept event as a parameter
		if (this.audioRef && this.audioRef.duration) {
			this.setState({
				duration: this.audioRef.duration,
			});
		}
		// If the chapter is loaded and the player is open
		if (
			!loadingNextChapter &&
			!changingVersion &&
			audioPlayerState &&
			clickedPlay
		) {
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

	playFile(video) {
		const promise = video.play();
		if (promise !== undefined) {
			promise
				.then(() => {
					// Autoplay started
				})
				.catch(() => {
					// Autoplay was prevented.
					video.play();
				});
		}
	}

	playAudioOnChrome(audioSource) {
		if (!audioSource) {
			return;
		}
		const hls = new Hls();
		const video = this.audioRef;
		// bind them together
		hls.attachMedia(video);
		hls.on(Hls.Events.MEDIA_ATTACHED, () => {
			hls.loadSource(`${audioSource}?v=4&key=${process.env.DBP_API_KEY}`);
			hls.on(Hls.Events.MANIFEST_PARSED, () => {
				this.playFile(video);
			});
		});
	}

	playAudioOnSafari = () => {
		const { loadingNextChapter, currentTime } = this.state;

		if (loadingNextChapter) {
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
					if (currentTime !== this.audioRef.currentTime) {
						this.audioRef.currentTime = currentTime;
					}
					this.setState({
						playing: true,
						clickedPlay: true,
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
			if (currentTime !== this.audioRef.currentTime) {
				this.audioRef.currentTime = currentTime;
			}
			this.setState({
				playing: true,
				clickedPlay: true,
			});
		}
	};

	playAudio(audioSource) {
		if (
			navigator &&
			navigator.userAgent &&
			/iPhone|iPod|iPad/i.test(navigator.userAgent)
		) {
			this.playAudioOnSafari();
		} else {
			this.playAudioOnChrome(audioSource);
		}
	}

	updatePlayerSpeed = (rate) => {
		if (this.props.playbackRate !== rate) {
			document.cookie = `bible_is_playbackrate=${JSON.stringify(rate)};path=/`;
			this.audioRef.playbackRate = rate;
			// set playback
			this.props.dispatch(setPlaybackRate({ value: rate }));
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
						text: this.props.textData.text,
						audioType: this.props.audioType,
						isHref: true,
					}),
					getNextChapterUrl({
						books: this.props.books,
						chapter: this.props.activeChapter,
						bookId: this.props.activeBookId.toLowerCase(),
						textId: this.props.activeTextId.toLowerCase(),
						verseNumber: this.props.verseNumber,
						text: this.props.textData.text,
						audioType: this.props.audioType,
						isHref: false,
					}),
				);
			},
		);
	};

	toggleAudioPlayer = () => {
		if (this.props.audioSource && this.props.hasAudio) {
			this.setAudioPlayerState(!this.props.audioPlayerState);
		}
	};

	handleAutoPlayChange = (e) => {
		this.props.dispatch(toggleAutoPlay({ state: e.target.checked }));
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
			onClick={() => this.playAudio(this.props.audioSource)}
			className={`icon-wrap ${(this.state.loadingNextChapter ||
				this.props.changingVersion) &&
				'audio-player-play-disabled'}`}
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
			audioType,
			autoPlay,
			volume,
			playbackRate,
		} = this.props;

		return (
			<>
				<div
					className={getClassNamesForAudioHandle({
						audioSource: source,
						hasAudio,
						hasVideo,
						audioPlayerState,
						videoPlayerOpen,
					})}
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
					className={getClassNamesForAudioBackground({
						audioSource: source,
						hasAudio,
						hasVideo,
						audioPlayerState,
						videoPlayerOpen,
					})}
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
						<NewChapterArrow
							clickHandler={this.pauseAudio}
							getNewUrl={getPreviousChapterUrl}
							urlProps={{
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.textData.text,
								audioType,
							}}
							disabled={false}
							svgid={'previous'}
							svgClasses={'svgitem icon'}
							containerClasses={'icon-wrap'}
							id={'previous-chapter-audio'}
							title={messages.prevTitle.defaultMessage}
							textProps={messages.prev}
						/>
						{this.state.playing ? this.pauseIcon : this.playIcon()}
						<NewChapterArrow
							clickHandler={this.pauseAudio}
							getNewUrl={getNextChapterUrl}
							urlProps={{
								books: this.props.books,
								chapter: this.props.activeChapter,
								bookId: this.props.activeBookId.toLowerCase(),
								textId: this.props.activeTextId.toLowerCase(),
								verseNumber: this.props.verseNumber,
								text: this.props.textData.text,
								audioType,
							}}
							disabled={false}
							svgid={'next'}
							svgClasses={'svgitem icon'}
							containerClasses={'icon-wrap'}
							id={'next-chapter-audio'}
							title={messages.nextTitle.defaultMessage}
							textProps={messages.next}
						/>
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
								defaultChecked={autoPlay}
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
								{this.getVolumeSvg(volume)}
								<FormattedMessage {...messages.volume} />
							</div>
							<VolumeSlider
								active={this.state.volumeSliderState}
								onCloseFunction={this.closeModals}
								updateVolume={this.updateVolume}
								volume={volume}
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
								<PlaybackRateSvg playbackRate={playbackRate} />
								<FormattedMessage {...messages.speed} />
							</div>
							<SpeedControl
								active={this.state.speedControlState}
								options={[0.75, 1, 1.25, 1.5, 2]}
								onCloseFunction={this.closeModals}
								setSpeed={this.updatePlayerSpeed}
								playbackRate={playbackRate}
							/>
						</div>
					</div>
					<video
						ref={this.handleRef}
						className="audio-pladdyer"
						src={`${source}?v=4&key=${process.env.DBP_API_KEY}` || '_'}
					/>
				</div>
			</>
		);
	}
}

AudioPlayer.propTypes = {
	textData: PropTypes.object,
	audioSource: PropTypes.string,
	audioType: PropTypes.string,
	activeBookId: PropTypes.string,
	activeTextId: PropTypes.string,
	verseNumber: PropTypes.string,
	dispatch: PropTypes.func,
	hasAudio: PropTypes.bool,
	hasVideo: PropTypes.bool,
	autoPlay: PropTypes.bool,
	videoPlayerOpen: PropTypes.bool,
	isScrollingDown: PropTypes.bool,
	changingVersion: PropTypes.bool,
	audioPlayerState: PropTypes.bool.isRequired,
	audioPaths: PropTypes.array,
	activeFilesets: PropTypes.array,
	books: PropTypes.array,
	activeChapter: PropTypes.number,
	playbackRate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	volume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

const mapStateToProps = createStructuredSelector({
	// Audio Domain
	audioplayer: makeSelectAudioPlayer(),
	// Settings Domain
	autoPlay: selectAutoPlay(),
	playbackRate: selectPlaybackRate(),
	volume: selectVolume(),
	// Homepage Domain
	books: selectorGenerator('books', 'homepage'),
	hasAudio: selectorGenerator('hasAudio', 'homepage'),
	hasVideo: selectorGenerator('hasVideo', 'homepage'),
	audioSource: selectorGenerator('audioSource', 'homepage'),
	audioPaths: selectorGenerator('audioPaths', 'homepage'),
	activeFilesets: selectorGenerator('activeFilesets', 'homepage'),
	videoPlayerOpen: selectorGenerator('videoPlayerOpen', 'homepage'),
	audioPlayerState: selectorGenerator('audioPlayerState', 'homepage'),
	activeBookId: selectorGenerator('activeBookId', 'homepage'),
	activeTextId: selectorGenerator('activeTextId', 'homepage'),
	activeChapter: selectorGenerator('activeChapter', 'homepage'),
	changingVersion: selectorGenerator('changingVersion', 'homepage'),
	// Other Selectors
	textData: selectUserNotes(),
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
