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
import isEqual from 'lodash/isEqual';
import injectReducer from 'utils/injectReducer';
import closeEventHoc from 'components/CloseEventHoc';
import SvgWrapper from 'components/SvgWrapper';
import SpeedControl from 'components/SpeedControl';
import AudioProgressBar from 'components/AudioProgressBar';
import VolumeSlider from 'components/VolumeSlider';
import AudioPlayerMenu from 'components/AudioPlayerMenu';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import makeSelectAudioPlayer, { selectHasAudio } from './selectors';
import reducer from './reducer';
/* eslint-disable jsx-a11y/media-has-caption */
/* disabled the above eslint config options because you can't add tracks to audio elements */
export class AudioPlayer extends React.Component { // eslint-disable-line react/prefer-stateless-function
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
			playerState: this.props.hasAudio,
			currentSpeed: 1,
		};
	}

	componentDidMount() {
		// canplaythrough might be a safer event to listen for
		this.audioRef.addEventListener('durationchange', (e) => {
			this.setState({
				duration: e.target.duration,
			});
		});
		this.audioRef.addEventListener('timeupdate', (e) => {
			this.setState({
				currentTime: e.target.currentTime,
			});
		});
		this.audioRef.addEventListener('seeking', (e) => {
			this.setState({
				currentTime: e.target.currentTime,
			});
		});
		this.audioRef.addEventListener('seeked', (e) => {
			this.setState({
				currentTime: e.target.currentTime,
			});
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.audioSource !== this.props.audioSource) {
			if (nextProps.audioSource) {
				this.setState({ playerState: true, playing: false });
			} else if (this.state.playerState) {
				this.setState({ playerState: false, playing: false });
			}
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState.volume !== this.state.volume) {
			return false;
		}
		if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
			return true;
		}
		return false;
	}

	setCurrentTime = (time) => {
		this.audioRef.currentTime = time;
		this.setState({
			currentTime: time,
		});
	}

	setAudioPlayerRef = (el) => {
		this.audioPlayerContainer = el;
	}

	setSpeedControlState = (state) => this.setState({
		speedControlState: state,
	})

	setVolumeSliderState = (state) => this.setState({
		volumeSliderState: state,
	})

	setElipsisState = (state) => this.setState({
		elipsisState: state,
	})

	handleRef = (el) => {
		this.audioRef = el;
	}

	handleBackgroundClick = () => {
		if (!this.state.playerState) {
			this.toggleAudioPlayer();
		}
	}

	updateVolume = (volume) => {
		this.audioRef.volume = volume;
		this.setState({
			volume,
		});
	}

	pauseVideo = () => {
		this.audioRef.pause();
		this.setState({
			playing: false,
		});
	}

	playVideo = () => this.audioRef.play().then(() => this.setState({
		playing: true,
	}))

	updatePlayerSpeed = (rate) => {
		if (this.state.currentSpeed !== rate) {
			this.audioRef.playbackRate = rate;
			this.setState({
				currentSpeed: rate,
			});
		}
	}

	skipBackward = () => {
		this.setCurrentTime(0);
		this.props.skipBackward();
		this.setState({
			playing: false,
		});
	}

	skipForward = () => {
		this.setCurrentTime(0);
		this.props.skipForward();
		this.setState({
			playing: false,
		});
	}

	toggleAudioPlayer = () => {
		if (this.props.audioSource) {
			this.setState({
				playerState: !this.state.playerState,
			});
		}
	}
	// Simpler to close all modals than to try and figure out which one to close
	closeModals = () => {
		this.setState({
			volumeSliderState: false,
			speedControlState: false,
			elipsisState: false,
		});
	}

	get volumeControl() {
		return closeEventHoc(VolumeSlider, this.closeModals);
	}

	get speedControl() {
		return closeEventHoc(SpeedControl, this.closeModals);
	}

	get playerMenu() {
		return closeEventHoc(AudioPlayerMenu, this.closeModals);
	}

	render() {
		const {
			audioSource: source,
			hasAudio,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="AudioPlayer">
				<div role="button" tabIndex={0} className="audio-player-background" ref={this.setAudioPlayerRef} onClick={this.handleBackgroundClick}>
					{
						(this.state.playerState && hasAudio) ? (
							<div className="audio-player-container">
								<span title={'Skip Back'}><SvgWrapper onClick={this.skipBackward} className="svgitem icon" fill="#fff" svgid="backward" /></span>
								{
									!this.state.playing ? (
										<span title={'Play'}><SvgWrapper onClick={this.playVideo} className="svgitem icon" fill="#fff" svgid="play_audio" /></span>
									) : null
								}
								{
									this.state.playing ? (
										<span title={'Pause'}><SvgWrapper onClick={this.pauseVideo} className="svgitem icon" fill="#fff" svgid="pause" /></span>
									) : null
								}
								<span title={'Skip Forward'}><SvgWrapper onClick={this.skipForward} className="svgitem icon" fill="#fff" svgid="forward" /></span>
								<AudioProgressBar setCurrentTime={this.setCurrentTime} duration={this.state.duration} currentTime={this.state.currentTime} />
								<div id="volume-wrap">
									<div title={'Volume Control'} role="button" tabIndex="0" className={this.state.volumeSliderState ? 'item active' : 'item'} onClick={() => { this.state.volumeSliderState ? this.setVolumeSliderState(false) : this.setVolumeSliderState(true); this.setSpeedControlState(false); this.setElipsisState(false); }}><SvgWrapper className={'icon'} fill="#fff" svgid="volume" /></div>
									{
										this.state.volumeSliderState && <this.volumeControl active={this.state.volumeSliderState} updateVolume={this.updateVolume} volume={this.state.volume} />
									}
								</div>
								<div id="volume-wrap">
									<div title={'Speed Control'} role="button" tabIndex="0" className={this.state.speedControlState ? 'item active' : 'item'} onClick={() => { this.state.speedControlState ? this.setSpeedControlState(false) : this.setSpeedControlState(true); this.setElipsisState(false); this.setVolumeSliderState(false); }}><SvgWrapper className={'icon'} fill="#fff" svgid="play_speed" /></div>
									{
										this.state.speedControlState ? (
											<this.speedControl currentSpeed={this.state.currentSpeed} options={[0.5, 1, 1.25, 1.5, 2]} setSpeed={this.updatePlayerSpeed} />
										) : null
									}
								</div>
								<div id="volume-wrap">
									<div title={'Audio Settings'} role="button" tabIndex="0" className={this.state.elipsisState ? 'item active' : 'item'} onClick={() => { this.state.elipsisState ? this.setElipsisState(false) : this.setElipsisState(true); this.setVolumeSliderState(false); this.setSpeedControlState(false); }}><SvgWrapper className={'icon'} fill="#fff" svgid="more_menu" /></div>
									{
										this.state.elipsisState ? (
											<this.playerMenu />
										) : null
									}
								</div>
							</div>
						) : null
					}
					<audio ref={this.handleRef} className="audio-player" src={source}></audio>
					<SvgWrapper onClick={(e) => { e.stopPropagation(); this.toggleAudioPlayer(); }} width="50px" height="5px" className={this.state.playerState ? 'audio-gripper' : 'audio-gripper closed'} style={{ cursor: source ? 'pointer' : 'inherit' }} svgid="gripper" />
				</div>
			</GenericErrorBoundary>
		);
	}
}

AudioPlayer.propTypes = {
	audioSource: PropTypes.string,
	skipBackward: PropTypes.func.isRequired,
	skipForward: PropTypes.func.isRequired,
	hasAudio: PropTypes.bool,
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

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'audioPlayer', reducer });

export default compose(
	withReducer,
	withConnect,
)(AudioPlayer);
