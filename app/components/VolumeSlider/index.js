/**
*
* VolumeSlider
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Slider from 'rc-slider/lib/Slider';
// import styled from 'styled-components';
// rc-slider Slider component doesn't accept classes for styles other than classname
// TODO: Figure out why slider isn't sliding
const VolumeSlider = ({ volume, setInnerRef, updateVolume, parentNode }) => { // eslint-disable-line react/prefer-stateless-function
	const handleChange = (value) => {
		updateVolume(value / 100 || 0);
	};
	const component = (
		<div className="volume-slider-container">
			<div ref={setInnerRef} className="volume-slider">
				<Slider className="slider" onChange={handleChange} handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)' }} railStyle={{ backgroundColor: '#111' }} trackStyle={{ backgroundColor: 'rgb(98,177,130)' }} defaultValue={volume * 100} step={10} min={0} max={100} />
			</div>
		</div>
	);
	return ReactDOM.createPortal(component, parentNode);
};

VolumeSlider.propTypes = {
	parentNode: PropTypes.node,
	updateVolume: PropTypes.func.isRequired,
	setInnerRef: PropTypes.func,
	volume: PropTypes.number.isRequired,
};

export default VolumeSlider;
