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
function SettingsToggle({ action, name }) {
	return (
		<div className="checkbox-settings">
			<label>
				<FormattedMessage {...messages[name]} />
				<div className="switch">
					<input type="checkbox" onChange={action} />
					<span className="slider"></span>
				</div>
			</label>
		</div>
	);
}

SettingsToggle.propTypes = {
	action: PropTypes.func,
	name: PropTypes.string,
};

export default SettingsToggle;
