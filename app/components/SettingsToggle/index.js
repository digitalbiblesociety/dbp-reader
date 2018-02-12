/**
*
* SettingsToggle
*
*/

import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import messages from './messages';
/* eslint-disable jsx-a11y/label-has-for */
function SettingsToggle({ action, name, checked }) {
	return (
		<div className="checkbox-settings">
			<label className={checked ? 'active' : ''}>
				<FormattedMessage {...messages[name]} />
				<div className="switch">
					<input type="checkbox" checked={checked} onChange={() => action({ name })} />
					<span className="slider"></span>
				</div>
			</label>
		</div>
	);
}

SettingsToggle.propTypes = {
	action: PropTypes.func,
	name: PropTypes.string,
	checked: PropTypes.bool,
};

export default SettingsToggle;
