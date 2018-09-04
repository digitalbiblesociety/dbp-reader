/**
 *
 * Login
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from '../SvgWrapper';
import FacebookAuthentication from '../../containers/FacebookAuthentication';
import GoogleAuthentication from '../../containers/GoogleAuthentication';
// import checkEmailForValidity from '../../utils/checkEmailForValidity';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class Login extends React.PureComponent {
	state = {
		password: '',
		email: '',
		signInActive: false,
		staySignedIn: false,
	};

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.socialLoginLink &&
			nextProps.socialLoginLink !== this.props.socialLoginLink
		) {
			// console.log('social link', nextProps.socialLoginLink);
			window.open(nextProps.socialLoginLink, '_self');
			// socialWindow.focus();
		}
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
		this.viewError();
	};

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value });
		this.viewError();
	};

	handleSendingLogin = (e) => {
		e.preventDefault();

		this.props.sendLoginForm({
			email: this.state.email,
			password: this.state.password,
			stay: this.state.staySignedIn,
		});
	};

	handleStayLoggedInChange = (e) => {
		// e.preventDefault();
		this.setState({
			staySignedIn: e.target.checked,
		});
	};

	toggleSignInForm = (state) => {
		this.setState({ signInActive: state });
		this.viewError();
	};

	get signInComponent() {
		const {
			errorMessageViewed,
			selectAccountOption,
			errorMessage,
		} = this.props;
		// console.log('errorMessage', errorMessage);
		return (
			<React.Fragment>
				<form onSubmit={this.handleSendingLogin}>
					<span className={'sign-in-input'}>
						<SvgWrapper
							className="icon"
							width="30px"
							height="30px"
							fill="#fff"
							svgid="e-mail"
						/>
						<input
							autoComplete={'email'}
							className={errorMessageViewed ? '' : 'error'}
							placeholder="E-mail"
							onChange={this.handleEmailChange}
							value={this.state.email}
						/>
					</span>
					<span className={'sign-in-input'}>
						<SvgWrapper
							className="icon"
							width="26px"
							height="26px"
							fill="#fff"
							svgid="lock"
						/>
						<input
							autoComplete={'current-password'}
							className={errorMessageViewed ? '' : 'error'}
							type="password"
							placeholder="Password"
							onChange={this.handlePasswordChange}
							value={this.state.password}
						/>
					</span>
					<div className="sign-in-button">
						<input
							className="login-checkbox"
							id={'login-checkbox'}
							type="checkbox"
							onChange={this.handleStayLoggedInChange}
						/>
						<label htmlFor={'login-checkbox'} className="text">
							Remember Me
						</label>
						<button type="submit" className="login-button">
							Sign In
						</button>
					</div>
					{!errorMessageViewed ? (
						<div className="login-error-message">
							<SvgWrapper className={'icon'} svgid={'warning'} />
							<span className={'error-text'}>
								{errorMessage ||
									'Username or Password is incorrect. Please try again.'}
							</span>
						</div>
					) : null}
					<section className="forgot-password">
						<span
							role="button"
							tabIndex={0}
							className="link"
							onClick={() => {
								selectAccountOption('password_reset');
								this.toggleSignInForm(false);
							}}
						>
							Forgot your password?
						</span>
					</section>
				</form>
			</React.Fragment>
		);
	}

	viewError = () => {
		if (!this.props.errorMessageViewed) {
			this.props.viewErrorMessage();
		}
	};

	render() {
		const {
			socialLoginLink,
			socialMediaLogin,
			activeDriver,
			oauthError,
			readOauthError,
			oauthErrorMessage,
		} = this.props;

		return (
			<React.Fragment>
				{this.signInComponent}
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

Login.propTypes = {
	sendLoginForm: PropTypes.func,
	socialMediaLogin: PropTypes.func,
	viewErrorMessage: PropTypes.func,
	selectAccountOption: PropTypes.func,
	readOauthError: PropTypes.func,
	socialLoginLink: PropTypes.string,
	oauthError: PropTypes.bool,
	oauthErrorMessage: PropTypes.string,
	errorMessage: PropTypes.string,
	// errorMessage: PropTypes.string,
	activeDriver: PropTypes.string,
	errorMessageViewed: PropTypes.bool,
};

export default Login;
