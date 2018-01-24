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

class Login extends React.PureComponent {
	state = {
		password: '',
		email: '',
		signInActive: false,
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
		});
	}

	toggleSignInForm = (state) => {
		this.setState({ signInActive: state });
	}

	get signInComponent() {
		const { errorMessage } = this.props;

		return (
			<React.Fragment>
				<form onSubmit={this.handleSendingLogin}>
					<input className="email" placeholder="Enter E-mail" onChange={this.handleEmailChange} value={this.state.email} />
					<input className="first-password" type="password" placeholder="Enter Password" onChange={this.handlePasswordChange} value={this.state.password} />
					<div className="sign-in-button">
						<input className="login-checkbox" type="checkbox" />
						<span className="text">KEEP ME LOGGED IN</span>
						<button type="submit" className="login-button">LOGIN</button>
					</div>
				</form>
				{
					errorMessage ? (
						<div className="login-error-message">{errorMessage}</div>
					) : null
				}
			</React.Fragment>
		);
	}

	render() {
		const {
			selectAccountOption,
		} = this.props;
		return (
			<React.Fragment>
				{
					this.state.signInActive ? this.signInComponent : (
						<div role="button" tabIndex={0} onClick={() => this.toggleSignInForm(true)} className="sign-in">
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
					<span role="button" tabIndex={0} className="link" onClick={() => { selectAccountOption('signup'); this.toggleSignInForm(false); }}> Sign up for free!</span>
				</section>
				<section className="forgot-password">
					<span role="button" tabIndex={0} className="link" onClick={() => { selectAccountOption('password_reset'); this.toggleSignInForm(false); }}>Forgot your password?</span>
				</section>
			</React.Fragment>
		);
	}
}

Login.propTypes = {
	selectAccountOption: PropTypes.func,
	sendLoginForm: PropTypes.func,
	errorMessage: PropTypes.string,
};

export default Login;
