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
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import SignUp from 'components/SignUp';
import Login from 'components/Login';
import PasswordReset from 'components/PasswordReset';
import AccountSettings from 'components/AccountSettings';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import SvgWrapper from 'components/SvgWrapper';
import CloseMenuFunctions from 'utils/closeMenuFunctions';
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
} from './actions';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class Profile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		popupOpen: false,
	}

	componentDidMount() {
		this.closeMenuController = new CloseMenuFunctions(this.ref, this.props.toggleProfile);
		this.closeMenuController.onMenuMount();
	}

	componentWillUnmount() {
		this.closeMenuController.onMenuUnmount();
		this.props.dispatch(clearErrorMessage());
	}

	setRef = (node) => {
		this.ref = node;
	}

	getUserData = (userId) => this.props.dispatch(getUserData(userId))

	sendSignUpForm = (props) => this.props.dispatch(sendSignUpForm(props))
	viewErrorMessage = (props) => this.props.dispatch(viewErrorMessage(props))
	socialMediaLogin = (props) => this.props.dispatch(socialMediaLogin(props))
	resetPassword = (e, props) => {
		const coords = { x: e.clientX, y: e.clientY };
		this.openPopup(coords);
		this.props.dispatch(resetPassword(props));
	}
	deleteUser = (props) => this.props.dispatch(deleteUser(props))
	sendLoginForm = (props) => this.props.dispatch(sendLoginForm(props))
	selectAccountOption = (option) => this.props.dispatch(selectAccountOption(option))
	updatePassword = (props) => this.props.dispatch(updatePassword(props))
	updateEmail = (props) => this.props.dispatch(updateEmail(props))
	updateUserInformation = (props) => this.props.dispatch(updateUserInformation(props))
	logout = () => this.props.dispatch(logout())

	openPopup = (coords) => {
		// console.log('opening popup');
		this.setState({ popupOpen: true, popupCoords: coords });
		setTimeout(() => this.setState({ popupOpen: false }), 2500);
	}

	// onCloseModal = () => {
	// 	// closes the modal if it is active on a click of the button
	// 	if (this.timer) {
	// 		clearTimeout(this.timer);
	// 	}
	// 	this.props.dispatch(pleaseLogin({ status: false }));
	// }
	//
	// onPleaseLogin = () => {
	// 	// handles the modal popup that tells a user they need to login before
	// 	// they can download videoss
	// 	if (!this.props.pleaseLoginStatus) {
	// 		this.props.dispatch(pleaseLogin({ status: true }));
	// 	}
	// 	if (this.timer) {
	// 		clearTimeout(this.timer);
	// 	}
	// 	this.timer = setTimeout(() => {
	// 		if (this.props.pleaseLoginStatus) {
	// 			this.props.dispatch(pleaseLogin({ status: false }));
	// 		}
	// 	}, 4000);
	// }

	render() {
		const {
			activeOption,
			userAuthenticated,
			loginErrorMessage,
			signupErrorMessage,
			userId,
			socialLoginLink,
			activeDriver,
			errorMessageViewed,
			passwordResetMessage = 'You should receive an email shortly.',
		} = this.props.profile;
		const { toggleProfile } = this.props;
		const { popupOpen, popupCoords } = this.state;

		return (
			<GenericErrorBoundary affectedArea="Profile">
				<aside ref={this.setRef} className="profile">
					<header>
						<h1>Profile</h1>
						<SvgWrapper className={'icon'} svgid={'profile'} onClick={toggleProfile} />
						<SvgWrapper className={'icon'} svgid={'arrow_left'} onClick={toggleProfile} />
					</header>
					<div className="profile-content">
						{
							userAuthenticated ? (
								<AccountSettings
									logout={this.logout}
									deleteUser={this.deleteUser}
									updatePassword={this.updatePassword}
									profile={{ password: 'testing', email: 'jessehill108@gmail.com' }}
									userId={userId}
									updateEmail={this.updateEmail}
									updateUserInformation={this.updateUserInformation}
								/>
							) : (
								<React.Fragment>
									<div className="form-options">
										<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('login')} className={activeOption === 'login' ? 'login active' : 'login'}>LOGIN</span>
										<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('signup')} className={activeOption === 'signup' ? 'signup active' : 'signup'}>SIGN UP</span>
									</div>
									{
										activeOption === 'login' ? (
											<Login
												sendLoginForm={this.sendLoginForm}
												selectAccountOption={this.selectAccountOption}
												socialMediaLogin={this.socialMediaLogin}
												viewErrorMessage={this.viewErrorMessage}
												socialLoginLink={socialLoginLink}
												errorMessage={loginErrorMessage}
												activeDriver={activeDriver}
												errorMessageViewed={errorMessageViewed}
											/>
										) : null
									}
									{
										activeOption === 'signup' ? (
											<SignUp
												sendSignupForm={this.sendSignUpForm}
												socialMediaLogin={this.socialMediaLogin}
												viewErrorMessage={this.viewErrorMessage}
												errorMessage={signupErrorMessage}
												socialLoginLink={socialLoginLink}
												activeDriver={activeDriver}
												errorMessageViewed={errorMessageViewed}
											/>
										) : null
									}
									{
										activeOption === 'password_reset' ? (
											<PasswordReset popupCoords={popupCoords} popupOpen={popupOpen} message={passwordResetMessage} resetPassword={this.resetPassword} />
										) : null
									}
								</React.Fragment>
							)
						}
					</div>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

Profile.propTypes = {
	dispatch: PropTypes.func.isRequired,
	toggleProfile: PropTypes.func,
	profile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'profile', reducer });
const withSaga = injectSaga({ key: 'profile', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(Profile);
