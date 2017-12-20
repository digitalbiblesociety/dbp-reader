/**
 *
 * Profile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import menu from 'images/menu.svg';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export class Profile extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const { toggleProfile } = this.props;
		return (
			<aside className="profile">
				<header>
					<h2>ACCOUNT</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleProfile}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<div>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</div>
				<input className="email" />
				<input className="first-password" />
				<input className="second-password" />
				<div className="sign-up-button">SIGN UP</div>
				<div className="google">Sign up with google</div>
				<div className="facebook">Sign up with facebook</div>
				<div className="disclaimer">By creating an account, you agree to the Bible.is<a>Privacy Policy</a>&<a>Terms of Use</a>.</div>
				<FormattedMessage {...messages.header} />
			</aside>
		);
	}
}

Profile.propTypes = {
	toggleProfile: PropTypes.func,
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
