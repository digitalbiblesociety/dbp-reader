/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
// import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
// import 'sanitize.css/sanitize.css';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
// import '../static/apple-icon-72x72.png';
// import '../static/apple-icon-76x76.png';
// import '../static/apple-icon-114x114.png';
// import '../static/apple-icon-120x120.png';
// import '../static/apple-icon-144x144.png';
// import '../static/apple-icon-152x152.png';
// import '../static/apple-icon-180x180.png';
// import '../static/android-icon-192x192.png';
// import '../static/ms-icon-144x144.png';
// import '../static/favicon-32x32.png';
// import '../static/favicon-96x96.png';
// import '../static/favicon-16x16.png';
// import '../static/favicon.ico';
// import '../static/manifest.json';
// import '../static/.htaccess';

/* eslint-enable import/no-unresolved, import/extensions */
// Import Language Provider
import LanguageProvider from '../app/containers/LanguageProvider';

// Import root app
import App from '../app/containers/App/index';

import configureStore from '../app/configureStore';

// Import i18n messages
import { translationMessages } from '../app/i18n';

// Import CSS reset and Global Styles
import '../static/app.scss';
// import '../app/styles/variables.scss';
// import '../app/styles/global.scss';
// import '../app/styles/components/navbar.scss';

// Create redux store with history
const initialState = {};
// const history = createHistory();
const store = configureStore(initialState);
// const MOUNT_NODE = document.getElementById('app');

const AppContainer = () => (
	<Provider store={store}>
		<LanguageProvider messages={translationMessages}>
			{/* <ConnectedRouter history={history}> */}
			<App />
			{/* </ConnectedRouter> */}
		</LanguageProvider>
	</Provider>
);

export default AppContainer;

// if (module.hot) {
// 	// Hot reloadable React components and translation json files
// 	// modules.hot.accept does not accept dynamic dependencies,
// 	// have to be constants at compile-time
// 	module.hot.accept(['./i18n', 'containers/App'], () => {
// 		ReactDOM.unmountComponentAtNode(MOUNT_NODE);
// 		render(translationMessages);
// 	});
// }
// Todo: Figure out how to do intl with nextjs
// // Chunked polyfill for browsers without Intl support
// if (!window.Intl) {
// 	new Promise((resolve) => {
// 		resolve(import('intl'));
// 	})
// 		.then(() =>
// 			Promise.all([
// 				import('intl/locale-data/jsonp/en.js'),
// 				import('intl/locale-data/jsonp/th.js'),
// 				import('intl/locale-data/jsonp/ru.js'),
// 				import('intl/locale-data/jsonp/es.js'),
// 			]),
// 		)
// 		.then(() => render(translationMessages))
// 		.catch((err) => {
// 			throw err;
// 		});
// } else {
// 	render(translationMessages);
// }
//
// // Install ServiceWorker and AppCache in the end since
// // it's not most important operation and if main code fails,
// // we do not want it installed
if (process.env.NODE_ENV === 'production') {
	require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
