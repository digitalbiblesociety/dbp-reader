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
// TODO: stop using inline styles and move to css class if possible
class VolumeSlider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	handleChange = (value) => {
		this.props.updateVolume(value / 100 || 0);
	}
	render() {
		const {
			volume,
		} = this.props;
		const component = (
			<div className="volume-slider">
				<Slider onChange={this.handleChange} handleStyle={{ border: 'none', backgroundColor: 'rgb(98,177,130)' }} railStyle={{ backgroundColor: 'rgba(78,69,76,.9)' }} trackStyle={{ backgroundColor: 'rgb(98,177,130)' }} defaultValue={volume * 100} step={10} min={0} max={100} />
			</div>
		);
		return ReactDOM.createPortal(component, this.props.parentNode);
	}
}

VolumeSlider.propTypes = {
	parentNode: PropTypes.node,
	updateVolume: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
};

export default VolumeSlider;
