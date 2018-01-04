/**
*
* VolumeSlider
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class VolumeSlider extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const component = (
			<div className="volume-slider">
				<div className="fill"><div className="tracker"></div></div>
			</div>
		);
		return ReactDOM.createPortal(component, this.props.parentNode);
	}
}

VolumeSlider.propTypes = {
	parentNode: PropTypes.node,
	// decreaseVolume: PropTypes.func.isRequired,
	// increaseVolume: PropTypes.func.isRequired,
	// volume: PropTypes.number.isRequired,
};

export default VolumeSlider;
