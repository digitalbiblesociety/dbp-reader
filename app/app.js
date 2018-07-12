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
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
// import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-72x72.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-76x76.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-114x114.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-120x120.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-152x152.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/apple-icon-180x180.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/android-icon-192x192.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/ms-icon-144x144.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/favicon-32x32.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/favicon-96x96.png';
import '!file-loader?name=[name].[ext]!./images/app-icons/favicon-16x16.png';
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';

/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Import CSS reset and Global Styles
import './styles/app.scss';

// Create redux store with history
const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = (messages) => {
	ReactDOM.render(
		<Provider store={store}>
			<LanguageProvider messages={messages}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</LanguageProvider>
		</Provider>,
		MOUNT_NODE,
	);
};

if (module.hot) {
	// Hot reloadable React components and translation json files
	// modules.hot.accept does not accept dynamic dependencies,
	// have to be constants at compile-time
	module.hot.accept(['./i18n', 'containers/App'], () => {
		ReactDOM.unmountComponentAtNode(MOUNT_NODE);
		render(translationMessages);
	});
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
	new Promise((resolve) => {
		resolve(import('intl'));
	})
		.then(() =>
			Promise.all([
				import('intl/locale-data/jsonp/en.js'),
				import('intl/locale-data/jsonp/th.js'),
				import('intl/locale-data/jsonp/ru.js'),
				import('intl/locale-data/jsonp/es.js'),
			]),
		)
		.then(() => render(translationMessages))
		.catch((err) => {
			throw err;
		});
} else {
	render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
	require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
