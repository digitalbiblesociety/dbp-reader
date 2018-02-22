/**
*
* SpeedControl
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SpeedControl({ options, setSpeed, parentNode, currentSpeed, innerRef }) {
	const component = (
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
	if (parentNode) {
		return ReactDOM.createPortal(component, parentNode);
	}
	return component;
}

SpeedControl.propTypes = {
	innerRef: PropTypes.func,
	parentNode: PropTypes.object,
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	currentSpeed: PropTypes.number,
};

export default SpeedControl;
