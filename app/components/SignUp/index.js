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

	componentWillUnmount() {
		this.props.viewErrorMessage();
	}

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
		} else if (!validEmail) {
			// email error message
			this.setState({ showSignupError: true });
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
		const validPassword = passLength && passEqual && passNotPass;

		if (!passEqual) {
			this.setState({ passwordErrorType: 'confirm' });
		}
		if (!passLength) {
			this.setState({ passwordErrorType: 'length' });
		}
		if (!passNotPass) {
			this.setState({ passwordErrorType: 'password' });
		}

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
					<p
						id={'password-match-error'}
						key={'passwordError1'}
						className={'signup-error-message'}
					>
						<FormattedMessage {...messages.passwordError1} />
					</p>,
				);
			}
			if (passwordErrorType === 'length') {
				errors.push(
					<p
						id={'password-length-error'}
						key={'passwordError2'}
						className={'signup-error-message'}
					>
						<FormattedMessage {...messages.passwordError2} />
					</p>,
				);
			}
			if (passwordErrorType === 'password') {
				errors.push(
					<p
						id={'password-type-error'}
						key={'passwordError3'}
						className={'signup-error-message'}
					>
						<FormattedMessage {...messages.passwordError3} />
					</p>,
				);
			}
		}

		errors.push(
			<p
				id={'password-number-upper-symbol'}
				key={'passwordError4'}
				className={'signup-error-message'}
			>
				<FormattedMessage {...messages.passwordError4} />
			</p>,
		);
		if (!validEmail) {
			errors.push(
				<p
					id={'emailError'}
					key={'emailError'}
					className={'signup-error-message'}
				>
					<FormattedMessage {...messages.emailError} />
				</p>,
			);
		}

		return <div className={'errors-div'}>{errors}</div>;
	}

	get signupForm() {
		const { validEmail, validPassword } = this.state;
		return (
			<form id={'signup-form'} onSubmit={this.handleSignup}>
				<input
					required
					id={'email'}
					autoComplete={'email'}
					type={'email'}
					onChange={this.handleEmailChange}
					className={validEmail ? 'email' : 'email error'}
					placeholder="E-mail"
					value={this.state.email}
				/>
				<input
					required
					id={'first-name'}
					autoComplete={'given-name'}
					onChange={this.handleFirstName}
					className={'name-inputs'}
					placeholder="Given Name"
					value={this.state.firstName}
				/>
				<input
					required
					id={'last-name'}
					autoComplete={'family-name'}
					onChange={this.handleLastName}
					className={'name-inputs'}
					placeholder="Family Name"
					value={this.state.lastName}
				/>
				<input
					required
					id={'password'}
					autoComplete="new-password"
					type="password"
					onChange={this.handlePasswordChange}
					className={validPassword ? 'first-password' : 'first-password error'}
					placeholder="Password"
					value={this.state.password}
				/>
				<input
					required
					id={'password_confirm'}
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
					<button id={'submit-button'} type="submit" className="text">
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
						<span>By creating an account, you agree to the Bible.is</span>
						&nbsp;
						<a
							className="link"
							target={'_blank'}
							href={`${process.env.BASE_SITE_URL}/privacy`}
						>
							Privacy Policy
						</a>
						&nbsp;&&nbsp;
						<a
							className="link"
							target={'_blank'}
							href={`${process.env.BASE_SITE_URL}/terms`}
						>
							Terms of Use
						</a>
						.
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
	activeDriver: PropTypes.string,
	oauthError: PropTypes.bool,
	oauthErrorMessage: PropTypes.string,
	socialLoginLink: PropTypes.string,
	errorMessageViewed: PropTypes.bool,
};

export default SignUp;
