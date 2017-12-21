/**
*
* PasswordReset
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function PasswordReset() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

PasswordReset.propTypes = {

};

export default PasswordReset;
