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
import removeDuplicates from '../app/utils/removeDuplicateObjects';
import parseCookie from '../app/utils/parseCookie';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from '../app/containers/Settings/themes';

class AppContainer extends React.Component {
	static displayName = 'Main app'; // eslint-disable-line no-undef
	componentWillMount() {
		if (
			typeof document !== 'undefined' &&
			this.props.userSettings &&
			this.props.userSettings.toggleOptions
		) {
			const activeTheme = this.props.userSettings.activeTheme;
			const activeFontType = this.props.userSettings.activeFontType;
			const activeFontSize = this.props.userSettings.activeFontSize;
			const redLetter = this.props.userSettings.toggleOptions.redLetter.active;
			// Apply theme data to site
			toggleWordsOfJesus(redLetter);
			applyTheme(activeTheme);
			applyFontFamily(activeFontType);
			applyFontSize(activeFontSize);
		}
	}
	componentDidMount() {
		// If the page was served from the server then I need to cache the data for this route
		if (this.props.isFromServer) {
			this.props.fetchedUrls.forEach((url) => {
				if (url.data.error || url.data.errors) {
					overrideCache(url.href, {}, 1);
				} else {
					overrideCache(url.href, url.data);
				}
			});
		}

		// If undefined gets stored in local storage it cannot be parsed so I have to compare strings
		if (this.props.userProfile.userId) {
			this.props.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
				profile: {
					userId: this.props.userProfile.userId,
					userAuthenticated: !!this.props.userProfile.userId,
					userProfile: {
						email:
							this.props.userProfile.email ||
							this.props.userProfile.email ||
							'',
						name:
							this.props.userProfile.name || this.props.userProfile.name || '',
						nickname:
							this.props.userProfile.name || this.props.userProfile.name || '',
					},
				},
			});
		}
		this.props.dispatch(setChapterTextLoadingState({ state: false }));

		// Intercept all route changes to ensure that the loading spinner starts
		Router.router.events.on('routeChangeStart', this.handleRouteChange);

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
			if (typeof svg4everybody === 'function') {
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
		// Pause audio
		// Start loading spinner for text
		// Close any open menus
		// Remove current audio source - (may fix item 1)
		// TODO: Probably need to get the new highlights here or at least start the process for getting them
		this.props.dispatch(setChapterTextLoadingState({ state: true }));
	};

	routerWasUpdated = false; // eslint-disable-line no-undef

	render() {
		const {
			activeChapter,
			chapterText,
			activeBookName,
			routeLocation,
			initialPlaybackRate,
			initialVolume,
		} = this.props;
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
				<HomePage
					initialPlaybackRate={initialPlaybackRate}
					initialVolume={initialVolume}
				/>
			</div>
		);
	}
}

