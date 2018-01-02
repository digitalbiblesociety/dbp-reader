/**
*
* VolumeSlider
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class VolumeSlider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		return (
			<div className="volume-slider">
				<div className="fill"><div className="tracker"></div></div>
			</div>
		);
	}
}

VolumeSlider.propTypes = {
	decreaseVolume: PropTypes.func.isRequired,
	increaseVolume: PropTypes.func.isRequired,
	volume: PropTypes.number.isRequired,
};

export default VolumeSlider;
