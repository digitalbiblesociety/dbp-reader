/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

/*
* Todo: Items that need to be done before production
* todo: Replace all tabIndex 0 values with what they should actually be
* todo: Set up a function to init all of the plugins that rely on the browser
* todo: Update site url to match the live site domain name
* todo: Use cookies instead of session and local storage for all user settings (involves user approval before it can be utilized)
* todo: Remove the script for providing feedback
* */
// Needed for redux-saga es6 generator support
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import cachedFetch, { overrideCache } from '../app/utils/cachedFetch';
import HomePage from '../app/containers/HomePage';
import getinitialChapterData from '../app/utils/getInitialChapterData';
import {
	setChapterTextLoadingState,
	setUA,
} from '../app/containers/HomePage/actions';
import svg4everybody from '../app/utils/svgPolyfill';
// import request from '../app/utils/request';
import removeDuplicates from '../app/utils/removeDuplicateObjects';

class AppContainer extends React.Component {
	static displayName = 'Main app'; // eslint-disable-line no-undef
	componentWillMount() {
		// console.log('Component will mount for app', this.props);
		// console.log('Component will mount for app redux store available at mounting', this.props.dispatch);
	}
	componentDidMount() {
		// console.log('session storage autoplay item', sessionStorage.getItem('bible_is_autoplay'));
		// console.log('autoplay value in app didmount', sessionStorage.getItem('bible_is_autoplay')
		// 	? JSON.parse(sessionStorage.getItem('bible_is_autoplay'))
		// 	: false);
		// If the page was served from the server then I need to cache the data for this route
		if (this.props.isFromServer) {
			// console.log('Using cached url');
			// console.log('this.props.fetchedUrls', this.props.fetchedUrls);
			this.props.fetchedUrls.forEach((url) => {
				// logCache(url.href);
				overrideCache(url.href, url.data);
			});
		}
		localStorage.setItem('bible_is_2_book_id', this.props.match.params.bookId);
		localStorage.setItem('bible_is_3_chapter', this.props.match.params.chapter);
		localStorage.setItem(
			'bible_is_1_bible_id',
			this.props.match.params.bibleId,
		);
		sessionStorage.setItem('bible_is_audio_player_state', true);

		this.props.dispatch(setChapterTextLoadingState({ state: false }));

		// Intercept all route changes to ensure that the loading spinner starts
		Router.router.events.on('routeChangeStart', this.handleRouteChange);

		const userId =
			localStorage.getItem('bible_is_user_id') ||
			sessionStorage.getItem('bible_is_user_id') ||
			'';
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
			autoPlayEnabled: !!JSON.parse(
				sessionStorage.getItem('bible_is_autoplay'),
			),
		};
		// console.log('user profile', userProfile);
		// console.log('userId', userId);
		// console.log('isAuthenticated', isAuthenticated);

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

