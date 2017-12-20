/**
 *
 * Profile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import menu from 'images/menu.svg';
import SvgWrapper from 'components/SvgWrapper';
import makeSelectProfile from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

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
				<div className="form-options">
					<h1 className="login">LOGIN</h1>
					<h1 className="signup">SIGN UP</h1>
				</div>
				<section className="message">
					<p>Signing up lets you create Bookmarks, Highlights and Notes, and access them wherever you use Bible.is!</p>
				</section>
				<input className="email" placeholder="Enter your email" />
				<input className="first-password" placeholder="Enter a password" />
				<input className="second-password" placeholder="Re-enter your password" />
				<div className="sign-up-button"><span className="text">SIGN UP</span></div>
				<div className="google">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="google_plus" />
					Sign up with Google
				</div>
				<div className="facebook">
					<SvgWrapper className="svg" height="30px" width="30px" fill="#fff" svgid="facebook" />
					Sign up with Facebook
				</div>
				<section className="disclaimer">
					By creating an account, you agree to the Bible.is
					<Link className="link" to="/privacy-policy"> Privacy Policy </Link> &
					<Link className="link" to="/terms-of-use"> Terms of Use</Link>.
				</section>
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
