/**
 *
 * FacebookAuthentication
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SvgWrapper from 'components/SvgWrapper';

export class FacebookAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	handleSocialLogin = () => {
		// console.log('social login facebook clicked');
		const { activeDriver, socialLoginLink, socialMediaLogin } = this.props;

		if (activeDriver === 'facebook' && socialLoginLink) {
			// console.log('active driver', activeDriver);
			// console.log('social login link after user has already been authd', socialLoginLink);
			// const socialWindow = window.open(socialLoginLink, '_blank');
			//
			// socialWindow.focus();
		} else {
			// console.log('sending social driver for facebook');
			socialMediaLogin({ driver: 'facebook' });
		}
	}
	render() {
		return (
			<div role={'button'} tabIndex={0} onClick={this.handleSocialLogin} className="facebook">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
				Sign in with Facebook
			</div>
		);
	}
}

FacebookAuthentication.propTypes = {
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
)(FacebookAuthentication);
