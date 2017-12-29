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

	closeSpeedControl = () => this.setState({
		speedControlState: false,
	})

	decreaseVolume = () => {
		const volume = this.audioRef.volume;
		if (volume - 0.1 >= 0) {
			this.audioRef.volume = volume - 0.1;
		}
	}

	handleRef = (el) => {
		this.audioRef = el;
	}

	increaseVolume = () => {
		const volume = this.audioRef.volume;
		if (volume + 0.1 <= 1) {
			this.audioRef.volume = volume + 0.1;
		}
	}

	openSpeedControl = () => this.setState({
		speedControlState: true,
	});

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

	render() {
		return (
			<div className={this.state.playerState ? 'audio-player-container open' : 'audio-player-container closed'}>
				<SvgWrapper onClick={this.skipBackward} className="item" width="25px" height="25px" fill="#fff" svgid="backward" />
				<SvgWrapper onClick={this.state.playing ? this.pauseVideo : this.playVideo} className="item" width="25px" height="25px" fill="#fff" svgid={this.state.playing ? 'pause' : 'play_audio'} />
				<SvgWrapper onClick={this.skipForward} className="item" width="25px" height="25px" fill="#fff" svgid="forward" />
				<AudioProgressBar setCurrentTime={this.setCurrentTime} duration={this.state.duration} currentTime={this.state.currentTime} />
				<SvgWrapper onClick={this.decreaseVolume} className="item" width="25px" height="25px" fill="#fff" svgid="volume_down" />
				<SvgWrapper onClick={this.increaseVolume} className="item" width="25px" height="25px" fill="#fff" svgid="volume_up" />
				<SvgWrapper onClick={this.state.speedControlState ? this.closeSpeedControl : this.openSpeedControl} className="item" width="25px" height="25px" fill="#fff" svgid="play_speed" />
				<SvgWrapper className="item" width="25px" height="25px" fill="#fff" svgid="more_menu" />
				{
					this.state.speedControlState ? (<SpeedControl options={[0.5, 1, 1.25, 1.5, 2]} setSpeed={this.updatePlayerSpeed} closeControl={this.closeSpeedControl} />) : null
				}
				<audio ref={this.handleRef} className="audio-player" src={this.state.src}></audio>
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
