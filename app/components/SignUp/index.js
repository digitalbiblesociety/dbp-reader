/**
*
* SignUp
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import FacebookAuthentication from 'containers/FacebookAuthentication';
import GoogleAuthentication from 'containers/GoogleAuthentication';
// import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class SignUp extends React.PureComponent {
	state = {
		password: '',
		confirmPassword: '',
		email: '',
		firstName: '',
		lastName: '',
		passwordErrorType: '',
		validPassword: true,
		validEmail: true,
		wasSignupSent: false,
		showSignupError: false,
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.socialLoginLink && nextProps.socialLoginLink !== this.props.socialLoginLink) {
			const socialWindow = window.open(nextProps.socialLoginLink, '_blank');

			socialWindow.focus();
		}
	}

	// componentDidUpdate(prevProps, prevState) {
	// 	if ((prevState.confirmPassword !== prevState.password) && this.checkValidPassword()) {
	// 		console.log('valid')
	// 		this.setValidPassword(true);
	// 	} else if (((prevState.confirmPassword === prevState.password) && prevState.password.length) && !this.checkValidPassword()) {
	// 		this.setValidPassword(false);
	// 	}
	// }

	componentWillUnmount() {
		this.props.viewErrorMessage();
	}

	// setValidPassword = (valid) => {
	// 	this.setState({ validPassword: valid });
	// 	this.viewError();
	// }

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
		this.viewError();
	}

	handleFirstName = (e) => {
		this.setState({ firstName: e.target.value });
		this.viewError();
	}

	handleLastName = (e) => {
		this.setState({ lastName: e.target.value });
		this.viewError();
	}

	handleEmailChange = (e) => {
		const email = e.target.value;

		this.setState({ email });
		this.viewError();
	}

	handleConfirmPassword = (e) => {
		const value = e.target.value;

		this.setState({ confirmPassword: value });
		this.viewError();
	}

	handleSignup = (e) => {
		e.preventDefault();
		const validEmail = this.checkValidEmail();
		const validPassword = this.checkValidPassword();

		if (validPassword && validEmail) {
			// console.log('sending sign up form');
			this.props.sendSignupForm({
				email: this.state.email,
				password: this.state.password,
				username: this.state.username,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
			});
			this.setState({ wasSignupSent: true });
		} else if (!validPassword) {
			// password error message
			this.setState({ showSignupError: true });
			// console.log('password error');
		} else if (!validEmail) {
			// email error message
			this.setState({ showSignupError: true });
			// console.log('email error');
		}
		this.setState({ validPassword });
		this.setState({ validEmail });
		this.viewError();
	}

	checkValidEmail = () => {
		const { email } = this.state;
		const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email); // eslint-disable-line no-useless-escape
		// console.log('is valid email', validEmail);

		return validEmail;
	}

	checkValidPassword = () => {
		const { confirmPassword, password } = this.state;
		const passLength = password.length >= 8;
		const passEqual = password === confirmPassword;
		const passNotPass = password !== 'password';
		const upperNumSym = /(?=.*\d)|(?=.*[A-Z])|(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/.test(password); // eslint-disable-line no-useless-escape
		// console.log('upper num sym', upperNumSym);
		const validPassword = passLength && passEqual && passNotPass && upperNumSym;

		if (!passEqual) {
			this.setState({ passwordErrorType: 'confirm' });
		} else if (!passLength) {
			this.setState({ passwordErrorType: 'length' });
		} else if (!passNotPass) {
			this.setState({ passwordErrorType: 'password' });
		} else if (!upperNumSym) {
			this.setState({ passwordErrorType: 'upperNumSym' });
		}
		// console.log('valid password', validPassword);

		if (validPassword) {
			this.setState({ passwordErrorType: '' });
		}

		return validPassword;
	}

	get signupError() {
		const { validEmail, passwordErrorType } = this.state;

		if (passwordErrorType) {
			if (passwordErrorType === 'confirm') {
				return <span className={'signup-error-message'}>Your passwords do not match.</span>;
			} else if (passwordErrorType === 'length') {
				return <span className={'signup-error-message'}>Your password must be longer than 8 characters.</span>;
			} else if (passwordErrorType === 'password') {
				return <span className={'signup-error-message'}>You cannot use, &quot;password&quot; as your password...</span>;
			} else if (passwordErrorType === 'upperNumSym') {
				return <span className={'signup-error-message'}>You must have at least one of the following: number, uppercase character, symbol.</span>;
			}
		}

		if (!validEmail) {
			return <span className={'signup-error-message'}>You have entered an invalid email.</span>;
		}

		return <span className={'signup-error-message'}>There was an unknown error, please try again.</span>;
	}

	get signupForm() {
		const { validEmail, validPassword } = this.state;
		return (
			<form onSubmit={this.handleSignup}>
				<input autoComplete={'email'} onChange={this.handleEmailChange} className={validEmail ? 'email' : 'email error'} placeholder="E-mail" value={this.state.email} />
				<input autoComplete={'given-name'} onChange={this.handleFirstName} className={'name-inputs'} placeholder="Given Name" value={this.state.firstName} />
				<input autoComplete={'family-name'} onChange={this.handleLastName} className={'name-inputs'} placeholder="Family Name" value={this.state.lastName} />
				<input autoComplete="new-password" type="password" onChange={this.handlePasswordChange} className={validPassword ? 'first-password' : 'first-password error'} placeholder="Password" value={this.state.password} />
				<input autoComplete="new-password" type="password" onChange={this.handleConfirmPassword} className={validPassword ? 'second-password' : 'second-password error'} placeholder="Confirm Password" value={this.state.confirmPassword} />
				<div className="sign-up-button">
					<button type="submit" className="text">SIGN UP</button>
				</div>
			</form>
		);
	}

	viewError = () => {
		if (!this.props.errorMessageViewed) {
			this.props.viewErrorMessage();
		}
		if (this.state.showSignupError) {
			this.setState({ showSignupError: false });
		}
	}

	render() {
		const {
			errorMessageViewed,
			socialLoginLink,
			socialMediaLogin,
			activeDriver,
		} = this.props;
		const { showSignupError } = this.state;

		return (
			<React.Fragment>
				<section className="message">
					<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
				</section>
				{this.signupForm}
				{
					showSignupError ? this.signupError : null
				}
				{
					!errorMessageViewed ? (
						<div className="signup-error-message">This email is already registered with an account. Please try a different email or sign in.</div>
					) : null
				}
				<GoogleAuthentication activeDriver={activeDriver} socialMediaLogin={socialMediaLogin} socialLoginLink={socialLoginLink} />
				<FacebookAuthentication activeDriver={activeDriver} socialMediaLogin={socialMediaLogin} socialLoginLink={socialLoginLink} />
				<section className="disclaimer">
					By creating an account, you agree to the Bible.is
					<a className="link" target={'_blank'} href="http://www.bible.is/privacy"> Privacy Policy </a> &
					<a className="link" target={'_blank'} href="http://www.bible.is/terms"> Terms of Use</a>.
				</section>
			</React.Fragment>
		);
	}
}

SignUp.propTypes = {
	sendSignupForm: PropTypes.func,
	socialMediaLogin: PropTypes.func,
	viewErrorMessage: PropTypes.func,
	// errorMessage: PropTypes.string,
	activeDriver: PropTypes.string,
	socialLoginLink: PropTypes.string,
	errorMessageViewed: PropTypes.bool,
};

export default SignUp;
