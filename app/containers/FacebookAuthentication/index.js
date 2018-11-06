/**
 *
 * FacebookAuthentication
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import SvgWrapper from '../../components/SvgWrapper';
import PopupMessage from '../../components/PopupMessage';
import { createUserWithSocialAccount } from '../HomePage/actions';

export class FacebookAuthentication extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	state = {
		popupOpen: false,
		popupCoords: { x: 0, y: 0 },
		oauthError: '',
		oauthErrorMessage: '',
	};

	componentWillReceiveProps(nextProps) {
		if (
			!this.state.popupOpen &&
			nextProps.oauthError &&
			nextProps.oauthErrorMessage
		) {
			this.openPopup(
				{ clientX: 150, clientY: 300 },
				nextProps.oauthError,
				nextProps.oauthErrorMessage,
			);
			// this.setState({
			// 	popupOpen: true,
			// 	oauthError: nextProps.oauthError,
			// 	oauthErrorMessage: nextProps.oauthErrorMessage,
			// });
		}
	}

	handleSocialLogin = (e) => {
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
		/* eslint-disable no-undef */
		if (typeof FB !== 'undefined') {
			FB.getLoginStatus((getLoginResponse) => {
				// console.log('fb login status', getLoginResponse);
				// console.log('getLoginResponse.authResponse.accessToken', getLoginResponse.authResponse.accessToken);
				if (getLoginResponse.status === 'connected') {
					FB.api(
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

							this.props.dispatch(
								createUserWithSocialAccount({
									email,
									avatar,
									nickname,
									name,
									id,
									provider: 'facebook',
								}),
							);
						},
					);
				} else {
					// Do login stuff
					FB.login(
						(loginResponse) => {
							if (loginResponse.status === 'connected') {
								FB.api(
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

										this.props.dispatch(
											createUserWithSocialAccount({
												email,
												avatar,
												nickname,
												name,
												id,
												provider: 'facebook',
											}),
										);
									},
								);
							} else {
								// Do something to say that the login was not successful
								this.openPopup(
									e,
									true,
									'There was a problem connecting to your Facebook account.',
								);
							}
						},
						{ scope: 'public_profile,email' },
					);
				}
				// statusChangeCallback(response);
			});
		}
		/* eslint-enable */
	};

	openPopup = (e, error, message) => {
		const coords = { x: e.clientX || 150, y: e.clientY || 300 };
		this.setState({
			popupOpen: true,
			popupCoords: coords,
			oauthError: error,
			oauthErrorMessage: message,
		});
		setTimeout(
			() =>
				this.setState({ popupOpen: false }, () => this.props.readOauthError()),
			2500,
		);
	};

	render() {
		const { oauthErrorMessage } = this.state;
		// console.log('oauthErrorMessage, oauthError', oauthErrorMessage, oauthError);

		return (
			<div
				role={'button'}
				tabIndex={0}
				onClick={this.handleSocialLogin}
				className="facebook"
			>
				<SvgWrapper
					className="svg"
					height="30px"
					width="30px"
					fill="#fff"
					svgid="facebook"
				/>
				Sign in with Facebook
				{this.state.popupOpen ? (
					<PopupMessage
						y={this.state.popupCoords.y}
						x={this.state.popupCoords.x}
						styles={{ maxHeight: 80 }}
						message={
							oauthErrorMessage ||
							'This functionality is currently unavailable.'
						}
					/>
				) : null}
			</div>
		);
	}
}

FacebookAuthentication.propTypes = {
	// activeDriver: PropTypes.string,
	// socialLoginLink: PropTypes.string,
	oauthError: PropTypes.bool,
	oauthErrorMessage: PropTypes.string,
	readOauthError: PropTypes.func,
	dispatch: PropTypes.func,
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

export default compose(withConnect)(FacebookAuthentication);
