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
import { selectAccountOption, toggleSignInForm } from './actions';
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

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleProfile();
		}
	}

	selectAccountOption = (option) => this.props.dispatch(selectAccountOption(option))
	toggleSignInForm = (state) => this.props.dispatch(toggleSignInForm(state))

	render() {
		const { activeOption, signInActive, userAuthenticated } = this.props.profile;
		const { toggleProfile } = this.props;
		return (
			<aside ref={this.setRef} className="profile">
				<header>
					<h2>ACCOUNT</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleProfile}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				{
					userAuthenticated ? (
						<AccountSettings />
					) : (
						<React.Fragment>
							<div className="form-options">
								<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('login')} className={activeOption === 'login' ? 'login active' : 'login'}>LOGIN</span>
								<span role="button" tabIndex={0} onClick={() => this.selectAccountOption('signup')} className={activeOption === 'signup' ? 'signup active' : 'signup'}>SIGN UP</span>
							</div>
							{
								activeOption === 'login' ? (
									<Login
										signInActive={signInActive}
										toggleSignInForm={this.toggleSignInForm}
										selectAccountOption={this.selectAccountOption}
									/>
								) : null
							}
							{
								activeOption === 'signup' ? (
									<SignUp />
								) : null
							}
							{
								activeOption === 'password_reset' ? (
									<PasswordReset />
								) : null
							}
						</React.Fragment>
					)
				}
			</aside>
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
