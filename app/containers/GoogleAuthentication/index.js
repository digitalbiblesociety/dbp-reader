/**
 *
 * GoogleAuthentication
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SvgWrapper from 'components/SvgWrapper';
import PopupMessage from 'components/PopupMessage';

export class GoogleAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = { popupOpen: false, popupCoords: { x: 0, y: 0 } }
	handleSocialLogin = () => {
		// console.log('social login google clicked');
		const { socialMediaLogin } = this.props;
		// console.log('Sending Google driver');

		socialMediaLogin({ driver: 'google' });
		// if (activeDriver === 'google' && socialLoginLink) {
		// 	// console.log('active driver', activeDriver);
		// 	// console.log('social login link', socialLoginLink);
		// 	// const socialWindow = window.open(socialLoginLink, '_blank');
		// 	//
		// 	// socialWindow.focus();
		// } else {
		// 	// console.log('sending social driver google');
		// 	socialMediaLogin({ driver: 'google' });
		// }
	}
	openPopup = (e) => {
		const coords = { x: e.clientX, y: e.clientY };
		this.setState({ popupOpen: true, popupCoords: coords });
		setTimeout(() => this.setState({ popupOpen: false }), 1250);
	}
	render() {
		return (
			<div role={'button'} tabIndex={0} onClick={this.handleSocialLogin} className="google">
				<SvgWrapper style={{ backgroundColor: 'white' }} className="svg" height="26px" width="26px" svgid="google" />
				Sign in with Google
				{
					this.state.popupOpen ? <PopupMessage y={this.state.popupCoords.y} x={this.state.popupCoords.x} message={'This functionality is currently unavailable.'} /> : null
				}
			</div>
		);
	}
}

GoogleAuthentication.propTypes = {
	// activeDriver: PropTypes.string,
	// socialLoginLink: PropTypes.string,
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
