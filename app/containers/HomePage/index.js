/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 * TODO: Refactor to have everything use immutablejs and not plain js
 */

// import { fromJS, is } from 'immutable';
// import TextSelection from 'containers/TextSelection';
// import ChapterSelection from 'containers/ChapterSelection';
// import MenuBar from 'components/MenuBar';
// import messages from './messages';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import { fromJS } from 'immutable';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import Settings from 'containers/Settings';
import AudioPlayer from 'containers/AudioPlayer';
import Profile from 'containers/Profile';
import Notes from 'containers/Notes';
import Text from 'containers/Text';
import NavigationBar from 'components/NavigationBar';
import Footer from 'components/Footer';
import SearchContainer from 'containers/SearchContainer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import FadeTransition from 'components/FadeTransition';
import logo from 'images/app-icons/favicon-96x96.png';
import svg4everybody from 'utils/svgPolyfill';
// import {
// 	statusChangeCallback,
// 	checkLoginState,
// } from 'utils/facebookFunctions';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from 'containers/Settings/themes';
// import {
// 	getCountries,
// 	getLanguages,
// 	getTexts,
// } from 'containers/TextSelection/actions';
// import differenceObject from 'utils/deepDifferenceObject';
import notesReducer from 'containers/Notes/reducer';
import textReducer from 'containers/TextSelection/reducer';
// import notesSaga from 'containers/Notes/saga';
import textSaga from 'containers/TextSelection/saga';
import { getBookmarksForChapter, addBookmark } from 'containers/Notes/actions';
import {
	addHighlight,
	// createUserWithSocialAccount,
	deleteHighlights,
	getBooks,
	getNotes,
	getChapterText,
	getHighlights,
	getCopyrights,
	// toggleMenuBar,
	toggleProfile,
	toggleAutoPlay,
	toggleNotesModal,
	toggleSearchModal,
	toggleSettingsModal,
	toggleChapterSelection,
	toggleVersionSelection,
	toggleFirstLoadForTextSelection,
	toggleInformationModal,
	setUA,
	setActiveNote,
	setActiveTextId,
	setActiveChapter,
	setActiveBookName,
	setActiveNotesView,
	setAudioPlayerState,
	initApplication,
} from './actions';
import makeSelectHomePage, {
	selectSettings,
	selectPrevBook,
	selectNextBook,
	selectActiveBook,
	selectFormattedSource,
	selectAuthenticationStatus,
	selectUserId,
	selectUserNotes,
	// selectHighlights,
	// selectChapterText,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

class HomePage extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// Get the first bible based on the url here
		const { params } = this.props.match;
		const { bibleId, bookId, chapter } = params;
		const verse = params.verse || '';
		const { userAuthenticated: authenticated, userId } = this.props;
		// console.log('authenticated in home did mount', authenticated);
		// console.log('userId in home did mount', userId);
		// console.log('props location', this.props.location.search.slice(6));
		// console.log('localStorage.getItem(userSettings_toggleOptions_readersMode_active)', localStorage.getItem('userSettings_toggleOptions_readersMode_active') === false);
		// console.log('localStorage.getItem(userSettings_toggleOptions_crossReferences_active)', localStorage.getItem('userSettings_toggleOptions_crossReferences_active'));
		// console.log('params', params);

		if (bibleId && bookId && chapter >= 0) {
			this.props.dispatch({
				type: 'getbible',
				bibleId,
				bookId,
				chapter,
				authenticated,
				userId,
				verse,
			});
			// console.log('not redirecting in bible, book and chapter');
		} else if (bibleId && bookId) {
			// run saga but default the chapter
			// I can auto default to 1 here because logic -_- 乁( ⁰͡ Ĺ̯ ⁰͡ ) ㄏ
			this.props.dispatch({
				type: 'getbible',
				bibleId,
				bookId,
				chapter: 1,
				authenticated,
				userId,
				verse,
			});
			// console.log('redirecting from bible and book');
			// console.log(this.props);
			this.props.history.replace(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/1`,
			);
		} else if (bibleId) {
			// If the user only enters a version of the bible then
			// I want to default to the first book that bible has
			this.props.dispatch({
				type: 'getbible',
				bibleId,
				bookId: '', // This works because of how the saga fetches the next chapter
				chapter: 1,
				authenticated,
				userId,
				verse,
			});
			// May want to use replace here at some point
			// this.props.history.replace(`/${bibleId}/gen/1`);
		} else if (this.props.match.params.token) {
			// Open Profile
			this.toggleProfile();
			// Give profile the token - done in render
			// Open Password Reset Verified because there is a token - done in Profile/index
		} else {
			// Defaulting to esv until browser language detection is implemented
			// console.log('redirecting from else in did mount');
			const sessionBibleId = sessionStorage.getItem('bible_is_1_bible_id');
			const sessionBookId = sessionStorage.getItem('bible_is_2_book_id');
			const sessionChapter = sessionStorage.getItem('bible_is_3_chapter');

			if (sessionBibleId && sessionBookId && sessionChapter) {
				this.props.history.replace(
					`/${sessionBibleId}/${sessionBookId}/${sessionChapter}`,
				);
			} else {
				this.props.history.replace('/engesv/mat/1');
			}
		}

		const activeTheme = get(this, [
			'props',
			'homepage',
			'userSettings',
			'activeTheme',
		]);
		const activeFontFamily = get(this, [
			'props',
			'homepage',
			'userSettings',
			'activeFontType',
		]);
		const activeFontSize = get(this, [
			'props',
			'homepage',
			'userSettings',
			'activeFontSize',
		]);
		const redLetter = get(this, [
			'props',
			'homepage',
			'userSettings',
			'toggleOptions',
			'redLetter',
			'active',
		]);

		if (
			redLetter !==
			this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])
		) {
			toggleWordsOfJesus(redLetter);
		}

		if (
			activeTheme !==
			this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])
		) {
			applyTheme(activeTheme);
		}

		if (activeFontFamily !== this.props.userSettings.get('activeFontType')) {
			applyFontFamily(activeFontFamily);
		}

		if (activeFontSize !== this.props.userSettings.get('activeFontSize')) {
			applyFontSize(activeFontSize);
		}
		/* eslint-disable no-undef */
		if (this.props.homepage.firstLoad) {
			// Move these to single saga that runs them all in parallel
			// this.props.dispatch(getCountries());
			// this.props.dispatch(getLanguages());
			// this.props.dispatch(getTexts({ languageISO: this.props.homepage.defaultLanguageIso }));
			this.props.dispatch(
				initApplication({
					languageISO: this.props.homepage.defaultLanguageIso,
				}),
			);
			this.toggleFirstLoadForTextSelection();
		}
		try {
			((d, s, id) => {
				let js = d.getElementsByTagName(s)[0];
				const fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.12&appId=${
					process.env.FB_APP_ID
				}&autoLogAppEvents=1`;
				fjs.parentNode.insertBefore(js, fjs);
			})(document, 'script', 'facebook-jssdk');
			// Init the Facebook api here
			if (!this.props.userId) {
				window.fbAsyncInit = () => {
					FB.init({
						appId: process.env.FB_APP_ID,
						autoLogAppEvents: true,
						cookie: true,
						xfbml: true,
						version: 'v2.12',
					});
				};
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Error initializing fb api', err); // eslint-disable-line no-console
			}
		}

		try {
			// May need to create a script and append it to the dom then wait for it to finish loading
			if (!this.props.userId) {
				gapi.load('auth2', () => {
					// console.log('gapi loaded');
					window.auth2 = gapi.auth2.init({
						client_id:
							process.env.NODE_ENV === 'development'
								? process.env.GOOGLE_APP_ID
								: process.env.GOOGLE_APP_ID_PROD || '',
						scope: 'profile',
					});
					// console.log('auth 2 has been initialized', auth2);
				});
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Error initializing google api', err); // eslint-disable-line no-console
			}
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
		// console.log('join is defined now', join);
		if (browserObject.agent === 'msie') {
			// console.log('This is ie 11');
			// console.log('svg for every', svg4everybody);
			this.props.dispatch(setUA());
			svg4everybody();
		}
	}
	// Component updates when the state and props haven't changed 2 of 5 times
	// If there is a significant slow down we may need to do some deep equality checks on the state
	// componentDidUpdate(prevProps, prevState) {
	// 	console.log('previous props', prevProps);
	// 	console.log('current props', this.props);
	// 	console.log('current props equal to previous props', isEqual(this.props, prevProps));
	// 	console.log('previous state', prevState);
	// 	console.log('current state', this.state);
	// 	console.log('current state equal to previous state', isEqual(this.state, prevState));
	// }
	// The current version of the below function is gross and prone to breaking
	// This function needs to solve the issue of requesting the new data from the api when a new version is clicked
	// Need to fix how many times this gets called. The main issue is all the state that is managed by this one thing
	// c = 0
	componentWillReceiveProps(nextProps) {
		// Deals with updating page based on the url params
		// console.log('Received props --------------------------------------');

		// previous props
		const { params } = this.props.match;
		// next props
		const { params: nextParams } = nextProps.match;
		// console.log('prev and next match\n', this.props.match, '\n', nextProps.match);
		const { userAuthenticated, userId } = nextProps;
		if (
			nextParams.token &&
			userId &&
			userAuthenticated &&
			!(
				this.props.userId === userId &&
				this.props.userAuthenticated === userAuthenticated
			)
		) {
			// Reset the password because currently has a token but the user id has changed so the password was reset successfully
			// console.log('Replacing history');

			this.props.history.replace(
				`/${localStorage.getItem('bible_is_1_bible_id') ||
					'engesv'}/${localStorage.getItem('bible_is_2_book_id') ||
					'mat'}/${localStorage.getItem('bible_is_3_chapter') || '1'}`,
			);
		}
		if (!isEqual(params, nextParams)) {
			// if the route isn't the same as before find which parts changed
			const newChapter = params.chapter !== nextParams.chapter;
			const newBook = params.bookId !== nextParams.bookId;
			const newBible = params.bibleId !== nextParams.bibleId;

			// Default each of these to an empty map to avoid an error being thrown
			const {
				nextBook = fromJS({}),
				previousBook = fromJS({}),
				activeBook = fromJS({}),
			} = nextProps;
			const { activeChapter } = nextProps.homepage.activeChapter;
			// console.log('typeof activeChapter', typeof activeChapter);
			// console.log(nextBook, previousBook, activeBook);

			const nextBookId = nextBook.get('book_id');
			const prevBookId = previousBook.get('book_id');
			let nextChapter = activeChapter + 1;
			let prevChapter = activeChapter - 1;

			if (!activeBook.getIn(['chapters', prevChapter])) {
				prevChapter = previousBook.getIn(['chapters', -1]);
			}

			if (!activeBook.getIn(['chapters', nextChapter])) {
				nextChapter = nextBook.getIn(['chapters', 0]);
			}
			// console.log('new bible', newBible);
			// console.log('new book', newBook);
			// console.log('new chapter', newChapter);
			// todo need to update the url if the parameters given weren't valid
			if (newBible) {
				// console.log('new bible');
				// Need to get the bible object with /bibles/[bibleId]
				// Need to send a request to get the audio and text once the previous request is done - (maybe handled in saga?)
				// Needs to preserve the current book and chapter to try and use it first
				// Needs to default to the first available book and chapter if the current option isn't available
				this.props.dispatch({
					type: 'getbible',
					bibleId: nextParams.bibleId,
					bookId: nextParams.bookId,
					chapter: nextParams.chapter,
					verse: nextParams.verse || '',
					authenticated: userAuthenticated,
					userId,
				});
			} else if (newBook) {
				// console.log('new book');
				// This needs to be here for the case when a user goes from Genesis 7 to Mark 7 via the dropdown menu
				// Need to get the audio and text for the new book /bibles/[bibleId]/[bookId]/chapter
				// Preserve current chapter and try to use it first
				// Default to first chapter if the new book doesn't have the current chapter
				// console.log('new book', nextProps.homepage.activeFilesets);
				this.props.dispatch({
					type: 'getchapter',
					filesets: nextProps.homepage.activeFilesets,
					bibleId: nextParams.bibleId,
					bookId: nextParams.bookId,
					chapter: nextParams.chapter,
					verse: nextParams.verse || '',
					nextBookId,
					prevBookId,
					nextChapter,
					prevChapter,
					authenticated: userAuthenticated,
					userId,
				});
			} else if (newChapter) {
				// console.log('new chapter');
				// Need to get the audio and text for the new chapter /bibles/[bibleId]/[bookId]/chapter
				// if the chapter is not invalid default to first chapter of the current book
				this.props.dispatch({
					type: 'getchapter',
					filesets: nextProps.homepage.activeFilesets,
					bibleId: nextParams.bibleId,
					bookId: nextParams.bookId,
					chapter: nextParams.chapter,
					verse: nextParams.verse || '',
					nextBookId,
					prevBookId,
					nextChapter,
					prevChapter,
					authenticated: userAuthenticated,
					userId,
				});
			}
		} else if (
			this.props.homepage.activeBookId !== nextProps.homepage.activeBookId
		) {
			// console.log('Book changed');

			// Deals with when the new text doesn't have the same book
			// Still using the verse param since it may not have been set in the homepage object yet
			this.props.history.replace(
				`/${nextProps.homepage.activeTextId.toLowerCase()}/${nextProps.homepage.activeBookId.toLowerCase()}/${
					nextProps.homepage.activeChapter
				}${nextParams.verse ? `/${nextParams.verse}` : ''}`,
			);
			// console.log('route that I pushed', `/${nextProps.homepage.activeTextId}/${nextProps.homepage.activeBookId}/${nextProps.homepage.activeChapter}`);
		} else if (
			this.props.homepage.activeChapter !== nextProps.homepage.activeChapter &&
			nextProps.homepage.activeChapter !== nextParams.chapter
		) {
			// console.log('chapter changed both in params and props');
			// Need to account for if the verse changed here
			// If the chapters are different
			if (
				nextParams.verse !== nextProps.homepage.activeVerse &&
				nextParams.verse
			) {
				// console.log('The verses were different as well so I am not updating the url');
				this.props.history.replace(
					`/${nextParams.bibleId.toLowerCase()}/${nextParams.bookId.toLowerCase()}/${
						nextParams.chapter
					}${nextParams.verse ? `/${nextParams.verse}` : ''}`,
				);
			} else {
				this.props.history.replace(
					`/${nextProps.homepage.activeTextId.toLowerCase()}/${nextProps.homepage.activeBookId.toLowerCase()}/${
						nextProps.homepage.activeChapter
					}${
						nextProps.homepage.activeVerse
							? `/${nextProps.homepage.activeVerse}`
							: ''
					}`,
				);
			}
		} else if (
			isEqual(params, nextParams) &&
			this.props.homepage.activeBookId === nextProps.homepage.activeBookId &&
			this.props.homepage.activeChapter === nextProps.homepage.activeChapter &&
			this.props.homepage.activeTextId === nextProps.homepage.activeTextId
		) {
			// If url did not change && bibleId, bookId and chapter in props did not change - Might need to include verse as well...
			// This section may not work with SSR because the state might be persisted through a refresh
			// console.log('Url did not change and current props equal next props');

			// console.log('this.props.homepage.activeVerse', this.props.homepage.activeVerse);

			// Handles the cases where the url needs to be updated
			const nextPropUrl = `/${nextProps.homepage.activeTextId.toLowerCase()}/${nextProps.homepage.activeBookId.toLowerCase()}/${
				nextProps.homepage.activeChapter
			}`;
			const nextParamUrl = `/${nextParams.bibleId}/${nextParams.bookId}/${
				nextParams.chapter
			}`;
			const curPropUrl = `/${this.props.homepage.activeTextId.toLowerCase()}/${this.props.homepage.activeBookId.toLowerCase()}/${
				this.props.homepage.activeChapter
			}`;
			const curParamUrl = `/${params.bibleId}/${params.bookId}/${
				params.chapter
			}`;

			const propsExist =
				nextProps.homepage.activeChapter &&
				nextProps.homepage.activeBookId &&
				nextProps.homepage.activeTextId;
			// if there are props in the next state of the application
			// and the next props do not match the next url
			// and the current url does not match the current props
			if (
				propsExist &&
				nextPropUrl !== nextParamUrl &&
				curParamUrl !== curPropUrl &&
				nextParamUrl !== curParamUrl
			) {
				// console.log('Params do not match props', nextPropUrl !== nextParamUrl, !(curParamUrl === curPropUrl));
				// there are props, the current props and params match, the next params are different, the next props do not equal the next params
				// console.log('there are props, the current props and params match, the next params are different, the next props do not equal the next params');

				// Redirect to the appropriate url
				this.props.history.replace(
					`/${nextProps.homepage.activeTextId.toLowerCase()}/${nextProps.homepage.activeBookId.toLowerCase()}/${
						nextProps.homepage.activeChapter
					}${
						nextProps.homepage.activeVerse
							? `/${nextProps.homepage.activeVerse}`
							: ''
					}`,
				);
			}
		}

		// Deals with updating the interface if a user is authenticated or added highlights
		const {
			activeTextId,
			activeBookId,
			activeChapter,
			// highlights,
		} = nextProps.homepage;
		// console.log('nextHighlights', highlights);
		// console.log('prevHighlights', this.props.homepage.highlights);
		// Need to get a users highlights if they just sign in or reset the highlights if they just signed out
		if (userAuthenticated !== this.props.userAuthenticated) {
			this.props.dispatch(
				getHighlights({
					bible: activeTextId,
					book: activeBookId,
					chapter: activeChapter,
					userAuthenticated,
					userId,
				}),
			);
			if (userId) {
				// console.log('getting the notes', userId);
				this.props.dispatch(
					getNotes({
						userId,
						params: {
							bible_id: activeTextId,
							book_id: activeBookId,
							chapter: activeChapter,
							limit: 150,
							page: 1,
						},
					}),
				);
				this.props.dispatch(
					getBookmarksForChapter({
						userId,
						params: {
							bible_id: activeTextId,
							book_id: activeBookId,
							chapter: activeChapter,
							limit: 150,
							page: 1,
						},
					}),
				);
			}
		}
		// I am not sure what I thought this was for... I think I don't need it
		// } else if (!isEqual(highlights, this.props.homepage.highlights)) {
		// 	console.log('getting the highlights');
		// 	this.props.dispatch(getHighlights({
		// 		bible: activeTextId,
		// 		book: activeBookId,
		// 		chapter: activeChapter,
		// 		userAuthenticated,
		// 		userId,
		// 	}));
		// }
		// Below code is for when the same version is selected but the audio type is changed
		if (
			!isEqual(
				nextProps.homepage.activeFilesets,
				this.props.homepage.activeFilesets,
			) &&
			nextProps.homepage.activeTextId === this.props.homepage.activeTextId
		) {
			// do something
			// console.log('this.props.homepage.activeFilesets', this.props.homepage.activeFilesets);
			//
			// console.log('filesets changed', nextProps.homepage.activeFilesets);
			this.props.dispatch({
				type: 'getaudio',
				filesets: nextProps.homepage.activeFilesets,
				bookId: nextParams.bookId,
				chapter: nextParams.chapter,
			});
		}

		// Resets application to english standard version genesis 1 in the case an invalid bible id was used
		// Commented out because it may be worse to re-route rather than display an error message
		// if (nextProps.homepage.invalidBibleId && !this.props.homepage.invalidBibleId) {
		// 	this.props.history.replace('/engesv/gen/1');
		// }
	}

	setNextVerse = (verse) => {
		const { bibleId, bookId, chapter } = this.props.match.params;
		const { chapterText } = this.props.homepage;
		const nextVerse = parseInt(verse, 10) + 1 || 1;
		const lastVerse = chapterText.length;
		// Is it past the max verses for the chapter?
		// if not increment it by 1
		if (nextVerse <= lastVerse && nextVerse > 0) {
			this.props.history.push(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${nextVerse}`,
			);
		} else if (nextVerse < 0) {
			this.props.history.replace(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/1`,
			);
		} else if (nextVerse > lastVerse) {
			this.props.history.replace(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${lastVerse}`,
			);
		}
	};

	setPrevVerse = (verse) => {
		const { bibleId, bookId, chapter } = this.props.match.params;
		const { chapterText } = this.props.homepage;
		const prevVerse = parseInt(verse, 10) - 1 || 1;
		const lastVerse = chapterText.length;
		// Is it past the max verses for the chapter?
		// if not increment it by 1
		if (prevVerse <= lastVerse && prevVerse > 0) {
			this.props.history.push(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${prevVerse}`,
			);
		} else if (prevVerse < 0) {
			this.props.history.replace(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/1`,
			);
		} else if (prevVerse > lastVerse) {
			this.props.history.replace(
				`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${lastVerse}`,
			);
		}
	};

	getNextChapter = () => {
		const { activeTextId, activeChapter, activeBookId } = this.props.homepage;
		const { activeBook, nextBook } = this.props;
		const verseNumber = this.props.match.params.verse || '';
		const maxChapter = activeBook.getIn(['chapters', -1]);

		if (verseNumber) {
			this.setNextVerse(verseNumber);
			return;
		}
		// If the next book in line doesn't exist and we are already at the last chapter just return
		if (!nextBook.size && activeChapter === maxChapter) {
			return;
		}

		if (activeChapter === maxChapter) {
			this.setActiveBookName({
				book: nextBook.get('name'),
				id: nextBook.get('book_id'),
			});
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: nextBook.get('book_id'), chapter: 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(nextBook.getIn(['chapters', 0]));
			this.props.history.push(
				`/${activeTextId.toLowerCase()}/${nextBook
					.get('book_id')
					.toLowerCase()}/${nextBook.getIn(['chapters', 0])}`,
			);
		} else {
			const activeChapterIndex = activeBook
				.get('chapters')
				.findIndex((c) => c === activeChapter || c > activeChapter);
			const nextChapterIndex =
				activeBook.getIn(['chapters', activeChapterIndex]) === activeChapter
					? activeChapterIndex + 1
					: activeChapterIndex;

			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter + 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(activeBook.getIn(['chapters', nextChapterIndex]));
			this.props.history.push(
				`/${activeTextId.toLowerCase()}/${activeBookId.toLowerCase()}/${activeBook.getIn(
					['chapters', nextChapterIndex],
				)}`,
			);
		}
	};

	getPrevChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			books,
		} = this.props.homepage;
		const { previousBook, activeBook } = this.props;
		const verseNumber = this.props.match.params.verse || '';

		if (verseNumber) {
			this.setPrevVerse(verseNumber);
			return;
		}
		// Keeps the button from trying to go backwards to a book that doesn't exist
		if (activeBookId === books[0].book_id && activeChapter - 1 === 0) {
			return;
		}
		// Goes to the previous book in the bible in canonical order from the current book
		if (activeChapter - 1 === 0) {
			const lastChapter = previousBook.getIn(['chapters', -1]);

			this.setActiveBookName({
				book: previousBook.get('name'),
				id: previousBook.get('book_id'),
			});
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: previousBook.get('book_id'), chapter: lastChapter, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(lastChapter);
			this.props.history.push(
				`/${activeTextId.toLowerCase()}/${previousBook
					.get('book_id')
					.toLowerCase()}/${lastChapter}`,
			);
			// Goes to the previous Chapter
		} else {
			// If the chapter number is greater than the active chapter then weve gone too far and need to get the previous chapter
			const activeChapterIndex = activeBook
				.get('chapters')
				.findIndex((c) => c === activeChapter || c > activeChapter);
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter - 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(
				activeBook.getIn(['chapters', activeChapterIndex - 1]),
			);
			this.props.history.push(
				`/${activeTextId.toLowerCase()}/${activeBookId.toLowerCase()}/${activeBook.getIn(
					['chapters', activeChapterIndex - 1],
				)}`,
			);
		}
	};

	getBooks = (props) => this.props.dispatch(getBooks(props));

	getChapters = (props) => this.props.dispatch(getChapterText(props));

	getCopyrights = (props) => this.props.dispatch(getCopyrights(props));

	setActiveBookName = ({ book, id }) =>
		this.props.dispatch(setActiveBookName({ book, id }));

	setActiveChapter = (chapter) =>
		this.props.dispatch(setActiveChapter(chapter));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props));

	setActiveNotesView = (view) => this.props.dispatch(setActiveNotesView(view));

	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }));

	setAudioPlayerState = (state) =>
		this.props.dispatch(setAudioPlayerState(state));

	resetPasswordSent = () => {
		// console.log('replacing history');
		// this.props.history.replace(`/${localStorage.getItem('bible_is_1_bible_id') || 'engesv'}/${localStorage.getItem('bible_is_2_book_id') || 'mat'}/${localStorage.getItem('bible_is_3_chapter') || '1'}`)
	};

	goToFullChapter = () => {
		const { bibleId, bookId, chapter } = this.props.match.params;

		this.props.history.push(`/${bibleId}/${bookId}/${chapter}`);
	};

	addBookmark = (data) => this.props.dispatch(addBookmark({ ...data }));

	addHighlight = (props) =>
		this.props.dispatch(
			addHighlight({
				...props,
				bible: this.props.homepage.activeTextId,
				userId: this.props.userId,
			}),
		);

	deleteHighlights = (props) =>
		this.props.dispatch(
			deleteHighlights({
				...props,
				bible: this.props.homepage.activeTextId,
				userId: this.props.userId,
				book: this.props.homepage.activeBookId,
				chapter: this.props.homepage.activeChapter,
			}),
		);

	toggleFirstLoadForTextSelection = () =>
		this.props.homepage.firstLoad &&
		this.props.dispatch(toggleFirstLoadForTextSelection());

	toggleProfile = () => this.props.dispatch(toggleProfile());

	toggleNotesModal = () => this.props.dispatch(toggleNotesModal());

	toggleAutoPlay = () => this.props.dispatch(toggleAutoPlay());

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal());

	toggleSearchModal = () => this.props.dispatch(toggleSearchModal());

	toggleChapterSelection = () => this.props.dispatch(toggleChapterSelection());

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection());

	toggleInformationModal = () => this.props.dispatch(toggleInformationModal());

	render() {
		const {
			audioPaths,
			audioSource,
			activeBookId,
			activeTextId,
			activeChapter,
			activeFilesets,
			audioFilesetId,
			activeTextName,
			activeBookName,
			activeNotesView,
			autoPlayEnabled,
			audioPlayerState,
			books,
			copyrights,
			formattedTextFilesetId,
			highlights,
			invalidBibleId,
			isProfileActive,
			isNotesModalActive,
			isSearchModalActive,
			isSettingsModalActive,
			isVersionSelectionActive,
			isChapterSelectionActive,
			isInformationModalActive,
			loadingNewChapterText,
			nextAudioSource,
			prevAudioSource,
			plainTextFilesetId,
			userAgent,
			textDirection,
			// chapterText: updatedText,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
			userId,
			userAuthenticated,
			// highlights,
			// updatedText,
		} = this.props;

		const { userNotes, bookmarks, text: updatedText } = this.props.textData;
		// console.log('text', updatedText);
		// console.log('Homepage re-rendered bc reasons');
		const token = this.props.match.params.token || '';
		const verse = this.props.match.params.verse || '';

		return (
			<GenericErrorBoundary affectedArea="Homepage">
				<Helmet
					meta={[
						{
							name: 'description',
							content: 'Main page for the Bible.is web app',
						},
						{
							property: 'og:title',
							content: `${activeBookName} ${activeChapter}${
								verse ? `:${verse}` : ''
							}`,
						},
						{ property: 'og:url', content: window.location.href },
						{
							property: 'og:description',
							content: 'Main page for the Bible.is web app',
						},
						{ property: 'og:type', content: 'website' },
						{ property: 'og:site_name', content: 'Bible.is' },
						{ property: 'og:image', content: logo },
					]}
				>
					<title>
						{`${activeBookName} ${activeChapter}${verse ? `:${verse}` : ''}`} |
						Bible.is
					</title>
					<meta
						name="description"
						content="Main page for the Bible.is web app"
					/>
				</Helmet>
				<NavigationBar
					userAgent={userAgent}
					activeTextId={activeTextId}
					activeChapter={activeChapter}
					activeTextName={activeTextName}
					activeBookName={activeBookName}
					theme={userSettings.get('activeTheme')}
					isChapterSelectionActive={isChapterSelectionActive}
					isVersionSelectionActive={isVersionSelectionActive}
					toggleChapterSelection={this.toggleChapterSelection}
					toggleVersionSelection={this.toggleVersionSelection}
				/>
				<AudioPlayer
					audioPaths={audioPaths}
					autoPlay={autoPlayEnabled}
					audioPlayerState={audioPlayerState}
					audioSource={audioSource}
					nextAudioSource={nextAudioSource}
					prevAudioSource={prevAudioSource}
					setAudioPlayerState={this.setAudioPlayerState}
					toggleAutoPlay={this.toggleAutoPlay}
					skipBackward={this.getPrevChapter}
					skipForward={this.getNextChapter}
				/>
				<TransitionGroup>
					{isSettingsModalActive ? (
						<FadeTransition
							classNames="slide-from-right"
							in={isSettingsModalActive}
						>
							<Settings
								userSettings={userSettings}
								toggleSettingsModal={this.toggleSettingsModal}
							/>
						</FadeTransition>
					) : null}
					{isProfileActive ? (
						<FadeTransition classNames="slide-from-left" in={isProfileActive}>
							<Profile
								resetPasswordSent={this.resetPasswordSent}
								userAccessToken={token}
								toggleProfile={this.toggleProfile}
							/>
						</FadeTransition>
					) : null}
					{isNotesModalActive ? (
						<FadeTransition
							classNames="slide-from-right"
							in={isNotesModalActive}
						>
							<Notes
								activeBookId={activeBookId}
								activeChapter={activeChapter}
								toggleProfile={this.toggleProfile}
								toggleNotesModal={this.toggleNotesModal}
								openView={activeNotesView}
							/>
						</FadeTransition>
					) : null}
					{isSearchModalActive ? (
						<FadeTransition
							classNames="slide-from-left"
							in={isSearchModalActive}
						>
							<SearchContainer
								bibleId={activeTextId}
								toggleSearchModal={this.toggleSearchModal}
							/>
						</FadeTransition>
					) : null}
				</TransitionGroup>
				<Text
					copyrights={copyrights}
					activeFilesets={activeFilesets}
					audioFilesetId={audioFilesetId}
					plainTextFilesetId={plainTextFilesetId}
					formattedTextFilesetId={formattedTextFilesetId}
					getCopyrights={this.getCopyrights}
					books={books}
					userId={userId}
					text={updatedText}
					verseNumber={verse}
					userNotes={userNotes}
					bookmarks={bookmarks}
					bibleId={activeTextId}
					highlights={highlights}
					audioSource={audioSource}
					activeBookId={activeBookId}
					userSettings={userSettings}
					textDirection={textDirection}
					activeChapter={activeChapter}
					invalidBibleId={invalidBibleId}
					activeBookName={activeBookName}
					notesActive={isNotesModalActive}
					formattedSource={formattedSource}
					audioPlayerState={audioPlayerState}
					userAuthenticated={userAuthenticated}
					informationActive={isInformationModalActive}
					loadingNewChapterText={loadingNewChapterText}
					addBookmark={this.addBookmark}
					addHighlight={this.addHighlight}
					nextChapter={this.getNextChapter}
					prevChapter={this.getPrevChapter}
					setActiveNote={this.setActiveNote}
					goToFullChapter={this.goToFullChapter}
					deleteHighlights={this.deleteHighlights}
					toggleNotesModal={this.toggleNotesModal}
					setActiveNotesView={this.setActiveNotesView}
					toggleInformationModal={this.toggleInformationModal}
				/>
				<Footer
					profileActive={isProfileActive}
					searchActive={isSearchModalActive}
					notebookActive={isNotesModalActive}
					settingsActive={isSettingsModalActive}
					toggleProfile={this.toggleProfile}
					toggleSearch={this.toggleSearchModal}
					toggleNotebook={this.toggleNotesModal}
					setActiveNotesView={this.setActiveNotesView}
					toggleSettingsModal={this.toggleSettingsModal}
				/>
			</GenericErrorBoundary>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
	activeBook: PropTypes.object,
	previousBook: PropTypes.object,
	nextBook: PropTypes.object,
	userSettings: PropTypes.object,
	formattedSource: PropTypes.object,
	history: PropTypes.object,
	match: PropTypes.object,
	// userNotes: PropTypes.object,
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.string,
	// text: PropTypes.object,
	textData: PropTypes.object,
	// updatedText: PropTypes.array,
	// highlights: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	previousBook: selectPrevBook(),
	nextBook: selectNextBook(),
	activeBook: selectActiveBook(),
	userSettings: selectSettings(),
	formattedSource: selectFormattedSource(),
	userAuthenticated: selectAuthenticationStatus(),
	userId: selectUserId(),
	textData: selectUserNotes(),
	// highlights: selectHighlights(),
	// userNotes: selectUserNotes(),
	// text: selectUserNotes(),
	// updatedText: selectChapterText(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(
	mapStateToProps,
	mapDispatchToProps,
);

// Defeats the purpose of code splitting - need to figure out a different method to reduce bundle size
const withReducer = injectReducer({ key: 'homepage', reducer });
const withSaga = injectSaga({ key: 'homepage', saga });
const withTextReducer = injectReducer({
	key: 'textSelection',
	reducer: textReducer,
});
const withTextSaga = injectSaga({ key: 'textSelection', saga: textSaga });
const withNotesReducer = injectReducer({ key: 'notes', reducer: notesReducer });
// const withNotesSaga = injectSaga({ key: 'notes', saga: notesSaga });

export default compose(
	withReducer,
	withTextReducer,
	withNotesReducer,
	withSaga,
	withTextSaga,
	// withNotesSaga,
	withConnect,
)(HomePage);
