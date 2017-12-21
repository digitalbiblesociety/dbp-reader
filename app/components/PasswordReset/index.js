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
				<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
			</section>
			<input className="email" placeholder="Enter your email" />
			<input className="first-password" placeholder="Enter a password" />
			<input className="second-password" placeholder="Re-enter your password" />
			<div className="sign-up-button"><span className="text">SIGN UP</span></div>
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
