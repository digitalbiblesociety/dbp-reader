/**
*
* AudioProgressBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
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
		// console.log('duration', this.props.duration);
		// console.log('current time', this.props.currentTime);
		this.props.setCurrentTime((this.props.duration * (v / 100)) || 0);
	}

	get timeLeft() {
		const dur = this.props.duration;
		const durSecs = Math.floor(dur % 60);
		const durMins = Math.floor(dur / 60);
		const durSecsString = durSecs.toFixed(0).length === 1 ? `0${durSecs.toFixed(0)}` : durSecs.toFixed(0);
		const durMinsString = durMins.toFixed(0);

		if (durMinsString.length === 1) {
			return `0${durMins}:${durSecsString}`;
		} else if (durMinsString.length > 1) {
			return `${durMins}:${durSecsString}`;
		}
		return `00:${durSecsString}`;
	}

	get timePassed() {
		const cur = this.props.currentTime;
		const curSecs = Math.floor(cur % 60);
		const curMins = Math.floor(cur / 60);
		const curSecsString = curSecs.toFixed(0).length === 1 ? `0${curSecs.toFixed(0)}` : curSecs.toFixed(0);
		const curMinsString = curMins.toFixed(0);

		if (curMinsString.length === 1) {
			return `0${curMins}:${curSecsString}`;
		} else if (curMinsString.length > 1) {
			return `${curMins}:${curSecsString}`;
		}
		return `00:${curSecsString}`;
	}

	render() {
		const percent = (100 * (this.props.currentTime / this.props.duration)) || 0;
		// console.log('rendering progress bar', percent);
		return (
			<div className={'progress-slider'} data-value-dur={this.timeLeft} data-value-cur={this.timePassed}>
				<Slider
					onChange={this.handleChange}
					handleStyle={{ border: '2px solid rgb(98,177,130)', backgroundColor: 'rgb(0,0,0)', top: '5px' }}
					railStyle={{ backgroundColor: '#111', height: '4px' }}
					trackStyle={{ backgroundColor: 'rgb(98,177,130)', height: '4px' }}
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
