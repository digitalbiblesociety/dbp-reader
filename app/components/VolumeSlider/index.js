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
	state = {
		stateVolume: 0,
	}

	componentDidMount() {
		console.log('re-mounting');
	}

	handleMouseUp = () => {
		console.log('handling mouse up');
		this.props.updateVolume(this.state.stateVolume);
	}

	handleChange = (value) => {
		console.log('handling change and new volume value', value / 100 || 0);
		this.setState({ stateVolume: value / 100 || 0 });
	}

	render() {
		const {
			innerRef,
			volume,
		} = this.props;
		const {
			stateVolume,
		} = this.state;
		console.log('rendering');
		return (
			<div className="volume-slider-container">
				<div onMouseUp={this.handleMouseUp} ref={innerRef} className="volume-slider">
					<Slider
						className="slider"
						onChange={this.handleChange}
						handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)' }}
						railStyle={{ backgroundColor: '#111' }}
						trackStyle={{ backgroundColor: 'rgb(98,177,130)' }}
						defaultValue={stateVolume ? stateVolume * 100 : volume * 100}
						min={0}
						max={100}
					/>
				</div>
			</div>
		);
	}
}

VolumeSlider.propTypes = {
	innerRef: PropTypes.func,
	updateVolume: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
};

export default VolumeSlider;
