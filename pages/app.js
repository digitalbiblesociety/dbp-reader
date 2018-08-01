/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import dynamic from 'next/dynamic';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
// import fetch from 'isomorphic-fetch';
import Head from 'next/head';
import cachedFetch, { overrideCache } from '../app/utils/cachedFetch';
// import fetch from 'isomorphic-fetch';
// import LanguageProvider from '../app/containers/LanguageProvider';
// import { translationMessages } from '../app/i18n';
// import App from '../app/containers/App/index';
import HomePage from '../app/containers/HomePage';
// import configureStore from '../app/configureStore';
import getinitialChapterData from '../app/utils/getInitialChapterData';

// Import CSS reset and Global Styles
import '../static/app.scss';
// Need to figure out how to get the site to load this file from any url
import '../static/manifest.json';

class AppContainer extends React.Component {
	componentDidMount() {
		if (this.props.isFromServer) {
			// console.log('Using cached url');
			// console.log('this.props.fetchedUrls', this.props.fetchedUrls);
			this.props.fetchedUrls.forEach((url) => {
				overrideCache(url.href, url.data);
			});
		}
		// After launch see if I can get Reactotron working with SSR and redux
		// Todo: Set up a function to init all of the plugins that rely on the browser
		// if (process.env.NODE_ENV !== 'production') {
		// 	const Reactotron = async () => {
		// 		const r = await import('reactotron-react-js');
		// 		const redux = await import('reactotron-redux');
		// 		const sauce = await import('reactotron-apisauce');
		// 		const saga = await import('reactotron-redux-saga');
		// 		// const track = await import('reactotron-react.js');
		//
		// 		console.log('r', r);
		// 		console.log('redux', redux);
		// 		console.log('sauce', sauce);
		// 		console.log('saga', saga);
		//
		// 		// console.log('track', track);
		//
		// 		return { reactotron: r.default, redux: redux.reactotronRedux, sauce, saga, track: r.trackGlobalErrors };
		// 	}
		// 	// console.log('Reactotron', Reactotron)
		// 	Reactotron().then(({ reactotron, redux, sauce, saga, track }) => {
		// 		// console.log('in promise r', r.default);
		// 		// console.log('Object.Keys(r.default', Object.keys(r.default));
		// 		reactotron
		// 			.configure({ name: 'Bible.is', secure: false })
		// 			.use(sauce())
		// 			.use(redux())
		// 			.use(track())
		// 			.use(saga())
		// 			.connect();
		//
		// 		console.tron = reactotron;
		// 	});
		// }
		/* eslint-disable no-underscore-dangle */
		// if (this.reduxStore && !window.__NEXT_REDUX_STORE__) {
		// 	window.__NEXT_REDUX_STORE__ = this.reduxStore;
		// }
		/* eslint-enable no-underscore-dangle */
		// console.log('this.props.dispatch in didMount', this.props.dispatch);
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
			// books,
			// textDirection,
			activeChapter,
			chapterText,
			// formattedText,
			activeBookName,
			// activeBookId,
			// verseNumber,
			// testaments,
			// filesets,
			// activeTextId,
			// activeTextName,
			// defaultLanguageName,
			// defaultLanguageIso,
			// userId,
			// isAuthenticated,
			// userProfile,
			// match,
			// isFromServer,
		} = this.props;
		// console.log('this.props.dispatch in render', this.props);

