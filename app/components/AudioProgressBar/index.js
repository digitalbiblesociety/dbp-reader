/**
 *
 * AudioProgressBar
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
import getFormattedTimeString from '../../utils/getFormattedTimeString';
import Colors from '../../utils/javascriptColors';
// import styled from 'styled-components';
//
// const Timeline = styled.div`
// 	background-color: rgb(98,177,130);
// 	height: 3px;
// 	position:relative;
// `;
// // width: ${(props) => props.percent > 0 ? `${props.percent}%` : '0px'};
//
// const Tracker = styled.div`
// 	width: 15px;
//   height: 15px;
//   border-radius: 50%;
//   border: 2px solid rgb(98,177,130);
//   background: rgb(0,0,0);
//   position:absolute;
//   top:-5px;
//   right:0;
//   cursor: pointer;
// `;

class AudioProgressBar extends React.PureComponent {
	handleChange = (v) => {
		// console.log('value', v);
		// alert(`value in change event: ${v}`);
		// console.log('duration', this.props.duration);
		// console.log('current time', this.props.currentTime);
		this.props.setCurrentTime(this.props.duration * (v / 100) || 0);
	};

	get timeLeft() {
		return getFormattedTimeString(this.props.duration);
	}

	get timePassed() {
		return getFormattedTimeString(this.props.currentTime);
	}

	render() {
		const percent = 100 * (this.props.currentTime / this.props.duration) || 0;
		// console.log('rendering progress bar', percent);
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
			</div>
		);
		// return (
		// 	<div role="button" tabIndex={0} className="progress-bar" ref={this.handleOuterDivRef} onClick={this.handleTimeClick}>
		// 		<Timeline style={{ width: `${percent > 0 ? `${percent}%` : '0px'}` }} innerRef={this.handleTimelineRef}><Tracker innerRef={this.handleTrackerRef} onMouseDown={this.mouseDown} /></Timeline>
		// 	</div>
		// );
	}
}

AudioProgressBar.propTypes = {
	duration: PropTypes.number,
	currentTime: PropTypes.number,
	setCurrentTime: PropTypes.func,
};

export default AudioProgressBar;
