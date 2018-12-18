/**
 *
 * PleaseSignInMessage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { toggleProfile } from '../../containers/HomePage/actions';
import messages from './messages';

function PleaseSignInMessage({ dispatch, message }) {
	const handleClick = () => dispatch(toggleProfile());
	return (
		<div className="need-to-login">
			<FormattedMessage {...messages.please} />
			&nbsp;
			<span
				className="login-text"
				role="button"
				tabIndex={0}
				onClick={handleClick}
			>
				<FormattedMessage {...messages.signIn} />
			</span>
			&nbsp;
			<FormattedMessage {...messages[message]} />
		</div>
	);
}

PleaseSignInMessage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	message: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}
const withConnect = connect(
	null,
	mapDispatchToProps,
);

export default withConnect(PleaseSignInMessage);
