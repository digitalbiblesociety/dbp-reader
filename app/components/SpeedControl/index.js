/**
*
* SpeedControl
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SpeedControl({ options, setSpeed, closeControl }) {
	return (
		<div className="speed-control-container">
			{
				options.map((option) => (
					<span className="item" role="button" tabIndex={0} onClick={() => { setSpeed(option); closeControl(); }}>{option}</span>
				))
			}
		</div>
	);
}

SpeedControl.propTypes = {
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	closeControl: PropTypes.func,
};

export default SpeedControl;
