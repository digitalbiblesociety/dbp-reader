/**
*
* Login
*
*/

import React from 'react';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

function Login() {
	return (
		<div>
			<FormattedMessage {...messages.header} />
		</div>
	);
}

Login.propTypes = {

};

export default Login;
