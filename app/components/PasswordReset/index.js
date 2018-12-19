/**
 *
 * PasswordReset
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import PopupMessage from '../PopupMessage';
import checkEmail from '../../utils/checkEmailForValidity';

class PasswordReset extends React.PureComponent {
	state = {
		email: '',
	};

	handleSubmit = (e) => {
		e.preventDefault();
		const email = this.state.email;
		if (email && checkEmail(email)) {
			this.props.resetPassword(e, { email: this.state.email });
		} else {
			const client = e.target.childNodes[1].getBoundingClientRect() || {
				x: 0,
				y: 0,
			};

			this.props.openPopup({ x: client.x, y: client.y });
		}
	};

	handleInputChange = (e) => this.setState({ email: e.target.value });

	render() {
		const {
			popupCoords,
			popupOpen,
			message = 'Please enter a valid email.',
		} = this.props;
		const { email } = this.state;

		return (
			<>
				<div className="forgot-password">
					<p>
						In order to reset your password, please enter the email address you
						used to register for Bible.is.
					</p>
					<form onSubmit={this.handleSubmit} className={'wrapper'}>
						<input
							onChange={this.handleInputChange}
							value={email}
							autoComplete={'email'}
							placeholder="E-mail"
						/>
						<button type={'submit'} className="text">
							Reset Password
						</button>
					</form>
					<div className="disclaimer">
						If you are unable to reset your password, please
						<a href="https://support.bible.is/contact" className="link">
							&nbsp;contact us&nbsp;
						</a>
						for support.
					</div>
				</div>
				{popupOpen ? (
					<PopupMessage x={popupCoords.x} y={popupCoords.y} message={message} />
				) : null}
			</>
		);
	}
}

PasswordReset.propTypes = {
	popupOpen: PropTypes.bool,
	message: PropTypes.string,
	openPopup: PropTypes.func,
	resetPassword: PropTypes.func,
	popupCoords: PropTypes.object,
};

export default PasswordReset;
