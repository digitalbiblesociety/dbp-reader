/**
*
* SettingsToggle
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SettingsToggle({ action, name }) {
	return (
		<div>
			<FormattedMessage {...messages[name]} />
			<input type="checkbox" onChange={action} />
		</div>
	);
}

SettingsToggle.propTypes = {
	action: PropTypes.func,
	name: PropTypes.string,
};

export default SettingsToggle;
