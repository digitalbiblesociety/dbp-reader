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
			src: 'http://cloud.faithcomesbyhearing.com/mp3audiobibles2/ENGESVO2DA/A01___02_Genesis_____ENGESVO2DA.mp3',
			speedControlState: false,
			volumeSliderActive: false,
			volume: 1,
			duration: 100,
			currentTime: 0,
			playerState: true,
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

	setCurrentTime = (time) => {
		this.audioRef.currentTime = time;
		this.setState({
			currentTime: time,
		});
	}

	setAudioPlayerRef = (el) => {
		this.audioPlayerContainer = el;
	}

	closeSpeedControl = () => this.setState({
		speedControlState: false,
	})

	closeVolumeSlider = () => this.setState({
		volumeSliderActive: false,
	})

	decreaseVolume = () => {
		const volume = this.audioRef.volume - 0.1;
		if (volume >= 0) {
			this.audioRef.volume = volume;
			this.setState({
				volume,
			});
		}
	}

	handleRef = (el) => {
		this.audioRef = el;
	}

	increaseVolume = () => {
		const volume = this.audioRef.volume + 0.1;
		if (volume <= 1) {
			this.audioRef.volume = volume;
			this.setState({
				volume,
			});
		}
	}

	openSpeedControl = () => this.setState({
		speedControlState: true,
	});

	openVolumeSlider = () => this.setState({
		volumeSliderActive: true,
	})

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
		this.audioRef.playbackRate = rate;
	}

	skipBackward = () => this.setState({
		src: 'http://cloud.faithcomesbyhearing.com/mp3audiobibles2/ENGESVO2DA/A01___01_Genesis_____ENGESVO2DA.mp3',
		playing: false,
	})

	skipForward = () => this.setState({
		src: 'http://cloud.faithcomesbyhearing.com/mp3audiobibles2/ENGESVO2DA/A01___03_Genesis_____ENGESVO2DA.mp3',
		playing: false,
	})

	toggleAudioPlayer = () => this.setState({
		playerState: !this.state.playerState,
	})

	toggleMoreMenu = () => this.setState({
		elipsisActive: !this.state.elipsisActive,
	})

	render() {
		return (
			<div ref={this.setAudioPlayerRef}>
				<div className={this.state.playerState ? 'audio-player-container open' : 'audio-player-container closed'}>
					<SvgWrapper onClick={this.skipBackward} className="item" width="25px" height="25px" fill="#fff" svgid="backward" />
					<SvgWrapper onClick={this.state.playing ? this.pauseVideo : this.playVideo} className="item" width="25px" height="25px" fill="#fff" svgid={this.state.playing ? 'pause' : 'play_audio'} />
					<SvgWrapper onClick={this.skipForward} className="item" width="25px" height="25px" fill="#fff" svgid="forward" />
					<AudioProgressBar setCurrentTime={this.setCurrentTime} duration={this.state.duration} currentTime={this.state.currentTime} />
					<div role="button" tabIndex="0" className={this.state.volumeSliderActive ? 'item active' : 'item'} onClick={this.state.volumeSliderActive ? this.closeVolumeSlider : this.openVolumeSlider}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="volume" /></div>
					<div role="button" tabIndex="0" className={this.state.speedControlState ? 'item active' : 'item'} onClick={this.state.speedControlState ? this.closeSpeedControl : this.openSpeedControl}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="play_speed" /></div>
					<div role="button" tabIndex="0" className={this.state.elipsisActive ? 'item active' : 'item'} onClick={this.toggleMoreMenu}><SvgWrapper width="25px" height="25px" fill="#fff" svgid="more_menu" /></div>
					{
						this.state.volumeSliderActive ? (
							<VolumeSlider parentNode={this.audioPlayerContainer} increaseVolume={this.increaseVolume} decreaseVolume={this.decreaseVolume} volume={this.state.volume} />
						) : null
					}
					{
						this.state.speedControlState ? (
							<SpeedControl parentNode={this.audioPlayerContainer} options={[0.5, 1, 1.25, 1.5, 2]} setSpeed={this.updatePlayerSpeed} closeControl={this.closeSpeedControl} />
						) : null
					}
					{
						this.state.elipsisActive ? (
							<AudioPlayerMenu parentNode={this.audioPlayerContainer} />
						) : null
					}
					<audio ref={this.handleRef} className="audio-player" src={this.state.src}></audio>
				</div>
				<SvgWrapper onClick={this.toggleAudioPlayer} width="50px" height="5px" className="audio-gripper" fill="#aeaeae" svgid="gripper" />
			</div>
		);
	}
}

AudioPlayer.propTypes = {
	dispatch: PropTypes.func.isRequired,
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
