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
// import { fromJS } from 'immutable';
import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
// import 'sanitize.css/sanitize.css';
// import fetch from 'isomorphic-fetch';
import Head from 'next/head';
import cachedFetch, { overrideCache } from '../app/utils/cachedFetch';
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

class AppContainer extends React.Component {
	componentDidMount() {
		if (this.props.isFromServer) {
			this.props.fetchedUrls.forEach((url) => {
				overrideCache(url.href, url.data);
			});
		}
		/* eslint-disable no-underscore-dangle */
		if (this.reduxStore && !window.__NEXT_REDUX_STORE__) {
			window.__NEXT_REDUX_STORE__ = this.reduxStore;
		}
		/* eslint-enable no-underscore-dangle */
	}

	// componentWillReceiveProps(nextProps) {
	// 	if (nextProps.match.params.verse !== this.props.match.params.verse) {
	// 		console.log('nextProps.match.params.verse', nextProps.match.params.verse);
	// 		console.log('this.props.match.params.verse', this.props.match.params.verse);
	// 	}
	// }
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
	render() {
		const {
			books,
			textDirection,
			activeChapter,
			chapterText,
			activeBookName,
			activeBookId,
			verseNumber,
			testaments,
			filesets,
			activeTextId,
			activeTextName,
			defaultLanguageName,
			defaultLanguageIso,
			userId,
			isAuthenticated,
			userProfile,
			isFromServer,
		} = this.props;
		// Create redux store with history
		// Probably need to figure out a way to persist this after it is loaded for the first time
		// If from server then create a new store
		// If from client then use the old store
		const initialState = {
			homepage: {
				userProfile,
				books,
				textDirection,
				activeTextName,
				activeChapter,
				activeBookName,
				verseNumber,
				activeTextId,
				defaultLanguageName,
				defaultLanguageIso,
				activeBookId,
				testaments,
				userId,
				activeFilesets: filesets,
				userAuthenticated: isAuthenticated,
				chapterText: chapterText || [],
				loadingNewChapterText: false,
				loadingAudio: false,
				loadingCopyright: false,
				loadingBooks: false,
				note: {},
				audioObjects: [],
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
				activeNotesView: 'notes',
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
			profile: {
				activeOption: 'login',
				userAuthenticated: isAuthenticated,
				userId,
				loginErrorMessage: '',
				socialLoginLink: '',
				signupErrorMessage: '',
				activeDriver: '',
				userProfile: {
					...userProfile,
					verified: false,
					accounts: [],
				},
				errorMessageViewed: true,
				passwordResetError: '',
				passwordResetMessage: '',
				deleteUserError: false,
				deleteUserMessage: '',
			},
		};

		let store;

		if (isFromServer) {
			store = configureStore({}, {}, initialState);
			this.reduxStore = store;
		} else {
			// console.log('Was not from server');
			/* eslint-disable no-underscore-dangle */
			if (!window.__NEXT_REDUX_STORE__) {
				window.__NEXT_REDUX_STORE__ = configureStore({}, {}, initialState);
			}

			store = window.__NEXT_REDUX_STORE__;
			/* eslint-enable no-underscore-dangle */
		}

		return (
			<Provider store={store}>
				<LanguageProvider messages={translationMessages}>
					<div>
						<Head>
							<meta
								name={'description'}
								content={chapterText.map((v) => v.verse_text).join(' ')}
							/>
							<meta
								property={'og:title'}
								content={`${activeBookName} ${activeChapter}${
									this.props.match.params.verse
										? `:${this.props.match.params.verse}`
										: ''
								}`}
							/>
							<meta property={'og:url'} content="contextLocation" />
							<meta
								property={'og:description'}
								content={chapterText.map((v) => v.verse_text).join(' ')}
							/>
							<meta property={'og:type'} content={'website'} />
							<meta property={'og:site_name'} content={'Bible.is'} />
							<meta
								property={'og:image'}
								content={'/static/apple-icon-180x180.png'}
							/>
							<title>
								{`${activeBookName} ${activeChapter}${
									this.props.match.params.verse
										? `:${this.props.match.params.verse}`
										: ''
								}`}{' '}
								| Bible.is
							</title>
						</Head>
						<App appProps={this.props} />
					</div>
				</LanguageProvider>
			</Provider>
		);
	}
}

AppContainer.getInitialProps = async (context) => {
	const { bibleId, bookId, chapter, verse, token } = context.query;
	let isFromServer = true;
	const userProfile = {};
	let userId = '';
	let isAuthenticated = false;

	if (!context.req) {
		isFromServer = false;
		// console.log('from client with query', context.query);

		// This is from the client so local and session storage should be available now
		userId =
			localStorage.getItem('bible_is_user_id') ||
			sessionStorage.getItem('bible_is_user_id');
		isAuthenticated = !!(
			localStorage.getItem('bible_is_user_id') ||
			sessionStorage.getItem('bible_is_user_id')
		);
		userProfile.email = sessionStorage.getItem('bible_is_12345');
		userProfile.nickname = sessionStorage.getItem('bible_is_123456');
		userProfile.name = sessionStorage.getItem('bible_is_1234567');
		userProfile.avatar = sessionStorage.getItem('bible_is_12345678');
	}

	// The function is being run on the server so fetching data here will not conflict with the Sagas

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

	const bookMetaDataUrl = `${
		process.env.BASE_API_ROUTE
	}/bibles/${bibleId}/book?key=${process.env.DBP_API_KEY}&v=4&iso=eng&bucket=${
		process.env.DBP_BUCKET_ID
	}`;

	// Get all bibles
	// const bibleRes = await fetch(biblesUrl);
	// const bibleJson = await bibleRes.json();
	// const texts = bibleJson.data;

	// Get active bible data
	const singleBibleRes = await cachedFetch(singleBibleUrl);
	const singleBibleJson = singleBibleRes;
	const bible = singleBibleJson.data;

	// Get text for chapter
	const textRes = await cachedFetch(textUrl);
	const textJson = textRes;
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

	const bookMetaRes = await cachedFetch(bookMetaDataUrl);
	const bookMetaJson = bookMetaRes;
	// console.log('bookMetaJson', bookMetaJson);

	const testaments = bookMetaJson.data.reduce(
		(a, c) => ({ ...a, [c.id]: c.book_testament }),
		{},
	);

	return {
		// isServer,
		chapterText,
		testaments,
		books: bible.books,
		activeChapter: parseInt(chapter, 10),
		activeBookName,
		verseNumber: verse,
		activeTextId: bible.abbr,
		activeIsoCode: bible.iso,
		activeLanguageName: bible.language,
		textDirection: bible.alphabet.direction,
		filesets: bible.filesets['dbp-dev'],
		defaultLanguageIso: bible.iso || 'eng',
		defaultLanguageName: bible.language || 'English',
		activeTextName: bible.vname || bible.name,
		activeBookId: bookId.toUpperCase(),
		userProfile,
		userId: userId || '',
		isAuthenticated: isAuthenticated || false,
		isFromServer,
		match: {
			params: {
				bibleId,
				bookId,
				chapter,
				verse,
				token,
			},
		},
		fetchedUrls: [
			{ href: bookMetaDataUrl, data: bookMetaJson },
			{ href: singleBibleUrl, data: singleBibleJson },
			{ href: textUrl, data: textJson },
		],
	};
};

AppContainer.propTypes = {
	books: PropTypes.array,
	isFromServer: PropTypes.bool,
	filesets: PropTypes.array,
	testaments: PropTypes.object,
	textDirection: PropTypes.string,
	activeChapter: PropTypes.number,
	chapterText: PropTypes.array,
	activeBookName: PropTypes.string,
	verseNumber: PropTypes.string,
	activeTextId: PropTypes.string,
	activeTextName: PropTypes.string,
	activeBookId: PropTypes.string,
	defaultLanguageIso: PropTypes.string,
	defaultLanguageName: PropTypes.string,
	match: PropTypes.object,
	userId: PropTypes.string,
	isAuthenticated: PropTypes.bool,
	userProfile: PropTypes.object,
	fetchedUrls: PropTypes.array,
	// activeIsoCode: PropTypes.string,
	// activeCountryName: PropTypes.string,
	// activeLanguageName: PropTypes.string,
	// countryLanguages: PropTypes.array,
	// languages: PropTypes.array,
	// countries: PropTypes.object,
	// texts: PropTypes.array,
};

export default AppContainer;
