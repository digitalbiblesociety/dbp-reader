/**
 *
 * Checkbox
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

function Checkbox({ label, updater, toggleState, id, className }) {
	return (
		<div className={className || 'default-checkbox__div'}>
			<input
				value={toggleState}
				onChange={updater}
				id={id || 'default-checkbox'}
				type={'checkbox'}
			/>
			<label htmlFor={id || 'default-checkbox'}>{label}</label>
		</div>
	);
}

Checkbox.propTypes = {
	label: PropTypes.string,
	updater: PropTypes.func,
	toggleState: PropTypes.bool,
	className: PropTypes.string,
	id: PropTypes.string,
};

export default Checkbox;
