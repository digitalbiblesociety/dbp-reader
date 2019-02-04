/**
 *
 * Profile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import injectReducer from '../../utils/injectReducer';
import SignUp from '../../components/SignUp';
import Login from '../../components/Login';
import PasswordReset from '../../components/PasswordReset';
import AccountSettings from '../../components/AccountSettings';
import SvgWrapper from '../../components/SvgWrapper';
import PasswordResetVerified from '../../components/PasswordResetVerified';
import CloseMenuFunctions from '../../utils/closeMenuFunctions';
import {
	selectAccountOption,
	sendLoginForm,
	sendSignUpForm,
	socialMediaLogin,
	getUserData,
	resetPassword,
	updateEmail,
	updatePassword,
	updateUserInformation,
	deleteUser,
	logout,
	viewErrorMessage,
	clearErrorMessage,
	changePicture,
	sendPasswordReset,
	readOauthError,
} from './actions';
import { cleanNotebook } from '../Notes/actions';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import Ieerror from '../../components/Ieerror';

export class Profile extends React.PureComponent {
	state = {
		popupOpen: false,
		clearAccessToken: false,
	};

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(
			this.ref,
			this.props.toggleProfile,
		);
		this.closeMenuController.onMenuMount();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.profile.activeOption !== nextProps.profile.activeOption) {
			this.props.dispatch(clearErrorMessage());
		}
		if (
			!this.props.profile.userAuthenticated &&
			nextProps.profile.userAuthenticated &&
			this.props.userAccessToken &&
			nextProps.userAccessToken
		) {
			this.setState({ clearAccessToken: true });
		}
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		this.props.dispatch(clearErrorMessage());
	}

	setRef = (node) => {
		this.ref = node;
	};

	getUserData = (userId) => this.props.dispatch(getUserData(userId));

	changePicture = (props) =>
		this.props.dispatch(
			changePicture({ ...props, userId: this.props.profile.userId }),
		);

	sendSignUpForm = (props) => this.props.dispatch(sendSignUpForm(props));

	viewErrorMessage = (props) => this.props.dispatch(viewErrorMessage(props));

	socialMediaLogin = (props) => this.props.dispatch(socialMediaLogin(props));

	resetPassword = (e, props) => {
		this.props.dispatch(resetPassword(props));
		const client = e.target.childNodes[1].getBoundingClientRect() || {
			x: 0,
			y: 0,
		};
		const coords = { x: client.x, y: client.y };
		this.openPopup(coords);
	};

	sendPasswordReset = (e, props) => {
		this.props.dispatch(
			sendPasswordReset({
				...props,
				userAccessToken: this.props.userAccessToken,
			}),
		);
		this.props.resetPasswordSent();
	};

	deleteUser = (props) => {
		this.props.dispatch(deleteUser(props));
		this.props.dispatch(cleanNotebook());
		this.props.dispatch(logout());
	};

	readOauthError = (props) => this.props.dispatch(readOauthError(props));

	sendLoginForm = (props) => this.props.dispatch(sendLoginForm(props));

	selectAccountOption = (option) =>
		this.props.dispatch(selectAccountOption(option));

	updatePassword = (props) => this.props.dispatch(updatePassword(props));

	updateEmail = (props) => this.props.dispatch(updateEmail(props));

	updateUserInformation = (props) =>
		this.props.dispatch(updateUserInformation(props));

	logout = () => {
		this.props.dispatch(logout());
		this.props.dispatch(cleanNotebook());
		/* eslint-disable no-undef */
		if (typeof gapi !== 'undefined' && typeof auth2 !== 'undefined') {
			auth2.signOut();
		}
		if (typeof FB !== 'undefined') {
			// Find the fb access code
			FB.getLoginStatus(() => {
				FB.logout(() => {});
			});
		}
		/* eslint-enable no-undef */
	};

	openPopup = (coords) => {
		this.setState({ popupOpen: true, popupCoords: coords }, () => {
			setTimeout(
				() =>
					this.setState({ popupOpen: false }, () =>
						this.props.dispatch(clearErrorMessage()),
					),
				2500,
			);
		});
	};

	get accountOptions() {
		const {
			activeOption,
			userAuthenticated,
			loginErrorMessage,
			signupErrorMessage,
			userId,
			userProfile,
			socialLoginLink,
			activeDriver,
			errorMessageViewed,
			passwordResetError,
			passwordResetMessage,
			oauthError,
			oauthErrorMessage,
		} = this.props.profile;
		const { popupOpen, popupCoords } = this.state;

		return userAuthenticated ? (
			<AccountSettings
				logout={this.logout}
				deleteUser={this.deleteUser}
				updatePassword={this.updatePassword}
				changePicture={this.changePicture}
				profile={userProfile}
				userId={userId}
				updateEmail={this.updateEmail}
				updateUserInformation={this.updateUserInformation}
			/>
		) : (
			<React.Fragment>
				<div className="form-options">
					<span
						role="button"
						tabIndex={0}
						onClick={() => this.selectAccountOption('login')}
						className={activeOption === 'login' ? 'login active' : 'login'}
					>
						LOGIN
					</span>
					<span
						role="button"
						tabIndex={0}
						onClick={() => this.selectAccountOption('signup')}
						className={activeOption === 'signup' ? 'signup active' : 'signup'}
					>
						SIGN UP
					</span>
				</div>
				{activeOption === 'login' ? (
					<Login
						sendLoginForm={this.sendLoginForm}
						selectAccountOption={this.selectAccountOption}
						socialMediaLogin={this.socialMediaLogin}
						viewErrorMessage={this.viewErrorMessage}
						readOauthError={this.readOauthError}
						socialLoginLink={socialLoginLink}
						errorMessage={loginErrorMessage}
						activeDriver={activeDriver}
						errorMessageViewed={errorMessageViewed}
						oauthError={oauthError}
						oauthErrorMessage={oauthErrorMessage}
					/>
				) : null}
				{activeOption === 'signup' ? (
					<SignUp
						sendSignupForm={this.sendSignUpForm}
						socialMediaLogin={this.socialMediaLogin}
						viewErrorMessage={this.viewErrorMessage}
						errorMessage={signupErrorMessage}
						readOauthError={this.readOauthError}
						socialLoginLink={socialLoginLink}
						activeDriver={activeDriver}
						errorMessageViewed={errorMessageViewed}
						oauthError={oauthError}
						oauthErrorMessage={oauthErrorMessage}
					/>
				) : null}
				{activeOption === 'password_reset' ? (
					<PasswordReset
						popupCoords={popupCoords}
						popupOpen={popupOpen}
						message={passwordResetMessage || passwordResetError}
						resetPassword={this.resetPassword}
						openPopup={this.openPopup}
					/>
				) : null}
			</React.Fragment>
		);
	}

	render() {
		const { toggleProfile, userAccessToken, isIe } = this.props;
		const { popupOpen, popupCoords, clearAccessToken } = this.state;

		if (isIe) {
			return (
				<aside ref={this.setRef} className="profile">
					<header>
						<h1>Profile</h1>
						<SvgWrapper
							className={'icon'}
							svgid={'profile'}
							onClick={toggleProfile}
						/>
						<SvgWrapper
							className={'icon'}
							svgid={'arrow_left'}
							onClick={toggleProfile}
						/>
					</header>
					<Ieerror />
				</aside>
			);
		}

		return (
			<aside ref={this.setRef} className="profile">
				<header>
					<h1>Profile</h1>
					<SvgWrapper
						className={'icon'}
						svgid={'profile'}
						onClick={toggleProfile}
					/>
					<SvgWrapper
						className={'icon'}
						svgid={'arrow_left'}
						onClick={toggleProfile}
					/>
				</header>
				<div className="profile-content">
					{userAccessToken && !clearAccessToken ? (
						<PasswordResetVerified
							sendPasswordReset={this.sendPasswordReset}
							popupOpen={popupOpen}
							popupCoords={popupCoords}
							openPopup={this.openPopup}
						/>
					) : (
						this.accountOptions
					)}
				</div>
			</aside>
		);
	}
}

Profile.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleProfile: PropTypes.func,
	profile: PropTypes.object,
	userAccessToken: PropTypes.string,
	resetPasswordSent: PropTypes.func,
	isIe: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'profile', reducer });

export default compose(
	withReducer,
	withConnect,
)(Profile);
