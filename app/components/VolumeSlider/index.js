/**
*
* VolumeSlider
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
// import styled from 'styled-components';
// rc-slider Slider component doesn't accept classes for styles other than classname
// TODO: Figure out why slider isn't sliding - the problem is that the parent component is updating and sending down the new volume value which causes this component to re-render
class VolumeSlider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	// state = {
	// 	stateVolume: 0,
	// }
	componentDidMount() {
		// document.addEventListener('click', this.handleClickOutside);
		// console.log('volume slider is re-mounting');
	}

	// componentWillUnmount() {
	// 	document.removeEventListener('click', this.handleClickOutside);
	// }
	//
	// setInnerRef = (el) => {
	// 	this.wrappedComponent = el;
	// }
	//
	// handleClickOutside = (event) => {
	// 	console.log('clicked outside');
	// 	const bounds = this.wrappedComponent ? this.wrappedComponent.getBoundingClientRect() : { x: 0, y: 0, width: 0, height: 0 };
	// 	const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
	// 	const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;
	//
	// 	if (this.wrappedComponent && !(insideWidth && insideHeight)) {
	// 		this.props.onCloseFunction();
	// 		// document.removeEventListener('click', this.handleClickOutside);
	// 	}
	// }

	handleChange = (value) => {
		// console.log('handling change and new volume value', value / 100 || 0);
		// this.setState({ stateVolume: value / 100 || 0 });
		this.props.updateVolume(value / 100 || 0);
	}

	render() {
		const {
			volume,
			active,
		} = this.props;
		// const {
		// 	stateVolume,
		// } = this.state;
		// console.log('rendering volume slider');
		return (
			<div className={active ? 'volume-slider-container active' : 'volume-slider-container'}>
				<div ref={this.setInnerRef} className="volume-slider">
					<Slider
						className="slider"
						onChange={this.handleChange}
						handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)', top: '4px' }}
						railStyle={{ backgroundColor: '#111', height: '2px' }}
						trackStyle={{ backgroundColor: 'rgb(98,177,130)', height: '2px' }}
						defaultValue={volume * 100}
						min={0}
						max={100}
					/>
				</div>
			</div>
		);
	}
}

VolumeSlider.propTypes = {
	updateVolume: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
	// onCloseFunction: PropTypes.func,
	active: PropTypes.bool,
};

export default VolumeSlider;
