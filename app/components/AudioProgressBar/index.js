/**
*
* AudioProgressBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Timeline = styled.div`
	background-color: rgb(98,177,130);
	height: 3px;
	position:relative;
`;

const Tracker = styled.div`
	width: 15px;
  height: 15px;
  border-radius: 50%;
  background: rgb(98,177,130);
  position:absolute;
  top:-5px;
  right:0;
  cursor: pointer;
`;

class AudioProgressBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			marginLeft: 0,
			ontracker: false,
		};
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.mouseUp, false);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentTime === 0) {
			this.setState({ marginLeft: 0 });
		} else if (nextProps.currentTime !== this.props.currentTime) {
			this.moveTracker({}, true);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.mouseUp);
		window.removeEventListener('mousemove', this.moveTracker);
	}

	mouseUp = (e) => {
		if (this.state.ontracker) {
			this.moveTracker(e);
			window.removeEventListener('mousemove', this.moveTracker, true);
			this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
		}
		this.setState({
			ontracker: false,
		});
	}

	clickPercent = (e) => (e.clientX - this.state.position) / (this.state.timelineOffset - this.state.trackerOffset || 0);

	moveTracker = (e, fromProps) => {
		let newMargLeft;
		if (fromProps) {
			newMargLeft = this.timeline.offsetWidth;
		} else {
			newMargLeft = (e.clientX || this.tracker.getBoundingClientRect().left) - this.state.position;
		}

		if (newMargLeft >= 0 && newMargLeft <= (this.state.timelineOffset - this.state.trackerOffset || 0)) {
			this.setState({
				marginLeft: newMargLeft,
			});
		} else if (newMargLeft < 0) {
			this.setState({
				marginLeft: 0,
			});
		} else if (newMargLeft > (this.state.timelineOffset - this.state.trackerOffset || 0)) {
			this.setState({
				marginLeft: (this.state.timelineOffset - this.state.trackerOffset || 0),
			});
		}
	};

	handleTimeClick = (e) => {
		this.moveTracker({ e });
		this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
	};

	mouseDown = () => {
		this.state.ontracker = true;
		window.addEventListener('mousemove', this.moveTracker, true);
	}

	handleTimelineRef = (el) => {
		this.timeline = el;
	}

	handleOuterDivRef = (el) => {
		this.outerDiv = el;
		if (el) {
			this.setState({
				position: el.getBoundingClientRect().left,
				timelineOffset: el.offsetWidth,
			});
		}
	}

	handleTrackerRef = (el) => {
		this.tracker = el;
		if (el) {
			this.setState({
				trackerOffset: el.offsetWidth,
			});
		}
	}

	render() {
		const percent = (100 * (this.props.currentTime / this.props.duration)) || 0;
		return (
			<div role="button" tabIndex={0} className="progress-bar" ref={this.handleOuterDivRef} onClick={this.handleTimeClick}>
				<Timeline style={{ width: `${percent > 0 ? `${percent}%` : '0px'}` }} innerRef={this.handleTimelineRef}><Tracker innerRef={this.handleTrackerRef} onMouseDown={this.mouseDown} /></Timeline>
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
