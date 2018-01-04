/**
*
* SpeedControl
*
*/

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

function SpeedControl({ options, setSpeed, parentNode, closeControl }) {
	const component = (
		<div className="speed-control-container-container">
			<div className="speed-control-container">
				{
					options.map((option) => (
						<span className="item" role="button" tabIndex={0} onClick={() => { setSpeed(option); closeControl(); }}>{option}</span>
					))
				}
			</div>
		</div>
	);
	return ReactDOM.createPortal(component, parentNode);
}

SpeedControl.propTypes = {
	parentNode: PropTypes.node,
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	closeControl: PropTypes.func,
};

export default SpeedControl;
