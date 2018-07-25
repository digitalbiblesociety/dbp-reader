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
import PropTypes from 'prop-types';
// import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
// import 'sanitize.css/sanitize.css';
import fetch from 'isomorphic-fetch';
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
// import territoryCodes from '../app/utils/territoryCodes.json';
// import homeReducer from '../app/containers/HomePage/reducer';
// import textReducer from '../app/containers/TextSelection/reducer';
// import { fromJS } from 'immutable'
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

// const MOUNT_NODE = document.getElementById('app');

const AppContainer = (props) => {
	/*
		{
		// Minimum to render <Text />
			books,
			textDirection,
			activeChapter,
			text,
			loadingNewChapterText,
			loadingAudio,
			loadingCopyright,
			activeBookName,
			verseNumber,
		// Minimum to render <TextSelector />
			activeIsoCode,
			activeCountryName,
			activeLanguageName,
			loadingVersions,
			loadingLanguages,
			loadingCountries,
			countryLanguages,
			languages,
			countries,
			bibles,
		// Minimum to render <ChapterSelector />
			activeTextId,
			loadingBooks,
		}

	*/
	if (props.isServer) {
		const {
			books,
			textDirection,
			activeChapter,
			chapterText,
			activeBookName,
			verseNumber,
			activeTextId,
		} = props;
		// Create redux store with history
		const initialState = {
			homepage: {
				books,
				textDirection,
				activeChapter,
				chapterText: chapterText || [],
				loadingNewChapterText: false,
				loadingAudio: false,
				loadingCopyright: false,
				activeBookName,
				verseNumber,
				activeTextId,
				loadingBooks: false,
				note: {},
				userAuthenticated: false,
				userId: '',
				audioObjects: [],
				activeFilesets: [],
				audioFilesetId: '',
				plainTextFilesetId: '',
				formattedTextFilesetId: '',
				highlights: [],
				copyrights: {
					newTestament: {
						audio: {},
						text: {},
					},
					oldTestament: {
						audio: {},
						text: {},
					},
				},
				isChapterSelectionActive: false,
				isProfileActive: false,
				isSettingsModalActive: false,
				isSearchModalActive: false,
				isNotesModalActive: false,
				isVersionSelectionActive: false,
				isInformationModalActive: false,
				activeTextName: '',
				activeNotesView: 'notes',
				defaultLanguageIso: 'eng',
				defaultLanguageName: 'English',
				activeBookId: '',
				userSettings: {
					activeTheme: 'red',
					activeFontType: 'sans',
					activeFontSize: 42,
					toggleOptions: {
						readersMode: {
							name: "READER'S MODE",
							active: false,
							available: true,
						},
						crossReferences: {
							name: 'CROSS REFERENCE',
							active: true,
							available: true,
						},
						redLetter: {
							name: 'RED LETTER',
							active: true,
							available: true,
						},
						justifiedText: {
							name: 'JUSTIFIED TEXT',
							active: true,
							available: true,
						},
						oneVersePerLine: {
							name: 'ONE VERSE PER LINE',
							active: false,
							available: true,
						},
						verticalScrolling: {
							name: 'VERTICAL SCROLLING',
							active: false,
							available: false,
						},
					},
				},
				autoPlayEnabled: false,
				selectedText: '',
				selectedBookName: '',
				audioSource: '',
				invalidBibleId: false,
				hasAudio: false,
				formattedSource: '',
				hasTextInDatabase: true,
				filesetTypes: {},
				firstLoad: true,
				testaments: {},
				previousAudioPaths: [],
				previousAudioFilesetId: '',
				previousAudioSource: '',
				nextAudioPaths: [],
				nextAudioFilesetId: '',
				nextAudioSource: '',
				activeVerse: '',
				audioPaths: [],
				audioPlayerState: true,
			},
		};

		// console.log('all keys available in initialState', Object.keys(initialState));
		// console.log('props', props);

		// const history = createHistory();
		const store = configureStore({}, {}, initialState);

		return (
			<Provider store={store}>
				<LanguageProvider messages={translationMessages}>
					{/* <ConnectedRouter history={history}> */}
					<App appProps={props} />
					{/* </ConnectedRouter> */}
				</LanguageProvider>
			</Provider>
		);
	}

	// console.log('all keys available in initialState', Object.keys(initialState));
	// console.log('props', props);

	// const history = createHistory();
	const store = configureStore({}, {}, {});

	return (
		<Provider store={store}>
			<LanguageProvider messages={translationMessages}>
				{/* <ConnectedRouter history={history}> */}
				<App appProps={props} />
				{/* </ConnectedRouter> */}
			</LanguageProvider>
		</Provider>
	);
};

