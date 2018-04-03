/**
*
* Login
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import FacebookAuthentication from 'containers/FacebookAuthentication';
import GoogleAuthentication from 'containers/GoogleAuthentication';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

class Login extends React.PureComponent {
	state = {
		password: '',
		email: '',
		signInActive: false,
		staySignedIn: false,
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.socialLoginLink && nextProps.socialLoginLink !== this.props.socialLoginLink) {
			// console.log('social link', nextProps.socialLoginLink);
			const socialWindow = window.open(nextProps.socialLoginLink, '_blank');

			socialWindow.focus();
		}
	}

	handlePasswordChange = (e) => {
		this.setState({ password: e.target.value });
	}

	handleEmailChange = (e) => {
		this.setState({ email: e.target.value });
	}

	handleSendingLogin = (e) => {
		e.preventDefault();
		this.props.sendLoginForm({
			email: this.state.email,
			password: this.state.password,
			stay: this.state.staySignedIn,
		});
	}

	handleStayLoggedInChange = (e) => {
		// e.preventDefault();
		this.setState({
			staySignedIn: e.target.checked,
		});
	}

	toggleSignInForm = (state) => {
		this.setState({ signInActive: state });
	}

	get signInComponent() {
		const {
			errorMessage,
			selectAccountOption,
		} = this.props;

		return (
			<React.Fragment>
				<form onSubmit={this.handleSendingLogin}>
					<span className={'sign-in-input'}>
						<SvgWrapper className="icon" width="30px" height="30px" fill="#fff" svgid="e-mail" />
						<input autoComplete={'email'} className={errorMessage ? 'error' : ''} placeholder="E-mail" onChange={this.handleEmailChange} value={this.state.email} />
					</span>
					<span className={'sign-in-input'}>
						<SvgWrapper className="icon" width="26px" height="26px" fill="#fff" svgid="lock" />
						<input autoComplete={'current-password'} className={errorMessage ? 'error' : ''} type="password" placeholder="Password" onChange={this.handlePasswordChange} value={this.state.password} />
					</span>
					<div className="sign-in-button">
						<input className="login-checkbox" id={'login-checkbox'} type="checkbox" onChange={this.handleStayLoggedInChange} />
						<label htmlFor={'login-checkbox'} className="text">Remember Me</label>
						<button type="submit" className="login-button">Sign In</button>
					</div>
					{
						errorMessage ? (
							<div className="login-error-message">
								<SvgWrapper className={'icon'} svgid={'warning'} />
								<span className={'error-text'}>Username or Password is incorrect. Please try again.</span>
							</div>
						) : null
					}
					<section className="forgot-password">
						<span role="button" tabIndex={0} className="link" onClick={() => { selectAccountOption('password_reset'); this.toggleSignInForm(false); }}>Forgot your password?</span>
					</section>
				</form>
			</React.Fragment>
		);
	}

	render() {
		const {
			socialLoginLink,
			socialMediaLogin,
			activeDriver,
		} = this.props;
		return (
			<React.Fragment>
				{
					this.state.signInActive ? this.signInComponent : (
						<div role="button" tabIndex={0} onClick={() => this.toggleSignInForm(true)} className="sign-in">
							<SvgWrapper className="svg" width="30px" height="30px" fill="#fff" svgid="e-mail" />
							<span className="text">Sign in with E-mail</span>
						</div>
					)
				}
				<FacebookAuthentication activeDriver={activeDriver} socialMediaLogin={socialMediaLogin} socialLoginLink={socialLoginLink} />
				<GoogleAuthentication activeDriver={activeDriver} socialMediaLogin={socialMediaLogin} socialLoginLink={socialLoginLink} />
			</React.Fragment>
		);
	}
}

Login.propTypes = {
	sendLoginForm: PropTypes.func,
	socialMediaLogin: PropTypes.func,
	selectAccountOption: PropTypes.func,
	socialLoginLink: PropTypes.string,
	errorMessage: PropTypes.string,
	activeDriver: PropTypes.string,
};

export default Login;
