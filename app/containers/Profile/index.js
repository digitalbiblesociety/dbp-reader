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
import menu from 'images/menu.svg';
import SignUp from 'components/SignUp';
import Login from 'components/Login';
import PasswordReset from 'components/PasswordReset';
import AccountSettings from 'components/AccountSettings';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
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
} from './actions';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class Profile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setRef = (node) => {
		this.ref = node;
	}

	getUserData = (userId) => this.props.dispatch(getUserData(userId))

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight) && !this.ref.contains(event.target)) {
			this.props.toggleProfile();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	sendSignUpForm = (props) => this.props.dispatch(sendSignUpForm(props))
	socialMediaLogin = (props) => this.props.dispatch(socialMediaLogin(props))
	resetPassword = (props) => this.props.dispatch(resetPassword(props))
	deleteUser = (props) => this.props.dispatch(deleteUser(props))
	sendLoginForm = (props) => this.props.dispatch(sendLoginForm(props))
	selectAccountOption = (option) => this.props.dispatch(selectAccountOption(option))
	updatePassword = (props) => this.props.dispatch(updatePassword(props))
	updateEmail = (props) => this.props.dispatch(updateEmail(props))
	updateUserInformation = (props) => this.props.dispatch(updateUserInformation(props))
	logout = () => this.props.dispatch(logout())

	render() {
		const {
			activeOption,
			userAuthenticated,
			loginErrorMessage,
			signupErrorMessage,
			userId,
			socialLoginLink,
			activeDriver,
		} = this.props.profile;
		const { toggleProfile } = this.props;

		return (
			<GenericErrorBoundary affectedArea="Profile">
				<aside ref={this.setRef} className="profile">
					<header>
						<h2>ACCOUNT</h2>
						<span role="button" tabIndex={0} className="close-icon" onClick={toggleProfile}>
							<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
						</span>
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
												socialLoginLink={socialLoginLink}
												errorMessage={loginErrorMessage}
												activeDriver={activeDriver}
											/>
										) : null
									}
									{
										activeOption === 'signup' ? (
											<SignUp
												sendSignupForm={this.sendSignUpForm}
												socialMediaLogin={this.socialMediaLogin}
												errorMessage={signupErrorMessage}
												socialLoginLink={socialLoginLink}
												activeDriver={activeDriver}
											/>
										) : null
									}
									{
										activeOption === 'password_reset' ? (
											<PasswordReset resetPassword={this.resetPassword} />
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
