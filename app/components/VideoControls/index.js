import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';
import VolumeSlider from '../VolumeSlider';
import Colors from '../../utils/javascriptColors';

class VideoControls extends React.PureComponent {
	state = {
		volumeSliderState: false,
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

	closeVolumeSlider = () => {
		this.setState({ volumeSliderState: false });
	};

	openVolumeSlider = () => {
		this.setState({ volumeSliderState: true });
	};

	get containerClassNames() {
		const { paused, elipsisOpen } = this.props;
		let classNames = 'controls';

		if (paused && !elipsisOpen) {
			classNames += ' hide-controls';
		}

		if (elipsisOpen) {
			classNames += ' open-controls';
		}

		return classNames;
	}

	render() {
		const {
			paused,
			volume,
			updateVolume,
			pauseVideo,
			toggleElipsis,
			toggleFullScreen,
		} = this.props;
		const { volumeSliderState } = this.state;

		return (
			<div className={this.containerClassNames}>
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
							active={volumeSliderState && !paused}
							onCloseFunction={this.closeVolumeSlider}
							updateVolume={updateVolume}
							volume={volume}
							railStyle={{
								width: '2px',
								backgroundColor: '#000',
							}}
							trackStyle={{
								backgroundColor: Colors.sliderGreen,
								width: '2px',
							}}
							handleStyle={{
								width: '12.5px',
								height: '12.5px',
								backgroundColor: Colors.sliderGreen,
								borderColor: Colors.sliderGreen,
								left: '5px',
							}}
							sliderContainerClassName={'video-slider-container'}
							activeClassNames={'video-volume-slider-container active'}
							inactiveClassNames={'video-volume-slider-container'}
							vertical
						/>
						{this.getVolumeSvg(volume)}
					</div>
					<div onClick={pauseVideo}>
						<SvgWrapper fill={'#fff'} svgid={'pause'} />
					</div>
				</div>
				<div className={'right-controls'}>
					<div onClick={toggleElipsis}>
						<SvgWrapper
							fill={'#fff'}
							className={'video-elipsis'}
							svgid={'elipsis'}
						/>
					</div>
					<div onClick={toggleFullScreen}>
						<SvgWrapper
							fill={'#fff'}
							className={'video-fullscreen'}
							svgid={'fullscreen'}
						/>
					</div>
				</div>
			</div>
		);
	}
}

VideoControls.propTypes = {
	paused: PropTypes.bool,
	elipsisOpen: PropTypes.bool,
	volume: PropTypes.number,
	pauseVideo: PropTypes.func,
	updateVolume: PropTypes.func,
	toggleElipsis: PropTypes.func,
	toggleFullScreen: PropTypes.func,
};

export default VideoControls;
