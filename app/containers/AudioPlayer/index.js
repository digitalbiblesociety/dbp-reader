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
import injectReducer from 'utils/injectReducer';
import SvgWrapper from 'components/SvgWrapper';
import SpeedControl from 'components/SpeedControl';
import AudioProgressBar from 'components/AudioProgressBar';
import VolumeSlider from 'components/VolumeSlider';
import AudioPlayerMenu from 'components/AudioPlayerMenu';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import makeSelectAudioPlayer from './selectors';
import reducer from './reducer';
/* eslint-disable jsx-a11y/media-has-caption */
/* disabled the above eslint config options because you can't add tracks to audio elements */
export class AudioPlayer extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		// src state will come from parent once api is finished
		// needs next and prev audio tracks
		this.state = {
			playing: false,
			speedControlState: false,
			volumeSliderState: false,
			elipsisState: false,
			volume: 1,
			duration: 100,
			currentTime: 0,
			playerState: !!this.props.audioSource,
			currentSpeed: 1,
		};
	}

	componentDidMount() {
		// canplaythrough might be a safe event to listen for
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
				this.setState({ playerState: true });
			} else if (this.state.playerState) {
				this.setState({ playerState: false });
			}
		}
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

	toggleAudioPlayer = () => this.setState({
		playerState: !this.state.playerState,
	})

	render() {
		const {
			audioSource: source,
		} = this.props;
		return (
			<GenericErrorBoundary affectedArea="AudioPlayer">
				<div ref={this.setAudioPlayerRef}>
					{
						this.state.playerState ? (
							<div className="audio-player-container">
								<SvgWrapper onClick={this.skipBackward} className="svgitem" width="25px" height="25px" fill="#fff" svgid="backward" />
								{
									!this.state.playing ? (
										<SvgWrapper onClick={this.playVideo} className="svgitem" width="25px" height="25px" fill="#fff" svgid="play_audio" />
									) : null
								}
								{
									this.state.playing ? (
										<SvgWrapper onClick={this.pauseVideo} className="svgitem" width="25px" height="25px" fill="#fff" svgid="pause" />
									) : null
								}
								<SvgWrapper onClick={this.skipForward} className="item" width="25px" height="25px" fill="#fff" svgid="forward" />
								<AudioProgressBar setCurrentTime={this.setCurrentTime} duration={this.state.duration} currentTime={this.state.currentTime} />
								<div role="button" tabIndex="0" className={this.state.volumeSliderState ? 'item active' : 'item'} onClick={() => { this.state.volumeSliderState ? this.setVolumeSliderState(false) : this.setVolumeSliderState(true); this.setSpeedControlState(false); this.setElipsisState(false); }}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="volume" /></div>
								<div role="button" tabIndex="0" className={this.state.speedControlState ? 'item active' : 'item'} onClick={() => { this.state.speedControlState ? this.setSpeedControlState(false) : this.setSpeedControlState(true); this.setElipsisState(false); this.setVolumeSliderState(false); }}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="play_speed" /></div>
								<div role="button" tabIndex="0" className={this.state.elipsisState ? 'item active' : 'item'} onClick={() => { this.state.elipsisState ? this.setElipsisState(false) : this.setElipsisState(true); this.setVolumeSliderState(false); this.setSpeedControlState(false); }}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="more_menu" /></div>
								{
									this.state.volumeSliderState ? (
										<VolumeSlider parentNode={this.audioPlayerContainer} updateVolume={this.updateVolume} volume={this.state.volume} />
									) : null
								}
								{
									this.state.speedControlState ? (
										<SpeedControl parentNode={this.audioPlayerContainer} currentSpeed={this.state.currentSpeed} options={[0.5, 1, 1.25, 1.5, 2]} setSpeed={this.updatePlayerSpeed} />
									) : null
								}
								{
									this.state.elipsisState ? (
										<AudioPlayerMenu parentNode={this.audioPlayerContainer} />
									) : null
								}
							</div>
						) : null
					}
					<audio ref={this.handleRef} className="audio-player" src={source}></audio>
					<SvgWrapper onClick={this.toggleAudioPlayer} width="50px" height="5px" className="audio-gripper" fill="#aeaeae" svgid="gripper" />
				</div>
			</GenericErrorBoundary>
		);
	}
}

AudioPlayer.propTypes = {
	audioSource: PropTypes.string,
	skipBackward: PropTypes.func.isRequired,
	skipForward: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
	audioplayer: makeSelectAudioPlayer(),
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
