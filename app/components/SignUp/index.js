/**
*
* SignUp
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function SignUp() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

SignUp.propTypes = {

};

export default SignUp;