		// Create redux store with history
		// Probably need to figure out a way to persist this after it is loaded for the first time
		// If from server then create a new store
		// If from client then use the old store
		// const initialState = {
		// 	homepage: {
		// 		userProfile,
		// 		books,
		// 		match,
		// 		textDirection,
		// 		activeTextName,
		// 		isFromServer,
		// 		activeChapter,
		// 		activeBookName,
		// 		verseNumber,
		// 		activeTextId,
		// 		defaultLanguageName,
		// 		defaultLanguageIso,
		// 		activeBookId,
		// 		testaments,
		// 		userId,
		// 		formattedSource: formattedText || '',
		// 		activeFilesets: filesets,
		// 		userAuthenticated: isAuthenticated,
		// 		chapterText: chapterText || [],
		// 		loadingNewChapterText: false,
		// 		loadingAudio: false,
		// 		loadingCopyright: false,
		// 		loadingBooks: false,
		// 		note: {},
		// 		audioObjects: [],
		// 		audioFilesetId: '',
		// 		plainTextFilesetId: '',
		// 		formattedTextFilesetId: '',
		// 		highlights: [],
		// 		copyrights: {
		// 			newTestament: {
		// 				audio: {},
		// 				text: {},
		// 			},
		// 			oldTestament: {
		// 				audio: {},
		// 				text: {},
		// 			},
		// 		},
		// 		isChapterSelectionActive: false,
		// 		isProfileActive: false,
		// 		isSettingsModalActive: false,
		// 		isSearchModalActive: false,
		// 		isNotesModalActive: false,
		// 		isVersionSelectionActive: false,
		// 		isInformationModalActive: false,
		// 		activeNotesView: 'notes',
		// 		userSettings: {
		// 			activeTheme: 'red',
		// 			activeFontType: 'sans',
		// 			activeFontSize: 42,
		// 			toggleOptions: {
		// 				readersMode: {
		// 					name: "READER'S MODE",
		// 					active: false,
		// 					available: true,
		// 				},
		// 				crossReferences: {
		// 					name: 'CROSS REFERENCE',
		// 					active: true,
		// 					available: true,
		// 				},
		// 				redLetter: {
		// 					name: 'RED LETTER',
		// 					active: true,
		// 					available: true,
		// 				},
		// 				justifiedText: {
		// 					name: 'JUSTIFIED TEXT',
		// 					active: true,
		// 					available: true,
		// 				},
		// 				oneVersePerLine: {
		// 					name: 'ONE VERSE PER LINE',
		// 					active: false,
		// 					available: true,
		// 				},
		// 				verticalScrolling: {
		// 					name: 'VERTICAL SCROLLING',
		// 					active: false,
		// 					available: false,
		// 				},
		// 			},
		// 		},
		// 		autoPlayEnabled: false,
		// 		selectedText: '',
		// 		selectedBookName: '',
		// 		audioSource: '',
		// 		invalidBibleId: false,
		// 		hasAudio: false,
		// 		hasTextInDatabase: true,
		// 		filesetTypes: {},
		// 		firstLoad: true,
		// 		previousAudioPaths: [],
		// 		previousAudioFilesetId: '',
		// 		previousAudioSource: '',
		// 		nextAudioPaths: [],
		// 		nextAudioFilesetId: '',
		// 		nextAudioSource: '',
		// 		activeVerse: '',
		// 		audioPaths: [],
		// 		audioPlayerState: true,
		// 	},
		// 	profile: {
		// 		activeOption: 'login',
		// 		userAuthenticated: isAuthenticated,
		// 		userId,
		// 		loginErrorMessage: '',
		// 		socialLoginLink: '',
		// 		signupErrorMessage: '',
		// 		activeDriver: '',
		// 		userProfile: {
		// 			...userProfile,
		// 			verified: false,
		// 			accounts: [],
		// 		},
		// 		errorMessageViewed: true,
		// 		passwordResetError: '',
		// 		passwordResetMessage: '',
		// 		deleteUserError: false,
		// 		deleteUserMessage: '',
		// 	},
		// };
		// let store;
		//
		// if (isFromServer) {
		// 	store = configureStore({}, {}, initialState);
		// 	this.reduxStore = store;
		// } else {
		// 	// console.log('Was not from server');
		// 	/* eslint-disable no-underscore-dangle */
		// 	if (!window.__NEXT_REDUX_STORE__) {
		// 		window.__NEXT_REDUX_STORE__ = configureStore({}, {}, initialState);
		// 	}
		//
		// 	store = window.__NEXT_REDUX_STORE__;
		// 	/* eslint-enable no-underscore-dangle */
		// }

		return (
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
				<HomePage />
			</div>
		);
	}
}

