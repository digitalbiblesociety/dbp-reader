/**
*
* SpeedControl
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

class SpeedControl extends React.PureComponent {
	render() {
		const { active, options, setSpeed, currentSpeed } = this.props;

		return (
			<div className={active ? 'speed-control-container' : 'speed-control-container closed'}>
				<div className="speed-control">
					{
						options.map((option) => (
							<span
								key={option}
								className={currentSpeed === option ? 'speed-item active' : 'speed-item'}
								role="button"
								tabIndex={0}
								onClick={() => setSpeed(option)}
							>
								{option}
							</span>
						))
					}
				</div>
			</div>
		);
	}
}

SpeedControl.propTypes = {
	options: PropTypes.array,
	setSpeed: PropTypes.func,
	active: PropTypes.bool,
	currentSpeed: PropTypes.number,
	// onCloseFunction: PropTypes.func,
};

export default SpeedControl;
