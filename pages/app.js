/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

/*
* Todos
* todo: Replace all tabIndex 0 values with what they should actually be
* todo: Set up a function to init all of the plugins that rely on the browser
* todo: Update site url to match the live site domain name
* */
// Needed for redux-saga es6 generator support
import 'babel-polyfill';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'rc-slider/assets/index.css';
import 'react-accessible-accordion/dist/minimal-example.css';
import Head from 'next/head';
import Router from 'next/router';
import cachedFetch, { overrideCache } from '../app/utils/cachedFetch';
import HomePage from '../app/containers/HomePage';
import getinitialChapterData from '../app/utils/getInitialChapterData';

// Import CSS reset and Global Styles
import '../static/app.scss';
// Need to figure out how to get the site to load this file from any url
import '../static/manifest.json';
import { setChapterTextLoadingState } from '../app/containers/HomePage/actions';

class AppContainer extends React.Component {
	static displayName = 'Main app';
	componentWillMount() {
		// console.log('Component will mount for app', this.props);
		// console.log('Component will mount for app redux store available at mounting', this.props.dispatch);
	}
	componentDidMount() {
		// If the page was served from the server then I need to cache the data for this route
		if (this.props.isFromServer) {
			// console.log('Using cached url');
			// console.log('this.props.fetchedUrls', this.props.fetchedUrls);
			this.props.fetchedUrls.forEach((url) => {
				overrideCache(url.href, url.data);
			});
		}
		// Todo: Store all local variables needed
		localStorage.setItem('bible_is_2_book_id', this.props.match.params.bookId);
		localStorage.setItem('bible_is_3_chapter', this.props.match.params.chapter);
		localStorage.setItem(
			'bible_is_1_bible_id',
			this.props.match.params.bibleId,
		);
		sessionStorage.setItem('bible_is_audio_player_state', true);

		this.props.dispatch(setChapterTextLoadingState({ state: false }));

		Router.router.events.on('routeChangeStart', this.handleRouteChange);
		// After launch see if I can get Reactotron working with SSR and redux
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
		// console.log('this.props.dispatch in didMount', this.props.dispatch);

		const userId =
			localStorage.getItem('bible_is_user_id') ||
			sessionStorage.getItem('bible_is_user_id');
		const isAuthenticated = !!(
			localStorage.getItem('bible_is_user_id') ||
			sessionStorage.getItem('bible_is_user_id')
		);
		const userProfile = {};
		userProfile.email = sessionStorage.getItem('bible_is_12345') || '';
		userProfile.nickname = sessionStorage.getItem('bible_is_123456') || '';
		userProfile.name = sessionStorage.getItem('bible_is_1234567') || '';
		userProfile.avatar = sessionStorage.getItem('bible_is_12345678') || '';
		const userSettings = {
			activeTheme: sessionStorage.getItem('bible_is_theme') || 'red',
			activeFontType: sessionStorage.getItem('bible_is_font_family') || 'sans',
			activeFontSize:
				parseInt(sessionStorage.getItem('bible_is_font_size'), 10) || 42,
			toggleOptions: {
				readersMode: {
					name: "READER'S MODE",
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_readersMode_active',
						),
					),
					available: true,
				},
				crossReferences: {
					name: 'CROSS REFERENCE',
					active: localStorage.getItem(
						'userSettings_toggleOptions_crossReferences_active',
					)
						? JSON.parse(
								localStorage.getItem(
									'userSettings_toggleOptions_crossReferences_active',
								),
						  )
						: true,
					available: true,
				},
				redLetter: {
					name: 'RED LETTER',
					active: localStorage.getItem('bible_is_words_of_jesus')
						? JSON.parse(localStorage.getItem('bible_is_words_of_jesus'))
						: true,
					available: true,
				},
				justifiedText: {
					name: 'JUSTIFIED TEXT',
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_justifiedText_active',
						),
					),
					available: true,
				},
				oneVersePerLine: {
					name: 'ONE VERSE PER LINE',
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_oneVersePerLine_active',
						),
					),
					available: true,
				},
				verticalScrolling: {
					name: 'VERTICAL SCROLLING',
					active: false,
					available: false,
				},
			},
			autoPlayEnabled: sessionStorage.getItem('bible_is_autoplay')
				? JSON.parse(sessionStorage.getItem('bible_is_autoplay'))
				: false,
		};

		if (userId && isAuthenticated) {
			this.props.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_HOMEPAGE',
				homepage: {
					userSettings,
					userProfile,
					userId,
					userAuthenticated: isAuthenticated,
				},
			});
			this.props.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
				profile: {
					userProfile,
					userId,
					userAuthenticated: isAuthenticated,
				},
			});
		} else {
			this.props.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_HOMEPAGE',
				homepage: {
					userSettings,
					userId,
					userAuthenticated: isAuthenticated,
				},
			});
			this.props.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
				profile: {
					userId,
					userAuthenticated: isAuthenticated,
				},
			});
		}
	}

	componentWillUnmount() {
		Router.router.events.off('routeChangeStart', this.handleRouteChange);
	}

	handleRouteChange = () => {
		// console.log('Router change start fired');
		this.props.dispatch(setChapterTextLoadingState({ state: true }));
	};

	routerWasUpdated = false;

	render() {
		const {
			activeChapter,
			chapterText,
			activeBookName,
			routeLocation,
		} = this.props;
		// console.log('this.props.dispatch in render', this.props);
		const descriptionText = chapterText.map((v) => v.verse_text).join(' ');

		return (
			<div>
				<Head>
					<meta name={'description'} content={descriptionText} />
					<meta
						property={'og:title'}
						content={`${activeBookName} ${activeChapter}${
							this.props.match.params.verse
								? `:${this.props.match.params.verse}`
								: ''
						} | Bible.is`}
					/>
					{/* may need to replace contextLocation with the actual url */}
					<meta
						property={'og:url'}
						content={`https://is.bible.build/${routeLocation}`}
					/>
					<meta property={'og:description'} content={descriptionText} />
					<meta
						name={'twitter:title'}
						content={`${activeBookName} ${activeChapter}`}
					/>
					<meta name={'twitter:description'} content={descriptionText} />
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
	// console.log('Get initial props started running');
	const routeLocation = context.asPath;

	const { bibleId, bookId, chapter, verse, token } = context.query;
	let isFromServer = true;
	const userProfile = {};
	let userSettings = {};
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
		userSettings = {
			activeTheme: sessionStorage.getItem('bible_is_theme') || 'red',
			activeFontType: sessionStorage.getItem('bible_is_font_family') || 'sans',
			activeFontSize:
				parseInt(sessionStorage.getItem('bible_is_font_size'), 10) || 42,
			toggleOptions: {
				readersMode: {
					name: "READER'S MODE",
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_readersMode_active',
						),
					),
					available: true,
				},
				crossReferences: {
					name: 'CROSS REFERENCE',
					active: localStorage.getItem(
						'userSettings_toggleOptions_crossReferences_active',
					)
						? JSON.parse(
								localStorage.getItem(
									'userSettings_toggleOptions_crossReferences_active',
								),
						  )
						: true,
					available: true,
				},
				redLetter: {
					name: 'RED LETTER',
					active: localStorage.getItem('bible_is_words_of_jesus')
						? JSON.parse(localStorage.getItem('bible_is_words_of_jesus'))
						: true,
					available: true,
				},
				justifiedText: {
					name: 'JUSTIFIED TEXT',
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_justifiedText_active',
						),
					),
					available: true,
				},
				oneVersePerLine: {
					name: 'ONE VERSE PER LINE',
					active: JSON.parse(
						localStorage.getItem(
							'userSettings_toggleOptions_oneVersePerLine_active',
						),
					),
					available: true,
				},
				verticalScrolling: {
					name: 'VERTICAL SCROLLING',
					active: false,
					available: false,
				},
			},
			autoPlayEnabled: sessionStorage.getItem('bible_is_autoplay')
				? JSON.parse(sessionStorage.getItem('bible_is_autoplay'))
				: false,
		};
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
	const singleBibleRes = await cachedFetch(singleBibleUrl).catch((e) => {
		if (process.env.NODE_ENV === 'development') {
			console.log('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
		}
		return { data: {} };
	});
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

	const bookMetaRes = await cachedFetch(bookMetaDataUrl).catch((e) => {
		if (process.env.NODE_ENV === 'development') {
			console.log('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
		}
		return { data: [] };
	});
	const bookMetaJson = bookMetaRes;
	// console.log('bookMetaJson', bookMetaJson);

	const testaments = bookMetaJson.data.reduce(
		(a, c) => ({ ...a, [c.id]: c.book_testament }),
		{},
	);

	context.reduxStore.dispatch({
		type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
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

	context.reduxStore.dispatch({
		type: 'GET_INITIAL_ROUTE_STATE_HOMEPAGE',
		homepage: {
			userProfile,
			chapterText,
			testaments,
			userSettings,
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
	});
	// console.log('Got the initial state!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
		routeLocation,
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
	dispatch: PropTypes.func,
	isFromServer: PropTypes.bool,
	activeChapter: PropTypes.number,
	chapterText: PropTypes.array,
	activeBookName: PropTypes.string,
	routeLocation: PropTypes.string,
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
