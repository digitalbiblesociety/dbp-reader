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
 * TODO: It is possible that we will want to change how react-router reconciles
 * the urls so that the component will not be re-mounted when the bookid or
 * bibleid are changed
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import AboutPage from 'containers/AboutPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import PrivacyPolicy from 'components/PrivacyPolicy';
import TermsAndConditions from 'components/TermsAndConditions';
// Need to either redirect from / or add the necessary params so that the first page loads correctly
export default function App() {
	return (
		<div>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/:bibleId/:bookId/:chapter" component={HomePage} />
				<Route exact path="/about" component={AboutPage} />
				<Route exact path="/privacy-policy" component={PrivacyPolicy} />
				<Route exact path="/terms-of-use" component={TermsAndConditions} />
				<Route component={NotFoundPage} />
			</Switch>
		</div>
	);
}
