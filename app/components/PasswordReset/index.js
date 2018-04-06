/**
*
* PasswordReset
*
*/

import React from 'react';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function PasswordReset() {
	return (
		<React.Fragment>
			<section className="forgot-password">
				<p>In order to reset your password, please enter the email address you used to register for Bible.is.</p>
				<div className={'wrapper'}>
					<input placeholder="E-mail" />
					<span className="text">Reset Password</span>
				</div>
				<div className="disclaimer">
					If you are unable to reset your password, please
					<Link className="link" to="/contact-form"> contact us </Link>
					for support.
				</div>
			</section>
		</React.Fragment>
	);
}

PasswordReset.propTypes = {

};

export default PasswordReset;