		const browserObject = {
			agent: '',
			majorVersion: '',
			version: '',
		};
		if (/msie [0-9]{1}/i.test(navigator.userAgent)) {
			browserObject.agent = 'msie';
			browserObject.majorVersion = parseInt(
				/MSIE ([0-9]{1})/i.exec(navigator.userAgent)[1],
				10,
			);
			browserObject.version = /MSIE ([0-9.]+)/i.exec(navigator.userAgent)[1];
		} else if (/Trident\/[7]{1}/i.test(navigator.userAgent)) {
			browserObject.agent = 'msie';
			browserObject.majorVersion = 11;
			browserObject.version = '11';
		}
		if (browserObject.agent === 'msie') {
			this.props.dispatch(setUA());
			// console.log('svg4everybody', svg4everybody);
			if (typeof svg4everybody === 'function') {
				// console.log('svg for everybody return value', svg4everybody);
				svg4everybody();
			}
		}
	}

	componentWillUnmount() {
		Router.router.events.off('routeChangeStart', this.handleRouteChange);
	}
	/* eslint-disable no-undef */
	handleRouteChange = (/* url */) => {
		/* eslint-enable no-undef */
		// console.log('Router change start fired', url);
		// Pause audio
		// Start loading spinner for text
		// Close any open menus
		// Remove current audio source - (may fix item 1)
		this.props.dispatch(setChapterTextLoadingState({ state: true }));
	};

	routerWasUpdated = false; // eslint-disable-line no-undef

	render() {
		const {
			activeChapter,
			chapterText,
			activeBookName,
			routeLocation,
		} = this.props;
		// console.log('this.props.dispatch in render', this.props);
		// const descriptionText = chapterText.map((v) => v.verse_text).join(' ');
		// Defaulting description text to an empty string since no metadata is better than inaccurate metadata
		const descriptionText =
			chapterText && chapterText[0] ? `${chapterText[0].verse_text}...` : '';

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
					<meta
						property={'og:image'}
						content={'https://listen.dbp4.org/static/icon-310x310.png'}
					/>
					<meta property={'og:image:width'} content={310} />
					<meta property={'og:image:height'} content={310} />
					{/* may need to replace contextLocation with the actual url */}
					<meta
						property={'og:url'}
						content={`https://listen.dbp4.org/${routeLocation}`}
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
	const { req, res: serverRes } = context;
	const routeLocation = context.asPath;
	const {
		bookId = 'GEN',
		chapter = 7,
		bibleId = 'ENGESV',
		verse,
		token,
	} = context.query;
	const userProfile = {};
	// console.log('context.query', context.query);

	let hasVideo = false;
	let isFromServer = true;
	// console.log('all state', context.reduxStore.getState().get('homepage'))
	// let userSettings = context.reduxStore.getState().getIn(['homepage', 'userSettings']).toJS();
	let userSettings = {};
	let userId = '';
	let isAuthenticated = false;

	if (!req) {
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
		userProfile.email = sessionStorage.getItem('bible_is_12345') || '';
		userProfile.nickname = sessionStorage.getItem('bible_is_123456') || '';
		userProfile.name = sessionStorage.getItem('bible_is_1234567') || '';
		userProfile.avatar = sessionStorage.getItem('bible_is_12345678') || '';
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

	// Get active bible data
	const singleBibleRes = await cachedFetch(singleBibleUrl).catch((e) => {
		if (process.env.NODE_ENV === 'development') {
			console.log('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
		}
		return { data: {} };
	});
	// console.log(
	//   'singleBibleRes.data.filesets["dbp-prod"]',
	//   singleBibleRes.data.filesets['dbp-prod'],
	// );
	// console.log(
	//   'singleBibleRes.data.filesets["dbp-vid"]',
	//   singleBibleRes.data.filesets['dbp-vid'],
	// );
	const singleBibleJson = singleBibleRes;
	// console.log('single bible', singleBibleJson);
	const bible = singleBibleJson.data;
	// Acceptable fileset types that the site is capable of ingesting and displaying
	const setTypes = {
		audio_drama: true,
		audio: true,
		text_plain: true,
		text_format: true,
		video_stream: true,
	};
	const activeFilesetId =
		bible.filesets && bible.filesets[process.env.DBP_BUCKET_ID]
			? bible.filesets[process.env.DBP_BUCKET_ID]
					.filter(
						(f) =>
							!f.id.includes('GID') &&
							f.id.slice(-4 !== 'DA16') &&
							(f.type === 'text_plain' || f.type === 'text_format'),
					)
					.reduce((a, c) => c.id, '')
			: '';
	// console.log('activeFilesetId', activeFilesetId);
	// console.log('filesets in app file before filter function', bible.filesets);
	// Filter out gideon bibles because the api will never be fixed in this area... -_- :( :'( ;'(
	let filesets = [];
	// console.log('bible', bible);
	if (
		bible.filesets &&
		bible.filesets[process.env.DBP_BUCKET_ID] &&
		bible.filesets['dbp-vid']
	) {
		hasVideo = true;
		// console.log('inside if with dbp-vid',  [...bible.filesets[process.env.DBP_BUCKET_ID], ...bible.filesets['dbp-vid']])
		filesets = [
			...bible.filesets[process.env.DBP_BUCKET_ID],
			...bible.filesets['dbp-vid'],
		].filter(
			(file) =>
				(!file.id.includes('GID') &&
					file.id.slice(-4) !== 'DA16' &&
					setTypes[file.type] &&
					file.size !== 'S' &&
					bible.filesets[process.env.DBP_BUCKET_ID].length > 1) ||
				bible.filesets[process.env.DBP_BUCKET_ID].length === 1,
		);
	} else if (bible.filesets && bible.filesets[process.env.DBP_BUCKET_ID]) {
		filesets = bible.filesets[process.env.DBP_BUCKET_ID].filter(
			(file) =>
				(!file.id.includes('GID') &&
					file.id.slice(-4) !== 'DA16' &&
					setTypes[file.type] &&
					file.size !== 'S' &&
					bible.filesets[process.env.DBP_BUCKET_ID].length > 1) ||
				bible.filesets[process.env.DBP_BUCKET_ID].length === 1,
		);
	}
	// console.log('filesets in app call', filesets);
	// const filesets =
	// 	bible.filesets && bible.filesets[process.env.DBP_BUCKET_ID]
	// 		? bible.filesets[process.env.DBP_BUCKET_ID].filter(
	// 				(file) =>
	// 					(!file.id.includes('GID') &&
	// 						file.id.slice(-4) !== 'DA16' &&
	// 						setTypes[file.type] &&
	// 						file.size !== 'S' &&
	// 						bible.filesets[process.env.DBP_BUCKET_ID].length > 1) ||
	// 					bible.filesets[process.env.DBP_BUCKET_ID].length === 1,
	// 		  )
	// 		: [];
	// console.log('filesets in app file', filesets);
	// console.log('bible.name', bible.name);
	// console.log('bible.abbr', bible.abbr);

	const formattedFilesetIds = [];
	const plainFilesetIds = [];
	const idsForBookMetadata = {};
	const bookCachePairs = [];
	// Separate filesets by type
	filesets.forEach((set) => {
		if (set.type === 'text_format') {
			formattedFilesetIds.push(set.id);
		} else if (set.type === 'text_plain') {
			plainFilesetIds.push(set.id);
		}

		// Gets one id for each fileset type
		idsForBookMetadata[set.type] = set.id;
	});
	// console.log(idsForBookMetadata);

	const bookMetaPromises = Object.entries(idsForBookMetadata).map(
		async (id) => {
			// console.log('id', id);
			const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
				id[1]
			}/books?v=4&key=${process.env.DBP_API_KEY}&bucket=${
				process.env.DBP_BUCKET_ID
			}&fileset_type=${id[0]}`;
			// console.log('url', url);
			const res = await cachedFetch(url); // .catch((e) => {
			// 	if (process.env.NODE_ENV === 'development') {
			// 		console.log('Error in request for formatted fileset: ', e.message); // eslint-disable-line no-console
			// 	}
			// 	return [];
			// });
			// console.log('res', res);
			bookCachePairs.push({ href: url, data: res });
			// console.log('url', url);
			// console.log('res', res.data ? res.data.length : res.length);

			return res.data || [];
		},
	);
	const bookMetaResponse = await Promise.all(bookMetaPromises);
	const bookMetaData = removeDuplicates(
		bookMetaResponse.reduce((a, c) => [...a, ...c], []),
		'book_id',
	);
	// console.log('bookMetaData.length', bookMetaData.length);
	/*
    if (res) {
      res.writeHead(302, {
        Location: 'http://example.com'
      })
      res.end()
    } else {
      Router.push('http://example.com')
    }
	*/
	// Redirect to the new url if conditions are met
	if (bookMetaData && bookMetaData.length) {
		const foundBook = bookMetaData.find(
			(book) => book.book_id === bookId.toUpperCase(),
		);
		const foundChapter = foundBook
			? foundBook.chapters.find((c) => c === parseInt(chapter, 10))
			: undefined;

		// If the book wasn't found and chapter wasn't found
		// Go to the first book and first chapter
		if (!foundBook && !foundChapter) {
			// Logs the url that will be redirected to
			// console.log('url', `${req.protocol}://${req.hostname}${reqPort}/bible/${bibleId}/${bookMetaData[0].book_id}/${bookMetaData[0].chapters[0]}`);
			if (serverRes) {
				// console.log('redirecting 1');
				// If there wasn't a book then we need to redirect to mark for video resources and matthew for other resources
				hasVideo
					? serverRes.writeHead(302, {
							Location: `${req.protocol}://${req.get(
								'host',
							)}/bible/${bibleId}/mrk/1`,
					  })
					: serverRes.writeHead(302, {
							Location: `${req.protocol}://${req.get(
								'host',
							)}/bible/${bibleId}/${bookMetaData[0].book_id}/${
								bookMetaData[0].chapters[0]
							}`,
					  });
				serverRes.end();
			} else {
				// console.log('window 1');
				hasVideo
					? Router.push(`${window.location.origin}/bible/${bibleId}/mrk/1`)
					: Router.push(
							`${window.location.origin}/bible/${bibleId}/${
								bookMetaData[0].book_id
							}/${bookMetaData[0].chapters[0]}`,
					  );
			}
		} else if (foundBook) {
			// if the book was found
			// check for the chapter
			if (!foundChapter) {
				// if the chapter was not found
				// go to the book and the first chapter for that book
				if (serverRes) {
					// console.log('redirecting 2');
					serverRes.writeHead(302, {
						Location: `${req.protocol}://${req.get('host')}/bible/${bibleId}/${
							foundBook.book_id
						}/${foundBook.chapters[0]}`,
					});
					serverRes.end();
				} else {
					// console.log('window 2');
					Router.push(
						`${window.location.origin}/bible/${bibleId}/${foundBook.book_id}/${
							foundBook.chapters[0]
						}`,
					);
				}
			}
		}
	}
	// dont change book or chapter

	let initData = {
		plainText: [],
		formattedText: '',
		plainTextJson: {},
		audioPaths: [''],
	};
	try {
		// console.log('Before init func');
		/* eslint-disable no-console */
		initData = await getinitialChapterData({
			filesets,
			bookId,
			chapter,
			plainFilesetIds,
			formattedFilesetIds,
		}).catch((err) => {
			if (process.env.NODE_ENV === 'development') {
				console.error(
					`Error caught in get initial chapter data in promise: ${err.message}`,
				);
			}
			return {
				formattedText: '',
				plainText: [],
				plainTextJson: {},
				audioPaths: [''],
			};
		});
	} catch (err) {
		if (process.env.NODE_ENV === 'development') {
			console.error(
				`Error caught in get initial chapter data by try catch: ${err.message}`,
			);
		}
	}
	/* eslint-enable no-console */
	// console.log('After init func', Object.keys(bookMetaData.reduce((a, c) => ({ ...a, [c.book_id]: true }), {})));
	// console.log('initData.audioPaths', initData.audioPaths);
	// Get text for chapter
	// const textRes = await fetch(textUrl);
	const textJson = initData.plainTextJson;
	const chapterText = initData.plainText;

	let activeBook = { chapters: [] };
	const bookData = bookMetaData.length ? bookMetaData : bible.books;

	if (bookData) {
		const urlBook = bookData.find(
			(book) =>
				book.book_id && book.book_id.toLowerCase() === bookId.toLowerCase(),
		);
		if (urlBook) {
			activeBook = urlBook;
		} else {
			activeBook = bookData[0];
		}
	} else {
		activeBook = undefined;
	}
	// console.log('activeBook', activeBook);
	// console.log('bible.books', bible.books);

	const activeBookName = activeBook ? activeBook.name : '';
	// const bookMetaRes = await cachedFetch(bookMetaDataUrl).catch((e) => {
	// 	if (process.env.NODE_ENV === 'development') {
	// 		console.log('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
	// 	}
	// 	return { data: [] };
	// });
	// const bookMetaJson = bookMetaRes;
	// console.log('bookData', bookData.map(d => ({ [d.book_id]: d.name })));
	const testaments = bookData
		? bookData.reduce((a, c) => ({ ...a, [c.book_id]: c.testament }), {})
		: [];

	if (context.reduxStore) {
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
				activeFilesetId,
				audioPaths: initData.audioPaths.slice(1),
				audioSource: initData.audioPaths[0] || '',
				hasAudio: !!initData.audioPaths.length,
				chapterText,
				testaments,
				userSettings,
				formattedSource: initData.formattedText,
				activeFilesets: filesets,
				books: bookData || [],
				activeChapter: parseInt(chapter, 10) || 1,
				activeBookName,
				verseNumber: verse,
				activeTextId: bible.abbr || '',
				activeIsoCode: bible.iso || '',
				defaultLanguageIso: bible.iso || 'eng',
				activeLanguageName: bible.language || '',
				activeTextName: bible.vname || bible.name,
				defaultLanguageName: bible.language || 'English',
				defaultLanguageCode: bible.language_id || 6414,
				textDirection: bible.alphabet ? bible.alphabet.direction : 'ltr',
				activeBookId: bookId.toUpperCase() || '',
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
	}
	if (!isFromServer) {
		// console.log('The func ran on the client');
		// console.log('initData.formattedText', initData.formattedText);
	}
	return {
		// isServer,
		chapterText,
		testaments,
		formattedText: initData.formattedText,
		books: bookData || [],
		activeChapter: parseInt(chapter, 10),
		activeBookName,
		verseNumber: verse,
		activeTextId: bible.abbr,
		activeIsoCode: bible.iso,
		activeLanguageName: bible.language,
		textDirection: bible.alphabet ? bible.alphabet.direction : 'ltr',
		activeFilesets: filesets,
		defaultLanguageIso: bible.iso || 'eng',
		defaultLanguageName: bible.language || 'English',
		defaultLanguageCode: bible.language_id || 6414,
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
			{ href: singleBibleUrl, data: singleBibleJson },
			{ href: textUrl, data: textJson },
			...bookCachePairs,
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
};

export default connect()(AppContainer);
