/**
 *
 * AudioProgressBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
import getFormattedTimeString from '../../utils/getFormattedTimeString';
import Colors from '../../../theme_config/javascriptColors';
import AudioDramaToggle from '../AudioDramaToggle';

class AudioProgressBar extends React.PureComponent {
	get timeLeft() {
		return getFormattedTimeString(this.props.duration);
	}

	get timePassed() {
		return getFormattedTimeString(this.props.currentTime);
	}

	handleChange = (v) => {
		this.props.setCurrentTime(this.props.duration * (v / 100) || 0);
	};

	render() {
		const percent = 100 * (this.props.currentTime / this.props.duration) || 0;
		return (
			<div
				className={'progress-slider'}
				data-value-dur={this.timeLeft}
				data-value-cur={this.timePassed}
			>
				<Slider
					onChange={this.handleChange}
					handleStyle={{
						border: `2px solid ${Colors.sliderGreen}`,
						backgroundColor: Colors.black,
						top: '5px',
					}}
					railStyle={{
						backgroundColor: Colors.audioProgressBackground,
						height: '4px',
					}}
					trackStyle={{ backgroundColor: Colors.sliderGreen, height: '4px' }}
					value={percent}
					min={0}
					max={100}
				/>
				<AudioDramaToggle />
			</div>
		);
	}
}

AudioProgressBar.propTypes = {
	duration: PropTypes.number,
	currentTime: PropTypes.number,
	setCurrentTime: PropTypes.func,
};

export default AudioProgressBar;
