/**
*
* SpeedControl
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SpeedControl({ options, setSpeed, currentSpeed, innerRef }) {
	return (
		<div className="speed-control-container-container">
			<div ref={innerRef} className="speed-control-container">
				{
					options.map((option) => (
						<span key={option} className={currentSpeed === option ? 'speed-item active' : 'speed-item'} role="button" tabIndex={0} onClick={() => setSpeed(option)}>{option}</span>
					))
				}
			</div>
		</div>
	);
}

SpeedControl.propTypes = {
	innerRef: PropTypes.func,
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	currentSpeed: PropTypes.number,
};

export default SpeedControl;
