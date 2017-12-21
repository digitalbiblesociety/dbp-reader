/**
*
* SignUp
*
*/

import React from 'react';
import SvgWrapper from 'components/SvgWrapper';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function SignUp() {
	return (
		<React.Fragment>
			<section className="message">
				<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
			</section>
			<input className="email" placeholder="Enter your email" />
			<input className="first-password" placeholder="Enter a password" />
			<input className="second-password" placeholder="Re-enter your password" />
			<div className="sign-up-button"><span className="text">SIGN UP</span></div>
			<div className="google">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
				Sign up with Google
			</div>
			<div className="facebook">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
				Sign up with Facebook
			</div>
			<section className="disclaimer">
				By creating an account, you agree to the Bible.is
				<Link className="link" to="/privacy-policy"> Privacy Policy </Link> &
				<Link className="link" to="/terms-of-use"> Terms of Use</Link>.
			</section>
		</React.Fragment>
	);
}

SignUp.propTypes = {

};

export default SignUp;
