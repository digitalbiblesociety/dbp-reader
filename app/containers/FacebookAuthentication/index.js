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
import PopupMessage from 'components/PopupMessage';

export class FacebookAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = { popupOpen: false, popupCoords: { x: 0, y: 0 } }
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
	openPopup = (e) => {
		const coords = { x: e.clientX, y: e.clientY };
		this.setState({ popupOpen: true, popupCoords: coords });
		setTimeout(() => this.setState({ popupOpen: false }), 1250);
	}
	render() {
		return (
			<div role={'button'} tabIndex={0} onClick={this.handleSocialLogin} className="facebook">
				<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
				Sign in with Facebook
				{
					this.state.popupOpen ? <PopupMessage y={this.state.popupCoords.y} x={this.state.popupCoords.x} message={'This functionality is currently unavailable.'} /> : null
				}
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