AppContainer.getInitialProps = async (context) => {
	const { req, res: serverRes } = context;
	const routeLocation = context.asPath;
	const {
		bookId = 'GEN',
		chapter = 7,
		bibleId = 'ENGESV',
		verse,
		token,
		userId: reqUserId,
		userEmail = '',
		userName = '',
	} = context.query;
	const userProfile = {
		userId,
		email: userEmail,
		name: userName,
		nickname: userName,
	};
	let userId = reqUserId || '';
	let hasVideo = false;
	let isFromServer = true;
	let userSettings = {
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
				active: false,
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
		autoPlayEnabled: false,
	};
	let isAuthenticated = false;
	let initialVolume = 1;
	let initialPlaybackRate = 1;

	if (req && req.headers.cookie) {
		// Get all cookies that the page needs
		const cookieData = parseCookie(req.headers.cookie);

		if (userId) {
			// Authentication Information
			isAuthenticated = !!userId;
			// User Profile
			userProfile.email = userEmail;
			userProfile.nickname = userName;
			userProfile.name = userName;
			userProfile.userId = userId;
			// Avatar is a placeholder for when we actually build the rest of that functionality
			userProfile.avatar = '';
		} else if (!userId) {
			// Authentication Information
			userId = cookieData.bible_is_user_id || '';
			isAuthenticated = !!cookieData.bible_is_user_id;
			// User Profile
			userProfile.email = cookieData.bible_is_email || '';
			userProfile.nickname = cookieData.bible_is_name || '';
			userProfile.name = cookieData.bible_is_name;
			// Avatar is a placeholder for when we actually build the rest of that functionality
			userProfile.avatar = '';
		}

		// Audio Player
		initialVolume =
			cookieData.bible_is_volume === 0 ? 0 : cookieData.bible_is_volume || 1;
		initialPlaybackRate = cookieData.bible_is_playbackrate || 1;

		// User Settings
		userSettings = {
			activeTheme: cookieData.bible_is_theme || 'red',
			activeFontType: cookieData.bible_is_font_family || 'sans',
			activeFontSize: cookieData.bible_is_font_size || 42,
			toggleOptions: {
				readersMode: {
					name: "READER'S MODE",
					active: cookieData.bible_is_userSettings_toggleOptions_readersMode_active
						? !!cookieData.bible_is_userSettings_toggleOptions_readersMode_active
						: false,
					available: true,
				},
				crossReferences: {
					name: 'CROSS REFERENCE',
					active: cookieData.bible_is_userSettings_toggleOptions_crossReferences_active
						? !!cookieData.bible_is_userSettings_toggleOptions_crossReferences_active
						: true,
					available: true,
				},
				redLetter: {
					name: 'RED LETTER',
					active: cookieData.bible_is_words_of_jesus
						? !!cookieData.bible_is_words_of_jesus
						: true,
					available: true,
				},
				justifiedText: {
					name: 'JUSTIFIED TEXT',
					active: cookieData.bible_is_userSettings_toggleOptions_justifiedText_active
						? !!cookieData.bible_is_userSettings_toggleOptions_justifiedText_active
						: false,
					available: true,
				},
				oneVersePerLine: {
					name: 'ONE VERSE PER LINE',
					active: cookieData.bible_is_userSettings_toggleOptions_oneVersePerLine_active
						? !!cookieData.bible_is_userSettings_toggleOptions_oneVersePerLine_active
						: false,
					available: true,
				},
				verticalScrolling: {
					name: 'VERTICAL SCROLLING',
					active: false,
					available: false,
				},
			},
			autoPlayEnabled: !!cookieData.bible_is_autoplay,
		};

		// Handle oauth code if there is one
		if (cookieData.bible_is_cb_code && cookieData.bible_is_provider) {
			await fetch(
				`${process.env.BASE_API_ROUTE}/login/${
					cookieData.bible_is_provider
				}/callback?v=4&project_id=${process.env.NOTES_PROJECT_ID}&key=${
					process.env.DBP_API_KEY
				}&alt_url=true&code=${cookieData.bible_is_cb_code}`,
			).then((body) => body.json());
		}

		isFromServer = false;
	} else if (typeof document !== 'undefined' && document.cookie) {
		const cookieData = parseCookie(document.cookie);

		if (userId) {
			setUserInfo({ userId, userEmail, userName });
			// Authentication Information
			isAuthenticated = !!userId;
			// User Profile
			userProfile.email = userEmail;
			userProfile.nickname = userName;
			userProfile.name = userName;
			userProfile.userId = userId;
			// Avatar is a placeholder for when we actually build the rest of that functionality
			userProfile.avatar = '';
		} else if (!userId) {
			// Authentication Information
			userId = localStorage.getItem('bible_is_user_id') || '';
			isAuthenticated = !!localStorage.getItem('bible_is_user_id') || '';
			// User Profile
			userProfile.email = localStorage.getItem('bible_is_user_email') || '';
			userProfile.nickname = localStorage.getItem('bible_is_user_name') || '';
			userProfile.name = localStorage.getItem('bible_is_user_nickname');
			userProfile.userId = userId;
			// Avatar is a placeholder for when we actually build the rest of that functionality
			userProfile.avatar = '';
		}

		// Audio Player
		initialVolume =
			cookieData.bible_is_volume === 0 ? 0 : cookieData.bible_is_volume || 1;
		initialPlaybackRate = cookieData.bible_is_playbackrate || 1;
		// User Settings
		userSettings = {
			activeTheme: cookieData.bible_is_theme || 'red',
			activeFontType: cookieData.bible_is_font_family || 'sans',
			activeFontSize: cookieData.bible_is_font_size || 42,
			toggleOptions: {
				readersMode: {
					name: "READER'S MODE",
					active: cookieData.bible_is_userSettings_toggleOptions_readersMode_active
						? !!cookieData.bible_is_userSettings_toggleOptions_readersMode_active
						: false,
					available: true,
				},
				crossReferences: {
					name: 'CROSS REFERENCE',
					active: cookieData.bible_is_userSettings_toggleOptions_crossReferences_active
						? !!cookieData.bible_is_userSettings_toggleOptions_crossReferences_active
						: true,
					available: true,
				},
				redLetter: {
					name: 'RED LETTER',
					active: cookieData.bible_is_words_of_jesus
						? !!cookieData.bible_is_words_of_jesus
						: true,
					available: true,
				},
				justifiedText: {
					name: 'JUSTIFIED TEXT',
					active: cookieData.bible_is_userSettings_toggleOptions_justifiedText_active
						? !!cookieData.bible_is_userSettings_toggleOptions_justifiedText_active
						: false,
					available: true,
				},
				oneVersePerLine: {
					name: 'ONE VERSE PER LINE',
					active: cookieData.bible_is_userSettings_toggleOptions_oneVersePerLine_active
						? !!cookieData.bible_is_userSettings_toggleOptions_oneVersePerLine_active
						: false,
					available: true,
				},
				verticalScrolling: {
					name: 'VERTICAL SCROLLING',
					active: false,
					available: false,
				},
			},
			autoPlayEnabled: !!cookieData.bible_is_autoplay,
		};
	}

	const singleBibleUrl = `${
		process.env.BASE_API_ROUTE
	}/bibles/${bibleId}?asset_id=${process.env.DBP_BUCKET_ID}&key=${
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
			console.error('Error in get initial props single bible: ', e.message); // eslint-disable-line no-console
		}
		return { data: {} };
	});

	const singleBibleJson = singleBibleRes;
	const bible = singleBibleJson.data || {};
	// Acceptable fileset types that the site is capable of ingesting and displaying
	const setTypes = {
		audio_drama: true,
		audio: true,
		text_plain: true,
		text_format: true,
		video_stream: true,
	};
	const activeFilesetId =
		bible && bible.filesets && bible.filesets[process.env.DBP_BUCKET_ID]
			? bible.filesets[process.env.DBP_BUCKET_ID]
					.filter(
						(f) =>
							!f.id.includes('GID') &&
							f.id.slice(-4 !== 'DA16') &&
							(f.type === 'text_plain' || f.type === 'text_format'),
					)
					.reduce((a, c) => c.id, '')
			: '';

	// Filter out gideon bibles because the api will never be fixed in this area... -_- :( :'( ;'(
	// TODO: Revisit this to see if it is still needed!
	let filesets = [];

	if (
		bible &&
		bible.filesets &&
		bible.filesets[process.env.DBP_BUCKET_ID] &&
		bible.filesets['dbp-vid']
	) {
		hasVideo = true;
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
	} else if (
		bible &&
		bible.filesets &&
		bible.filesets[process.env.DBP_BUCKET_ID]
	) {
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

	const bookMetaPromises = Object.entries(idsForBookMetadata).map(
		async (id) => {
			const url = `${process.env.BASE_API_ROUTE}/bibles/filesets/${
				id[1]
			}/books?v=4&key=${process.env.DBP_API_KEY}&asset_id=${
				process.env.DBP_BUCKET_ID
			}&fileset_type=${id[0]}`;
			const res = await cachedFetch(url);
			bookCachePairs.push({ href: url, data: res });

			return res.data || [];
		},
	);
	const bookMetaResponse = await Promise.all(bookMetaPromises);
	const bookMetaData = removeDuplicates(
		bookMetaResponse.reduce((a, c) => [...a, ...c], []),
		'book_id',
	);

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
			if (serverRes) {
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
					serverRes.writeHead(302, {
						Location: `${req.protocol}://${req.get('host')}/bible/${bibleId}/${
							foundBook.book_id
						}/${foundBook.chapters[0]}`,
					});
					serverRes.end();
				} else {
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
	// Get text for chapter
	const textJson = initData.plainTextJson;
	const chapterText = initData.plainText;

	let activeBook = { chapters: [] };
	const bookData = bookMetaData.length || !bible ? bookMetaData : bible.books;

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

	const activeBookName = activeBook ? activeBook.name : '';
	const testaments = bookData
		? bookData.reduce((a, c) => ({ ...a, [c.book_id]: c.testament }), {})
		: [];
	if (context.reduxStore) {
		if (userProfile.userId && userProfile.email) {
			context.reduxStore.dispatch({
				type: 'GET_INITIAL_ROUTE_STATE_PROFILE',
				profile: {
					userId: userProfile.userId,
					userAuthenticated: !!userProfile.userId,
					userProfile: {
						email: userProfile.email || userProfile.email || '',
						name: userProfile.name || userProfile.name || '',
						nickname: userProfile.name || userProfile.name || '',
					},
				},
			});
		}
		context.reduxStore.dispatch({
			type: 'GET_INITIAL_ROUTE_STATE_HOMEPAGE',
			homepage: {
				userProfile,
				activeFilesetId,
				audioPaths: initData.audioPaths.slice(1),
				audioSource: initData.audioPaths[0] || '',
				loadingAudio: !initData.audioPaths.length,
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
	}

	if (typeof document !== 'undefined') {
		document.cookie = `bible_is_ref_bible_id=${bibleId}`;
		document.cookie = `bible_is_ref_book_id=${bookId}`;
		document.cookie = `bible_is_ref_chapter=${chapter}`;
		document.cookie = `bible_is_ref_verse=${verse}`;
	}

	return {
		initialVolume,
		initialPlaybackRate,
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
		userSettings,
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
	match: PropTypes.object,
	userSettings: PropTypes.object,
	userProfile: PropTypes.object,
	chapterText: PropTypes.array,
	fetchedUrls: PropTypes.array,
	isFromServer: PropTypes.bool,
	routeLocation: PropTypes.string,
	activeBookName: PropTypes.string,
	activeChapter: PropTypes.number,
	initialVolume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	initialPlaybackRate: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
};

export default connect()(AppContainer);
