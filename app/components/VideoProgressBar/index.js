import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import getFormattedTimeString from '../../utils/getFormattedTimeString';
import Colors from '../../utils/javascriptColors';

class VideoProgessBar extends React.PureComponent {
	handleChange = (time) => {
		// Default to 0 to keep an error from being thrown
		this.props.setCurrentTime(this.props.duration * (time / 100) || 0);
	};

	get timeLeft() {
		return getFormattedTimeString(this.props.duration);
	}

	get timePassed() {
		return getFormattedTimeString(this.props.currentTime);
	}

	render() {
		const { paused, currentTime, duration } = this.props;
		const timePercent = (currentTime / duration) * 100;

		return (
			<div
				className={
					paused ? 'progress-slider hide-progress-slider' : 'progress-slider'
				}
				data-value-dur={this.timeLeft}
				data-value-cur={this.timePassed}
			>
				<Slider
					onChange={this.handleChange}
					handleStyle={{
						border: `2px solid ${Colors.sliderGreen}`,
						backgroundColor: Colors.sliderGreen,
						width: '10px',
						height: '10px',
						top: '6px',
					}}
					railStyle={{
						backgroundColor: Colors.videoProgressGray,
						height: '2px',
						cursor: 'pointer',
					}}
					trackStyle={{
						backgroundColor: Colors.sliderGreen,
						height: '2px',
						cursor: 'pointer',
					}}
					value={timePercent}
					min={0}
					max={100}
				/>
			</div>
		);
	}
}

VideoProgessBar.propTypes = {
	currentTime: PropTypes.number,
	// buffer: PropTypes.number,
	duration: PropTypes.number,
	setCurrentTime: PropTypes.func,
	paused: PropTypes.bool,
};

export default VideoProgessBar;
