/**
*
* PasswordReset
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import PopupMessage from 'components/PopupMessage';
import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function PasswordReset({ popupCoords, popupOpen, message, resetPassword }) {
	return (
		<React.Fragment>
			<section className="forgot-password">
				<p>In order to reset your password, please enter the email address you used to register for Bible.is.</p>
				<div className={'wrapper'}>
					<input placeholder="E-mail" />
					<span role={'button'} tabIndex={0} onClick={(e) => resetPassword(e, {})} className="text">Reset Password</span>
				</div>
				<div className="disclaimer">
					If you are unable to reset your password, please
					<Link className="link" to="/contact-form"> contact us </Link>
					for support.
				</div>
			</section>
			{
				popupOpen ? <PopupMessage x={popupCoords.x} y={popupCoords.y} message={message} /> : null
			}
		</React.Fragment>
	);
}

PasswordReset.propTypes = {
	popupOpen: PropTypes.bool,
	message: PropTypes.string,
	resetPassword: PropTypes.func,
	popupCoords: PropTypes.object,
};

export default PasswordReset;
