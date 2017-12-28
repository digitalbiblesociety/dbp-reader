/**
*
* AudioProgressBar
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Timeline = styled.div`
	width: ${(props) => props.percent > 0 ? `${props.percent}%` : '0px'};
	background-color: rgb(98,177,130);
	height: 2px;
`;

const Playhead = styled.div`
	width: 15px;
  height: 15px;
  border-radius: 50%;
  background: rgb(98,177,130);
  margin-left: ${(props) => props.marginleft}px;
  margin-top: -8px;
  cursor: pointer;
`;

class AudioProgressBar extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			marginLeft: 0,
			onplayhead: false,
		};
	}

	componentDidMount() {
		window.addEventListener('mouseup', this.mouseUp, false);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentTime !== this.props.currentTime) {
			this.movePlayhead({}, true);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('mouseup', this.mouseUp);
		window.removeEventListener('mousemove', this.movePlayhead);
	}

	mouseUp = (e) => {
		if (this.state.onplayhead) {
			this.movePlayhead(e);
			window.removeEventListener('mousemove', this.movePlayhead, true);
			this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
		}
		this.setState({
			onplayhead: false,
		});
	}

	clickPercent = (e) => (e.clientX - this.state.position) / (this.state.timelineOffset - this.state.playheadOffset || 0);

	movePlayhead = (e, fromProps) => {
		// console.log('clientX', e.clientX);
		// console.log('get timeline rect', this.timeline.offsetWidth);
		// console.log('position', this.state.position);
		// console.log('timeline', this.state.timelineOffset * posPercent);
		// console.log('playhead', this.state.playheadOffset);
		// console.log('current time divided duration', posPercent);
		let newMargLeft;
		if (fromProps) {
			newMargLeft = this.timeline.offsetWidth;
		} else {
			newMargLeft = (e.clientX || this.playhead.getBoundingClientRect().left) - this.state.position;
		}

		if (newMargLeft >= 0 && newMargLeft <= (this.state.timelineOffset - this.state.playheadOffset || 0)) {
			this.setState({
				marginLeft: newMargLeft,
			});
		} else if (newMargLeft < 0) {
			this.setState({
				marginLeft: 0,
			});
		} else if (newMargLeft > (this.state.timelineOffset - this.state.playheadOffset || 0)) {
			this.setState({
				marginLeft: (this.state.timelineOffset - this.state.playheadOffset || 0),
			});
		}
	};

	handleTimeClick = (e) => {
		this.movePlayhead({ e });
		this.props.setCurrentTime(this.props.duration * this.clickPercent(e));
	};

	mouseDown = () => {
		this.state.onplayhead = true;
		window.addEventListener('mousemove', this.movePlayhead, true);
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

	handlePlayheadRef = (el) => {
		this.playhead = el;
		if (el) {
			this.setState({
				playheadOffset: el.offsetWidth,
			});
		}
	}

	render() {
		return (
			<div role="button" tabIndex={0} className="progress-bar" ref={this.handleOuterDivRef} onClick={this.handleTimeClick}>
				<Timeline innerRef={this.handleTimelineRef} percent={(100 * (this.props.currentTime / this.props.duration)) || 0} />
				<Playhead innerRef={this.handlePlayheadRef} onMouseDown={this.mouseDown} marginleft={this.state.marginLeft} />
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
