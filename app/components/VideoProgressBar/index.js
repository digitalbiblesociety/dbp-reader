import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import getFormattedTimeString from '../../utils/getFormattedTimeString';
import Colors from '../../utils/javascriptColors';

class VideoProgressBar extends React.PureComponent {
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
		const { paused, currentTime, duration, bufferLength } = this.props;
		const timePercent = (currentTime / duration) * 100;
		// console.log('buffer percentage', (bufferLength / duration) * 100);
		// console.log('time percent', timePercent);
		// console.log('buffer distance', bufferLength);
		return (
			<div
				className={
					paused ? 'progress-slider hide-progress-slider' : 'progress-slider'
				}
				data-value-dur={this.timeLeft}
				data-value-cur={this.timePassed}
			>
				<div
					className={'progress-bar-buffer'}
					style={{ width: `${(bufferLength / duration) * 100}%` }}
				/>
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

VideoProgressBar.propTypes = {
	currentTime: PropTypes.number,
	bufferLength: PropTypes.number,
	duration: PropTypes.number,
	setCurrentTime: PropTypes.func,
	paused: PropTypes.bool,
};

export default VideoProgressBar;
