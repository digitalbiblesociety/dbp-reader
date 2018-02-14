/**
 *
 * GoogleAuthentication
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgWrapper from 'components/SvgWrapper';
import { compose } from 'redux';

export class GoogleAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	handleSocialLogin = () => {
		// console.log('social login google clicked');
		const { activeDriver, socialLoginLink, socialMediaLogin } = this.props;

		if (activeDriver === 'google' && socialLoginLink) {
			// console.log('active driver', activeDriver);
			// console.log('social login link', socialLoginLink);
			// const socialWindow = window.open(socialLoginLink, '_blank');
			//
			// socialWindow.focus();
		} else {
			// console.log('sending social driver google');
			socialMediaLogin({ driver: 'google' });
		}
	}
	render() {
		return (
			<div role={'button'} tabIndex={0} onClick={this.handleSocialLogin} className="google">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
				Sign in with Google
			</div>
		);
	}
}

GoogleAuthentication.propTypes = {
	activeDriver: PropTypes.string,
	socialLoginLink: PropTypes.string,
	socialMediaLogin: PropTypes.func,
};


function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(null, mapDispatchToProps);

export default compose(
	withConnect,
)(GoogleAuthentication);
