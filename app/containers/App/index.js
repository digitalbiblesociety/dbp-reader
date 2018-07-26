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

// Can probably just remove this component altogether as it is just a wrapper
import React from 'react';
import PropTypes from 'prop-types';
import HomePage from '../HomePage';

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
