/**
*
* SpeedControl
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SpeedControl({ options, setSpeed, parentNode, currentSpeed, setInnerRef }) {
	const component = (
		<div className="speed-control-container-container">
			<div ref={setInnerRef} className="speed-control-container">
				{
					options.map((option) => (
						<span key={option} className={currentSpeed === option ? 'item active' : 'item'} role="button" tabIndex={0} onClick={() => setSpeed(option)}>{option}</span>
					))
				}
			</div>
		</div>
	);
	return ReactDOM.createPortal(component, parentNode);
}

SpeedControl.propTypes = {
	parentNode: PropTypes.object,
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	currentSpeed: PropTypes.number,
};

export default SpeedControl;
