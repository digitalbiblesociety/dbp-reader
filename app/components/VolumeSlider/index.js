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
// TODO: Figure out why slider isn't sliding
class VolumeSlider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		stateVolume: 0,
	}

	handleChange = (value) => {
		this.setState({ stateVolume: value / 100 || 0 });
		this.props.updateVolume(value / 100 || 0);
	}

	render() {
		const {
			innerRef,
			volume,
		} = this.props;
		const {
			stateVolume,
		} = this.state;

		return (
			<div className="volume-slider-container">
				<div ref={innerRef} className="volume-slider">
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
