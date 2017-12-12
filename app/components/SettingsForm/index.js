/**
*
* SettingsForm
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SettingsForm() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

SettingsForm.propTypes = {

};

export default SettingsForm;
