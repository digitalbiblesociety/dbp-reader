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
			<section className="message">
				<p>In order to reset your password, please enter the email address you used to register for Bible.is.</p>
			</section>
			<input className="email" placeholder="Enter E-mail" />
			<div className="sign-up-button"><span className="text">RESET PASSWORD</span></div>
			<section className="disclaimer">
				If you are unable to reset your password, please
				<Link className="link" to="/contact-form"> contact us </Link>
				for support.
			</section>
		</React.Fragment>
	);
}

PasswordReset.propTypes = {

};

export default PasswordReset;
