/**
*
* PasswordResetVerified
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

class PasswordResetVerified extends React.PureComponent {
	state = {
		firstPass: '',
		secondPass: '',
		validPassword: true,
	}

	handleFirstChange = (e) => {
		this.setState({ firstPass: e.target.value });
	}

	handleSecondChange = (e) => {
		this.setState({ secondPass: e.target.value });
	}

	handlePasswordSubmit = (e) => {
		e.preventDefault();
		const validPassword = this.checkValidPassword();

		if (validPassword) {
			// Send password reset
			this.props.sendPasswordReset({ password: this.state.firstPass });
		}
		this.setState({ validPassword });
	}

	get signupError() {
		const { passwordErrorType } = this.state;
		const errors = [];

		if (passwordErrorType) {
			if (passwordErrorType === 'confirm') {
				errors.push(<p key={'passwordError1'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError1} /></p>);
			}
			if (passwordErrorType === 'length') {
				errors.push(<p key={'passwordError2'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError2} /></p>);
			}
			if (passwordErrorType === 'password') {
				errors.push(<p key={'passwordError3'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError3} /></p>);
			}
			// if (passwordErrorType === 'upperNumSym') {
			// 	errors.push(<p key={'passwordError4'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError4} /></p>);
			// }
		}

		// errors.push(<p key={'passwordError5'} className={'signup-error-message'}><FormattedMessage {...messages.passwordError5} /></p>);
		return <div className={'errors-div'}>{errors}</div>;
	}

	checkValidPassword = () => {
		const { firstPass, secondPass } = this.state;
		const passLength = firstPass.length > 8;
		const passEqual = firstPass === secondPass;
		const passNotPass = firstPass !== 'firstPass';
		// const upperNumSym = /(?=.*\d)|(?=.*[A-Z])|(?=.*[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/])/.test(firstPass); // eslint-disable-line no-useless-escape
		// console.log('upper num sym', upperNumSym);
		const validPassword = passLength && passEqual && passNotPass; // && upperNumSym;

		if (!passEqual) {
			this.setState({ passwordErrorType: 'confirm' });
		}
		if (!passLength) {
			this.setState({ passwordErrorType: 'length' });
		}
		if (!passNotPass) {
			this.setState({ passwordErrorType: 'password1' });
		}
		// else if (!upperNumSym) {
		// 	this.setState({ passwordErrorType: 'upperNumSym' });
		// }
		// console.log('valid password', validPassword);

		if (validPassword) {
			this.setState({ passwordErrorType: '' });
		}

		return validPassword;
	}

	render() {
		const { validPassword } = this.state;
		return (
			<div className={'forgot-password password-verified'}>
				<h1 className={'title'}><FormattedMessage {...messages.title} /></h1>
				<form onSubmit={this.handlePasswordSubmit}>
					<input className={validPassword ? 'first-password' : 'first-password error'} type={'password'} autoComplete={'new-password'} placeholder={'Enter Password'} onChange={this.handleFirstChange} />
					<input className={validPassword ? 'second-password' : 'second-password error'} type={'password'} autoComplete={'new-password'} placeholder={'Re-Enter Password'} onChange={this.handleSecondChange} />
					{this.signupError}
					<div className={'sign-up-button'}>
						<button className={'text'} type={'submit'}><FormattedMessage {...messages.changePassword} /></button>
					</div>
				</form>
				<section className={'message'}>
					<p className={'disclaimer'}><FormattedMessage {...messages.unableToResetPart1} /><a className={'link'} href={'https://support.bible.is/contact'} target={'_blank'}>&nbsp;contact us&nbsp;</a><FormattedMessage {...messages.unableToResetPart2} /></p>
				</section>
			</div>
		);
	}
}

PasswordResetVerified.propTypes = {
	sendPasswordReset: PropTypes.func,
};

export default PasswordResetVerified;
