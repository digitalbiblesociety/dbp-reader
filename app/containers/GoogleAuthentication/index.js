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
import { createUserWithSocialAccount } from '../HomePage/actions';

export class GoogleAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = { popupOpen: false, popupCoords: { x: 0, y: 0 } }
	handleSocialLogin = () => {
		// console.log('social login google clicked', auth2);
		// const { socialMediaLogin } = this.props;
		// // console.log('Sending Google driver');
		//
		// socialMediaLogin({ driver: 'google' });
		// // if (activeDriver === 'google' && socialLoginLink) {
		// // 	// console.log('active driver', activeDriver);
		// // 	// console.log('social login link', socialLoginLink);
		// // 	// const socialWindow = window.open(socialLoginLink, '_blank');
		// // 	//
		// // 	// socialWindow.focus();
		// // } else {
		// // 	// console.log('sending social driver google');
		// // 	socialMediaLogin({ driver: 'google' });
		// // }
		/* eslint-disable no-undef */
		if (auth2) {
			if (!auth2.isSignedIn.get()) {
				auth2.signIn().then(() => {
					const prof = auth2.currentUser.get().getBasicProfile();
					const user = {
						name: prof.getName(),
						nickname: prof.getGivenName(),
						avatar: prof.getImageUrl(),
						email: prof.getEmail(),
						id: prof.getId(),
					};
					this.props.dispatch(createUserWithSocialAccount({ ...user, provider: 'google' }));
					// console.log('google user', user);

					// console.log('auth2.currentUser.get().getBasicProfile()');
				});
				// console.log('auth2.isSignedIn.get()', auth2.isSignedIn.get());
			} else {
				const prof = auth2.currentUser.get().getBasicProfile();
				const user = {
					name: prof.getName(),
					avatar: prof.getImageUrl(),
					email: prof.getEmail(),
					id: prof.getId(),
				};
				this.props.dispatch(createUserWithSocialAccount({ ...user, provider: 'google' }));
			}
		}
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
	dispatch: PropTypes.func,
	// socialMediaLogin: PropTypes.func,
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
