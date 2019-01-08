/**
 *
 * AboutPage
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
// import { FormattedMessage } from 'react-intl';
// import { compose } from 'redux';

// import messages from '../app/containers/AboutPage/messages';

function AboutPage() {
	return (
		<div>
			<Helmet>
				<title>About Page</title>
				<meta name="description" content="About the Koinos App" />
			</Helmet>

			<div className="nav-holder">
				<div className="top-nav">
					<h1 className="mobile-title">About Bible.is</h1>
				</div>
			</div>

			<div className="page-container">
				<h1 className="intro">About Bible.is</h1>
				<h3 className="normal center">
					Bringing the Bible to everyone in the world in their heart language,
					in text and audio, free of charge.
				</h3>
				<div>
					<h3>Four Years, 32 Million People.</h3>

					<p>
						Launched for the iPhone in June of 2010 with just 218 languages,
						Bible.is now features 1,800+ languages and is available on the web
						and for both iOS and Android devices. Originally only functional in
						English, the app is now fully localized for a growing number of
						languages including Arabic, Mandarin, Cantonese, Portuguese, French,
						Spanish, Dutch, Italian, and Russian.
					</p>

					<p>
						<strong>Faith Comes By Hearing</strong>
						<br />
						For more than 40 years, the ministry of&nbsp;
						<a href="http://faithcomesbyhearing.com" target="_blank">
							Faith Comes By Hearing
						</a>
						&nbsp; has been standing with poor and illiterate people of the
						world to provide them the promises of salvation, hope and comfort in
						the Word of God. From online technologies like Bible.is, to
						solar-powered audio Bibles, Faith Comes By Hearing continues to
						innovate and invite people to hear God&#39;s Word for themselves.
					</p>
				</div>

				<div className="clear" />
			</div>
			<div id="footer">
				<div id="footer-left">
					<ul className="footer-links">
						<li>
							<a href="/about">About</a>
						</li>
						<li>
							<a href="/terms">Terms &amp; Conditions</a>
						</li>
						<li>
							<a href="/privacy">Privacy Policy</a>
						</li>
					</ul>

					<p>
						&copy; Bible.is, a ministry of
						<a href="http://www.faithcomesbyhearing.com/" target="_blank">
							Faith Comes By Hearing
						</a>
					</p>
				</div>
			</div>
		</div>
	);
}

AboutPage.propTypes = {
	// dispatch: PropTypes.func.isRequired,
};

// function mapDispatchToProps(dispatch) {
// 	return {
// 		dispatch,
// 	};
// }
//
// const withConnect = connect(
// 	null,
// 	mapDispatchToProps,
// );

export default AboutPage;