AppContainer.getInitialProps = async (context) => {
	// console.log('context.reduxStore.getState()', context.reduxStore.getState());

	const { bibleId, bookId, chapter, verse, token } = context.query;
	let isFromServer = true;
	const userProfile = {};
	let userId = '';
	let isAuthenticated = false;
	// console.log('context.isVirtualCall', context.isVirtualCall);
	// console.log('context.pathname', context.pathname);

	if (!context.req) {
		// console.log('context in browser', context);
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

	// console.log('bible.name', bible.name);
	// console.log('bible.abbr', bible.abbr);
	let textData = { plainText: [], formattedText: '', plainTextJson: {} };
	try {
		// console.log('Before init func');
		textData = await getinitialChapterData({
			filesets: bible.filesets['dbp-dev'],
			bookId,
			chapter,
		}).catch((err) => {
			if (process.env.NODE_ENV === 'development') {
				console.error(`Error caught in get initial: ${err.message}`); // eslint-disable-line no-console
			}
			return { formattedText: '', plainText: [] };
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(`Error caught in get initial by try catch: ${err.message}`); // eslint-disable-line no-console
		}
	}
	// console.log('After init func', Object.keys(textData));
	// todo: replace with getInintChaptData utility function
	// Get text for chapter
	// const textRes = await fetch(textUrl);
	const textJson = textData.plainTextJson;
	const chapterText = textData.plainText;
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

	context.reduxStore.replaceReducer((state, action) => {
		if (action.type === 'GET_INITIAL_ROUTE_STATE_APP') {
			// console.log('Merging the state with the state from initial props', state);
			// console.log('state.get homepage', state.get('homepage'))
			return state
				.set('homepage', state.get('homepage').merge(action.homepage))
				.set('profile', state.get('profile').merge(action.profile));
		}
		return state;
	});

	context.reduxStore.dispatch({
		type: 'GET_INITIAL_ROUTE_STATE_APP',
		homepage: {
			userProfile,
			chapterText,
			testaments,
			formattedSource: textData.formattedText,
			activeFilesets: bible.filesets['dbp-dev'],
			books: bible.books,
			activeChapter: parseInt(chapter, 10),
			activeBookName,
			verseNumber: verse,
			activeTextId: bible.abbr,
			activeIsoCode: bible.iso,
			activeLanguageName: bible.language,
			textDirection: bible.alphabet.direction,
			defaultLanguageIso: bible.iso || 'eng',
			defaultLanguageName: bible.language || 'English',
			activeTextName: bible.vname || bible.name,
			activeBookId: bookId.toUpperCase(),
			userId,
			userAuthenticated: isAuthenticated || false,
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
		},
		profile: {
			userId: userId || '',
			userAuthenticated: isAuthenticated || false,
			userProfile: {
				...userProfile,
				verified: false,
				accounts: [],
			},
		},
	});

	return {
		// isServer,
		chapterText,
		testaments,
		formattedText: textData.formattedText,
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
	isFromServer: PropTypes.bool,
	activeChapter: PropTypes.number,
	chapterText: PropTypes.array,
	activeBookName: PropTypes.string,
	match: PropTypes.object,
	fetchedUrls: PropTypes.array,
	// books: PropTypes.array,
	// filesets: PropTypes.array,
	// testaments: PropTypes.object,
	// textDirection: PropTypes.string,
	// verseNumber: PropTypes.string,
	// activeTextId: PropTypes.string,
	// activeTextName: PropTypes.string,
	// activeBookId: PropTypes.string,
	// defaultLanguageIso: PropTypes.string,
	// defaultLanguageName: PropTypes.string,
	// formattedText: PropTypes.string,
	// userId: PropTypes.string,
	// isAuthenticated: PropTypes.bool,
	// userProfile: PropTypes.object,
	// activeIsoCode: PropTypes.string,
	// activeCountryName: PropTypes.string,
	// activeLanguageName: PropTypes.string,
	// countryLanguages: PropTypes.array,
	// languages: PropTypes.array,
	// countries: PropTypes.object,
	// texts: PropTypes.array,
};

export default connect()(AppContainer);
