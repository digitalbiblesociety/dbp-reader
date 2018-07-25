/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
// import { Switch, Route } from 'react-router-dom';

import HomePage from '../HomePage';
// import AboutPage from '../AboutPage/Loadable';
// import NotFoundPage from '../NotFoundPage/Loadable';
// import PrivacyPolicy from '../../components/PrivacyPolicy';
// import TermsAndConditions from '../../components/TermsAndConditions';
// Need to either redirect from / or add the necessary params so that the first page loads correctly
// 			{/* <Switch> */}
// 			{/* <Route exact path="/" component={HomePage} /> */}
// 			{/* <Route exact path="/about" component={AboutPage} /> */}
// 			{/* <Route exact path="/404" component={NotFoundPage} /> */}
// 			{/* <Route exact path="/privacy-policy" component={PrivacyPolicy} /> */}
// 			{/* <Route exact path="/terms-of-use" component={TermsAndConditions} /> */}
// 			{/* <Route exact path="/reset/password/:token" component={HomePage} /> */}
// 			{/* <Route */}
// 			{/* exact */}
// 			{/* path="/:bibleId?/:bookId?/:chapter?/:verse?" */}
// 			{/* component={HomePage} */}
// 			{/* /> */}
// 			{/* <Route component={NotFoundPage} /> */}
// 			{/* </Switch> */}
export default function App({ appProps }) {
	return (
		<div>
			<HomePage match={appProps.match} />
		</div>
	);
}

App.propTypes = {
	appProps: PropTypes.object,
};
