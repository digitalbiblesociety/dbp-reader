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
import { createUserWithSocialAccount } from '../HomePage/actions';

export class FacebookAuthentication extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = { popupOpen: false, popupCoords: { x: 0, y: 0 } }

	handleSocialLogin = () => {
		// console.log('social login facebook clicked', FB);
		// const { socialMediaLogin } = this.props;
		// // console.log('Sending facebook driver');
		// socialMediaLogin({ driver: 'facebook' });
		// if (activeDriver === 'facebook' && socialLoginLink) {
		// 	// console.log('active driver', activeDriver);
		// 	// console.log('social login link after user has already been authd', socialLoginLink);
		// 	// const socialWindow = window.open(socialLoginLink, '_blank');
		// 	//
		// 	// socialWindow.focus();
		// } else {
		// 	// console.log('sending social driver for facebook');
		// 	socialMediaLogin({ driver: 'facebook' });
		// }
		if (FB) { // eslint-disable-line no-undef
			FB.getLoginStatus((getLoginResponse) => { // eslint-disable-line no-undef
				// console.log('fb login status', getLoginResponse);
				// console.log('getLoginResponse.authResponse.accessToken', getLoginResponse.authResponse.accessToken);
				if (getLoginResponse.status === 'connected') {
					FB.api( // eslint-disable-line no-undef
						'/me',
						{
							fields: 'name,last_name,about,birthday,email,id,picture',
							access_token: getLoginResponse.authResponse.accessToken,
						},
						(getLoginCbRes) => {
							const {
								email,
								picture,
								name: nickname,
								last_name: name,
								id,
							} = getLoginCbRes;
							let avatar = '';
							// console.log('getLoginCbRes', getLoginCbRes);

							if (picture && picture.data && picture.data.url) {
								avatar = picture.data.url;
							}
							// console.log('Dispatching create user from get login status function');

							this.props.dispatch(createUserWithSocialAccount({
								email,
								avatar,
								nickname,
								name,
								id,
								provider: 'facebook',
							}));
						},
					);
				} else {
					// Do login stuff
					FB.login((loginResponse) => { // eslint-disable-line no-undef
						if (loginResponse.status === 'connected') {
							FB.api( // eslint-disable-line no-undef
								'/me',
								{
									fields: 'name,last_name,about,birthday,email,id,picture',
									access_token: loginResponse.authResponse.accessToken,
								},
								(loginCbRes) => {
									const {
										email,
										picture,
										name: nickname,
										last_name: name,
										id,
									} = loginCbRes;
									let avatar = '';
									// console.log('loginCbRes', loginCbRes);

									if (picture && picture.data && picture.data.url) {
										avatar = picture.data.url;
									}
									// console.log('Dispatching create user from login function');

									this.props.dispatch(createUserWithSocialAccount({
										email,
										avatar,
										nickname,
										name,
										id,
										provider: 'facebook',
									}));
								},
							);
						} else {
							// Do something to say that the login was not successful
						}
					}, { scope: 'public_profile,email' });
				}
				// statusChangeCallback(response);
			});
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
	// activeDriver: PropTypes.string,
	// socialLoginLink: PropTypes.string,
	dispatch: PropTypes.func,
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
