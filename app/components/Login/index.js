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

function Login({ toggleSignInForm, signInActive, selectAccountOption }) {
	return (
		<React.Fragment>
			{
				signInActive ? (
					<React.Fragment>
						<input className="email" placeholder="Enter your email" />
						<input className="first-password" placeholder="Enter a password" />
						<div className="sign-in-button">
							<input className="login-checkbox" type="checkbox" />
							<span className="text">KEEP ME LOGGED IN</span>
							<span role="button" tabIndex={0} className="login-button" onClick={() => toggleSignInForm(false)}>LOGIN</span>
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
	signInActive: PropTypes.bool,
};

export default Login;
