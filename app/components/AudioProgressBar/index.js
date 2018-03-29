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
	// constructor(props) {
	// 	super(props);
	// 	this.state = {
	// 		marginLeft: 0,
	// 		ontracker: false,
	// 	};
	// }

	// componentDidMount() {
	// 	// window.addEventListener('mouseup', this.mouseUp, false);
	// 	// console.log('audio progress bar is remounting');
	// }
	//
	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.currentTime === 0) {
	// 		this.setState({ marginLeft: 0 });
	// 	} else if (nextProps.currentTime !== this.props.currentTime) {
	// 		this.moveTracker({}, true);
	// 	}
	// }
	//
	// componentWillUnmount() {
	// 	window.removeEventListener('mouseup', this.mouseUp);
	// 	window.removeEventListener('mousemove', this.moveTracker);
	// }
	//
	// mouseUp = (e) => {
	// 	if (this.state.ontracker) {
	// 		this.moveTracker(e);
	// 		window.removeEventListener('mousemove', this.moveTracker, true);
	// 		this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
	// 	}
	// 	this.setState({
	// 		ontracker: false,
	// 	});
	// }
	//
	// clickPercent = (e) => (e.clientX - this.state.position) / (this.state.timelineOffset - this.state.trackerOffset || 0);
	//
	// moveTracker = (e, fromProps) => {
	// 	// console.log('move tracker e', e);
	// 	// console.log('move tracker fromProps', fromProps);
	//
	// 	let newMargLeft;
	// 	if (fromProps) {
	// 		newMargLeft = this.timeline.offsetWidth;
	// 	} else {
	// 		newMargLeft = (e.clientX || this.tracker.getBoundingClientRect().left) - this.state.position;
	// 	}
	//
	// 	if (newMargLeft >= 0 && newMargLeft <= (this.state.timelineOffset - this.state.trackerOffset || 0)) {
	// 		this.setState({
	// 			marginLeft: newMargLeft,
	// 		});
	// 	} else if (newMargLeft < 0) {
	// 		this.setState({
	// 			marginLeft: 0,
	// 		});
	// 	} else if (newMargLeft > (this.state.timelineOffset - this.state.trackerOffset || 0)) {
	// 		this.setState({
	// 			marginLeft: (this.state.timelineOffset - this.state.trackerOffset || 0),
	// 		});
	// 	}
	// };
	//
	// handleTimeClick = (e) => {
	// 	this.moveTracker({ e });
	// 	// console.log('setting new time');
	// 	this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
	// };
	//
	// mouseDown = () => {
	// 	this.state.ontracker = true;
	// 	// window.addEventListener('mousemove', this.moveTracker, true);
	// }
	//
	// handleTimelineRef = (el) => {
	// 	this.timeline = el;
	// }
	//
	// handleOuterDivRef = (el) => {
	// 	this.outerDiv = el;
	// 	if (el) {
	// 		this.setState({
	// 			position: el.getBoundingClientRect().left,
	// 			timelineOffset: el.offsetWidth,
	// 		});
	// 	}
	// }
	//
	// handleTrackerRef = (el) => {
	// 	this.tracker = el;
	// 	if (el) {
	// 		this.setState({
	// 			trackerOffset: el.offsetWidth,
	// 		});
	// 	}
	// }

	handleChange = (v) => {
		// console.log('value', v);
		// console.log('duration', this.props.duration);
		// console.log('current time', this.props.currentTime);
		this.props.setCurrentTime((this.props.duration * (v / 100)) || 0);
	}

	render() {
		const percent = (100 * (this.props.currentTime / this.props.duration)) || 0;
		// console.log('rendering progress bar', percent);
		return (
			<Slider
				className="progress-slider"
				onChange={this.handleChange}
				handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)' }}
				railStyle={{ backgroundColor: '#111' }}
				trackStyle={{ backgroundColor: 'rgb(98,177,130)' }}
				value={percent}
				min={0}
				max={100}
			/>
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
