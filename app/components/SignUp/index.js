/**
 *
 * SignUp
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FacebookAuthentication from '../../containers/FacebookAuthentication';
import GoogleAuthentication from '../../containers/GoogleAuthentication';
import Checkbox from '../Checkbox';
import checkEmail from '../../utils/checkEmailForValidity';
import messages from '../PasswordResetVerified/messages';
// import messages from './messages';
// import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

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
		wantsUpdates: false,
	};

	componentWillReceiveProps() {
		// if (nextProps.socialLoginLink && nextProps.socialLoginLink !== this.props.socialLoginLink) {
		// 	const socialWindow = window.open(nextProps.socialLoginLink, '_blank');
		//
		// 	socialWindow.focus();
		// }
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
	};

	handleFirstName = (e) => {
		this.setState({ firstName: e.target.value });
		this.viewError();
	};

	handleLastName = (e) => {
		this.setState({ lastName: e.target.value });
		this.viewError();
	};

	handleEmailChange = (e) => {
		const email = e.target.value;

		this.setState({ email });
		this.viewError();
	};

	handleConfirmPassword = (e) => {
		const value = e.target.value;

		this.setState({ confirmPassword: value });
		this.viewError();
	};

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
				wantsUpdates: this.state.wantsUpdates,
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
		this.setState({ validPassword, validEmail });
		this.viewError();
	};

	handleEmailUpdatesChange = (e) => {
		this.setState({ wantsUpdates: e.target.checked });
	};

	checkValidEmail = () => checkEmail(this.state.email);

	checkValidPassword = () => {
		const { confirmPassword, password } = this.state;
		const passLength = password.length > 8;
		const passEqual = password === confirmPassword;
		const passNotPass = password !== 'password';
		// const upperNumSym = /(?=.*\d)|(?=.*[A-Z])|(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/.test(password); // eslint-disable-line no-useless-escape
		// console.log('upper num sym', upperNumSym);
		const validPassword = passLength && passEqual && passNotPass; // && upperNumSym;

		if (!passEqual) {
			this.setState({ passwordErrorType: 'confirm' });
		}
		if (!passLength) {
			this.setState({ passwordErrorType: 'length' });
		}
		if (!passNotPass) {
			this.setState({ passwordErrorType: 'password' });
		}
		// } else if (!upperNumSym) {
		// 	this.setState({ passwordErrorType: 'upperNumSym' });
		// }
		// console.log('valid password', validPassword);

		if (validPassword) {
			this.setState({ passwordErrorType: '' });
		}

		return validPassword;
	};

	get signupError() {
		const { validEmail, passwordErrorType } = this.state;
		const errors = [];

		if (passwordErrorType) {
			if (passwordErrorType === 'confirm') {
				errors.push(
					<p key={'passwordError1'} className={'signup-error-message'}>
						<FormattedMessage {...messages.passwordError1} />
					</p>,
				);
			}
			if (passwordErrorType === 'length') {
				errors.push(
					<p key={'passwordError2'} className={'signup-error-message'}>
						<FormattedMessage {...messages.passwordError2} />
					</p>,
				);
			}
			if (passwordErrorType === 'password') {
				errors.push(
					<p key={'passwordError3'} className={'signup-error-message'}>
						<FormattedMessage {...messages.passwordError3} />
					</p>,
				);
			}
			// } else if (passwordErrorType === 'upperNumSym') {
			// 	errors.push(<p key={'passwordError4'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError4} /></p>);
			// }
		}

		errors.push(
			<p key={'passwordError4'} className={'signup-error-message'}>
				<FormattedMessage {...messages.passwordError4} />
			</p>,
		);
		if (!validEmail) {
			errors.push(
				<p key={'emailError'} className={'signup-error-message'}>
					<FormattedMessage {...messages.emailError} />
				</p>,
			);
		}

		return <div className={'errors-div'}>{errors}</div>;
	}

	get signupForm() {
		const { validEmail, validPassword } = this.state;
		return (
			<form onSubmit={this.handleSignup}>
				<input
					required
					autoComplete={'email'}
					onChange={this.handleEmailChange}
					className={validEmail ? 'email' : 'email error'}
					placeholder="E-mail"
					value={this.state.email}
				/>
				<input
					required
					autoComplete={'given-name'}
					onChange={this.handleFirstName}
					className={'name-inputs'}
					placeholder="Given Name"
					value={this.state.firstName}
				/>
				<input
					required
					autoComplete={'family-name'}
					onChange={this.handleLastName}
					className={'name-inputs'}
					placeholder="Family Name"
					value={this.state.lastName}
				/>
				<input
					required
					autoComplete="new-password"
					type="password"
					onChange={this.handlePasswordChange}
					className={validPassword ? 'first-password' : 'first-password error'}
					placeholder="Password"
					value={this.state.password}
				/>
				<input
					required
					autoComplete="new-password"
					type="password"
					onChange={this.handleConfirmPassword}
					className={
						validPassword ? 'second-password' : 'second-password error'
					}
					placeholder="Confirm Password"
					value={this.state.confirmPassword}
				/>
				<div className="sign-up-button">
					<button type="submit" className="text">
						Submit
					</button>
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
	};

	render() {
		const {
			errorMessageViewed,
			socialLoginLink,
			socialMediaLogin,
			activeDriver,
			oauthError,
			readOauthError,
			oauthErrorMessage,
		} = this.props;
		const { showSignupError } = this.state;

		return (
			<React.Fragment>
				<section className="message">
					<p>
						Signing up lets you create Bookmarks, Highlights and Notes, and
						access them wherever you use Bible.is!
					</p>
					<p className={'disclaimer'}>
						<span>By creating an account, you agree to the Bible.is</span>&nbsp;<a
							className="link"
							target={'_blank'}
							href="http://www.bible.is/privacy"
						>
							Privacy Policy
						</a>&nbsp;&&nbsp;<a
							className="link"
							target={'_blank'}
							href="http://www.bible.is/terms"
						>
							Terms of Use
						</a>.
					</p>
				</section>
				{this.signupForm}
				{showSignupError ? this.signupError : null}
				{!errorMessageViewed ? (
					<div className="signup-error-message">
						This email is already registered with an account. Please try a
						different email or sign in.
					</div>
				) : null}
				<Checkbox
					updater={this.handleEmailUpdatesChange}
					label={
						'I would like to receive email updates from Faith Comes By Hearing, parent ministry of Bible.is.'
					}
				/>
				<FacebookAuthentication
					oauthError={oauthError}
					oauthErrorMessage={oauthErrorMessage}
					activeDriver={activeDriver}
					readOauthError={readOauthError}
					socialMediaLogin={socialMediaLogin}
					socialLoginLink={socialLoginLink}
				/>
				<GoogleAuthentication
					activeDriver={activeDriver}
					socialMediaLogin={socialMediaLogin}
					socialLoginLink={socialLoginLink}
				/>
			</React.Fragment>
		);
	}
}

SignUp.propTypes = {
	sendSignupForm: PropTypes.func,
	socialMediaLogin: PropTypes.func,
	viewErrorMessage: PropTypes.func,
	readOauthError: PropTypes.func,
	// errorMessage: PropTypes.string,
	activeDriver: PropTypes.string,
	oauthError: PropTypes.bool,
	oauthErrorMessage: PropTypes.string,
	socialLoginLink: PropTypes.string,
	errorMessageViewed: PropTypes.bool,
};

export default SignUp;
