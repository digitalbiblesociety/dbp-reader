/**
*
* Login
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function Login({ toggleSignInForm, signInActive, selectAccountOption, sendLoginForm }) {
	let username = '';
	let password = '';
	let email = '';

	const handlePasswordChange = (e) => {
		password = e.target.value;
	};

	const handleEmailChange = (e) => {
		const value = e.target.value;
		const indexOfAt = value.indexOf('@');
		email = value;
		if (indexOfAt !== -1) {
			username = value.slice(0, indexOfAt);
		}
	};

	return (
		<React.Fragment>
			{
				signInActive ? (
					<React.Fragment>
						<input className="email" placeholder="Enter E-mail" onChange={handleEmailChange} value={email} />
						<input className="first-password" type="password" placeholder="Enter Password" onChange={handlePasswordChange} value={password} />
						<div className="sign-in-button">
							<input className="login-checkbox" type="checkbox" />
							<span className="text">KEEP ME LOGGED IN</span>
							<span role="button" tabIndex={0} className="login-button" onClick={() => { toggleSignInForm(false); sendLoginForm({ email, password, username }); }}>LOGIN</span>
						</div>
					</React.Fragment>
				) : (
					<div role="button" tabIndex={0} onClick={() => toggleSignInForm(true)} className="sign-in">
						<SvgWrapper className="svg" width="30px" height="30px" fill="#fff" svgid="email" />
						<span className="text">Sign in with E-mail</span>
					</div>
				)
			}
			<div className="google">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
				Sign in with Google
			</div>
			<div className="facebook">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
				Sign in with Facebook
			</div>
			<section className="sign-up-free">
				Don&#39;t have an account yet?
				<span role="button" tabIndex={0} className="link" onClick={() => { selectAccountOption('signup'); toggleSignInForm(false); }}> Sign up for free!</span>
			</section>
			<section className="forgot-password">
				<span role="button" tabIndex={0} className="link" onClick={() => { selectAccountOption('password_reset'); toggleSignInForm(false); }}>Forgot your password?</span>
			</section>
		</React.Fragment>
	);
}

Login.propTypes = {
	toggleSignInForm: PropTypes.func,
	selectAccountOption: PropTypes.func,
	sendLoginForm: PropTypes.func,
	signInActive: PropTypes.bool,
};

export default Login;