AppContainer.getInitialProps = async (context) => {
	const { bibleId, bookId, chapter, verse } = context.query;
	let isServer = false;

	if (!context.req) {
		// This is from the client
		// console.log('context.props in app on client', context.props);
		// console.log('context.query in app on client', context.query);
		// console.log('context.params in app on client', context.params);
		// console.log('context in homepage on client', context);
	}

	// The function is being run on the server so fetching data here will not conflict with the Sagas
	if (context.req) {
		isServer = true;
		// console.log('context.query in app on server', context.query);
		/* Urls that I need data from in order to render the first page */
		// const biblesUrl = `${process.env.BASE_API_ROUTE}/bibles?bucket=${
		// 	process.env.DBP_BUCKET_ID
		// }&key=${process.env.DBP_API_KEY}&v=4`;

		const singleBibleUrl = `${
			process.env.BASE_API_ROUTE
		}/bibles/${bibleId}?bucket=${process.env.DBP_BUCKET_ID}&key=${
			process.env.DBP_API_KEY
		}&v=4`;

		const textUrl = `${
			process.env.BASE_API_ROUTE
		}/bibles/filesets/${bibleId}/${bookId}/${chapter}?key=${
			process.env.DBP_API_KEY
		}&v=4`;
		// const countryUrl = `${process.env.BASE_API_ROUTE}/countries?key=${
		// 	process.env.DBP_API_KEY
		// 	}&v=4&bucket_id=${
		// 	process.env.DBP_BUCKET_ID
		// 	}&has_filesets=true&include_languages=true`
		// const languageUrl = `${process.env.BASE_API_ROUTE}/languages?key=${
		// 	process.env.DBP_API_KEY
		// 	}&v=4&bucket_id=${process.env.DBP_BUCKET_ID}&has_filesets=true`

		// Get country data
		// const countryRes = await fetch(countryUrl);
		// const countryJson = await countryRes.json();
		// // The app was used to ingesting the country data this way so I have to keep doing it
		// const countries = countryJson.data.reduce((acc, country) => {
		// 	const tempObj = acc;
		// 	if (typeof country.name !== 'string') {
		// 		tempObj[country.name.name] = { ...country, name: country.name.name };
		// 	} else if (country.name === '' || territoryCodes[country.codes.iso_a2]) {
		// 		return acc;
		// 	} else {
		// 		tempObj[country.name] = country;
		// 	}
		// 	return tempObj;
		// }, {});

		// Get languages data
		// const languageRes = await fetch(languageUrl);
		// const languageJson = await languageRes.json();
		// const languages = languageJson.data;

		// Get all bibles
		// const bibleRes = await fetch(biblesUrl);
		// const bibleJson = await bibleRes.json();
		// const texts = bibleJson.data;

		// Get active bible data
		const singleBibleRes = await fetch(singleBibleUrl);
		const singleBibleJson = await singleBibleRes.json();
		const bible = singleBibleJson.data;

		// Get text for chapter
		const textRes = await fetch(textUrl);
		const textJson = await textRes.json();
		const chapterText = textJson.data;
		// console.log('chapterText', chapterText);
		// Need to try the other bible id if there wasn't any chapter text
		if (!chapterText) {
			// next id
		}

		const activeBook = bible.books.find(
			(book) => book.book_id.toLowerCase() === bookId.toLowerCase(),
		);
		// console.log('activeBook', activeBook);
		// console.log('bible.books', bible.books);

		const activeBookName = activeBook ? activeBook.name : '';

		return {
			isServer,
			chapterText,
			books: bible.books,
			activeChapter: parseInt(chapter, 10),
			activeBookName,
			verseNumber: verse,
			activeTextId: bible.abbr,
			activeIsoCode: bible.iso,
			activeLanguageName: bible.language,
			textDirection: bible.alphabet.direction,
			// texts,
			match: {
				params: {
					bibleId,
					bookId,
					chapter,
					verse,
				},
			},
		};
	}
	// May want to consider also fetching a certain amount of data for when this is run on the client
	// const res = await fetch(`${process.env.BASE_API_ROUTE}/bibles/${bibleId}?bucket=${
	// 	process.env.DBP_BUCKET_ID
	// 	}&key=${process.env.DBP_API_KEY}&v=4`)
	// const bibleJson = await res.json()
	// const bible = bibleJson.data

	return {
		isServer,
		match: {
			params: {
				bibleId,
				bookId,
				chapter,
				verse,
			},
		},
	};
};

AppContainer.propTypes = {
	books: PropTypes.array,
	isServer: PropTypes.bool,
	textDirection: PropTypes.string,
	activeChapter: PropTypes.number,
	chapterText: PropTypes.array,
	activeBookName: PropTypes.string,
	verseNumber: PropTypes.string,
	activeTextId: PropTypes.string,
	// activeIsoCode: PropTypes.string,
	// activeCountryName: PropTypes.string,
	// activeLanguageName: PropTypes.string,
	// countryLanguages: PropTypes.array,
	// languages: PropTypes.array,
	// countries: PropTypes.object,
	// texts: PropTypes.array,
};

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
