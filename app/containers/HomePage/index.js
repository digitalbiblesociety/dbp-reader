/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

// import { fromJS, is } from 'immutable';
// import TextSelection from 'containers/TextSelection';
// import ChapterSelection from 'containers/ChapterSelection';
// import MenuBar from 'components/MenuBar';
// import messages from './messages';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
// import AnimateHeight from 'react-animate-height';
// import { fromJS } from 'immutable';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import Settings from '../Settings';
import AudioPlayer from '../AudioPlayer';
import Profile from '../Profile';
import Notes from '../Notes';
import Text from '../Text';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import SearchContainer from '../SearchContainer';
import GenericErrorBoundary from '../../components/GenericErrorBoundary';
import SubFooter from '../../components/SubFooter';
import FadeTransition from '../../components/FadeTransition';
// import logo from '../../../static/favicon-96x96.png';
import svg4everybody from '../../utils/svgPolyfill';
// import fetch from 'isomorphic-fetch'
// import {
// 	statusChangeCallback,
// 	checkLoginState,
// } from 'utils/facebookFunctions';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from '../Settings/themes';
// import {
// 	getCountries,
// 	getLanguages,
// 	getTexts,
// } from '../TextSelection/actions';
// import differenceObject from 'utils/deepDifferenceObject';
import notesReducer from '../Notes/reducer';
import textReducer from '../TextSelection/reducer';
// import notesSaga from '../Notes/saga';
import textSaga from '../TextSelection/saga';
import { getBookmarksForChapter, addBookmark } from '../Notes/actions';
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
	// selectPrevBook,
	// selectNextBook,
	// selectActiveBook,
	selectFormattedSource,
	selectAuthenticationStatus,
	selectUserId,
	selectMenuOpenState,
	selectUserNotes,
	// selectHighlights,
	// selectChapterText,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

class HomePage extends React.PureComponent {
	state = {
		isScrollingDown: false,
		subFooterOpen: false,
		footerDistance: 0,
		heightDifference: 0,
	};
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// Get the first bible based on the url here
		// console.log('Component did mount');

		const {
			activeFilesets,
			activeBookId,
			activeChapter,
			activeTextId,
			userAuthenticated,
			userId,
		} = this.props.homepage;
		// May want to use replace here at some point
		this.props.dispatch({
			type: 'getaudio',
			filesets: activeFilesets,
			bookId: activeBookId,
			chapter: activeChapter,
		});

		this.getCopyrights({ filesetIds: activeFilesets });

		if (userId && userAuthenticated) {
			// console.log('User was signed in by getInitialProps');

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
		} else {
			// console.log('localStorage.getItem(user_id)', localStorage.getItem('bible_is_user_id'));
			// console.log('sessionStorage.getItem(user_id)', sessionStorage.getItem('bible_is_user_id'));
			const sessionId =
				localStorage.getItem('bible_is_user_id') ||
				sessionStorage.getItem('bible_is_user_id');
			this.props.dispatch(
				getHighlights({
					bible: activeTextId,
					book: activeBookId,
					chapter: activeChapter,
					userAuthenticated: !!sessionId,
					userId: sessionId,
				}),
			);
			if (sessionId) {
				// console.log('getting the notes', userId: sessionId);
				this.props.dispatch(
					getNotes({
						userId: sessionId,
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
						userId: sessionId,
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

		if (this.props.match.params.token) {
			// Open Profile
			this.toggleProfile();
			// Give profile the token - done in render
			// Open Password Reset Verified because there is a token - done in Profile/index
		}
		// } else {
		// Defaulting to esv until browser language detection is implemented
		// console.log('redirecting from else in did mount');
		// 	const sessionBibleId = sessionStorage.getItem('bible_is_1_bible_id');
		// 	const sessionBookId = sessionStorage.getItem('bible_is_2_book_id');
		// 	const sessionChapter = sessionStorage.getItem('bible_is_3_chapter');
		//
		// 	if (sessionBibleId && sessionBookId && sessionChapter) {
		// 		// this.props.history.replace(
		// 		// 	`/${sessionBibleId}/${sessionBookId}/${sessionChapter}`,
		// 		// );
		// 	} else {
		// 		// this.props.history.replace('/engesv/mat/1');
		// 	}
		// }

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
					try {
						window.auth2 = gapi.auth2.init({
							client_id:
								process.env.NODE_ENV === 'development'
									? process.env.GOOGLE_APP_ID
									: process.env.GOOGLE_APP_ID_PROD || 'no_client',
							scope: 'profile',
						});
					} catch (err) {
						// if (process.env.NODE_ENV === 'development') {
						// 	console.warn(
						// 		// eslint-disable-line no-console
						// 		'Error initializing google api caught in inner try',
						// 		err,
						// 	);
						// }
					}
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

		if (window && document && document.firstElementChild) {
			// console.log('Added scroll listener');
			// Main can be unset in this instance
			this.main = document.getElementsByTagName('main')[0];
			window.addEventListener('scroll', this.handleScrolling, true);
		}

		// Should move these to being tracked in state or move them to media queries
		this.isMobileSized = () =>
			window &&
			document &&
			document.firstElementChild &&
			document.firstElementChild.clientWidth < 500;

		this.isLargeBp = () =>
			window &&
			document &&
			document.firstElementChild &&
			document.firstElementChild.clientWidth > 500 &&
			document.firstElementChild.clientWidth < 1001;

		this.isAudioPlayerBp = () =>
			window &&
			document &&
			document.firstElementChild &&
			document.firstElementChild.clientWidth > 500 &&
			document.firstElementChild.clientWidth < 551;
		// console.log('props in did mount home', this.props);
	}
	// Component updates when the state and props haven't changed 2 of 5 times
	// If there is a significant slow down we may need to do some deep equality checks on the state
	// Need to fix how many times this gets called. The main issue is all the state that is managed by this one thing
	componentWillReceiveProps(nextProps) {
		// Deals with updating page based on the url params
		// Should probably try to batch process any state updates at the end of this function
		// console.log('Received props --------------------------------------');

		this.setState({ subFooterOpen: false });
		// next props
		const nextMatch = nextProps.match || {
			params: {
				token: '',
				verse: '',
				chapter: 1,
				bookId: 'MAT',
				bibleId: 'ENGESV',
			},
		};
		const { params: nextParams } = nextMatch;

		// Deals with updating the interface if a user is authenticated or added highlights
		const {
			activeTextId,
			activeBookId,
			activeChapter,
			userAuthenticated,
			userId,
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
	}

	componentWillUnmount() {
		// Even though for this function to fire the user has to refresh
		// the entire page it is good practice to remove any lingering
		// event listeners
		window.removeEventListener('scroll', this.handleScrolling, true);
	}

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

	// May need more than one to determine the different audio player heights
	isMobileSized() {
		// console.log('resized mobile');
		return true;
	}

	isLargeBp() {
		// console.log('resized large');
		return false;
	}

	isAudioPlayerBp() {
		// console.log('resized audio');
		return false;
	}

	// Height of the entire scroll container including the invisible portions
	get mainHeight() {
		return Math.max(
			this.main.offsetHeight,
			this.main.clientHeight,
			this.main.scrollHeight,
		);
	}
	// Height of the visible portion of the scroll container
	get mainPhysicalHeight() {
		// console.log('this.main.offsetHeight', this.main.offsetHeight);
		// console.log('this.main.clientHeight', this.main.clientHeight);
		// console.log(
		// 	'Math.max(this.main.offsetHeight, this.main.clientHeight)',
		// 	Math.max(this.main.offsetHeight, this.main.clientHeight),
		// );

		return Math.max(this.main.offsetHeight, this.main.clientHeight);
	}

	// The current scroll position
	get scrollTop() {
		// console.log('main', document.getElementsByTagName('main')[0]);
		// console.log(
		// 	'scroll top main',
		// 	document.getElementsByTagName('main')[0].scrollTop,
		// );
		return this.main.scrollTop;
	}

	// If the scroll event would result in a value above or below the actual size of the container
	get outOfBounds() {
		// console.log(
		// 	'Bounds::: this.mainPhysicalHeight',
		// 	this.mainPhysicalHeight + this.scrollTop,
		// );
		// console.log('Bounds::: this.mainHeight - 50', this.mainHeight - 50);
		// console.log(
		// 	'Bounds::: this.scrollTop + this.mainPhysicalHeight >= this.mainHeight - 50',
		// 	this.scrollTop + this.mainPhysicalHeight >= this.mainHeight - 50,
		// );

		return (
			this.scrollTop + this.mainPhysicalHeight >= this.mainHeight ||
			this.scrollTop < 5
		);
	}

	get isAtTop() {
		return this.scrollTop < 5;
	}

	get isAtBottom() {
		// console.log('this.mainHeight - 50', this.mainHeight - 50);
		// console.log(
		// 	'this.mainPhysicalHeight',
		// 	this.mainPhysicalHeight + this.scrollTop,
		// );
		// console.log(
		// 	'this.scrollTop + this.mainPhysicalHeight >= this.mainHeight - 50',
		// 	this.scrollTop + this.mainPhysicalHeight >= this.mainHeight - 50,
		// );

		return this.scrollTop + this.mainPhysicalHeight >= this.mainHeight;
	}

	handleHeightRef = (el) => {
		this.heightRef = el;
	};

	handleScrolling = () => {
		// Only hides the header/footer if all of the menus are closed
		if (
			!this.scrollTicking &&
			!this.props.homepage.isProfileActive &&
			!this.props.homepage.isNotesModalActive &&
			!this.props.homepage.isSearchModalActive &&
			!this.props.homepage.isSettingsModalActive &&
			!this.props.homepage.isVersionSelectionActive &&
			!this.props.homepage.isChapterSelectionActive &&
			!this.props.homepage.isInformationModalActive
		) {
			// console.log('scroll scrollticking');
			// Using this value to determine when the animation frame completed
			this.scrollTicking = true;
			requestAnimationFrame(this.updateScrollDirection);
		}
	};

	updateScrollDirection = () => {
		this.main = document.getElementsByTagName('main')[0];
		// const distance = this.isMobileSized ? 211 : 64;
		// const difference =
		// 	this.mainHeight - (this.scrollTop + this.mainPhysicalHeight);
		// console.log('difference', difference);
		// console.log('distance', distance);
		// console.log('difference <= distance', difference <= distance);
		// if (this.isAtBottom && !this.secondAnimFrame) {
		// 	this.secondAnimframe = true;
		// 	requestAnimationFrame(this.handleAtBottom);
		// } else if (!this.isAtBottom && this.subIsInView) {
		// 	this.secondAnimFrame = true;
		// 	requestAnimationFrame(this.handleAtBottom);
		// }
		// Height that scrollTop needs to be within for the sub footer to activate
		// if (difference <= distance) {
		// 	// console.log(
		// 	// 	'diff for height',
		// 	// 	Math.max(this.heightRef.offsetHeight, this.heightRef.clientHeight) -
		// 	// 		(Math.max(this.heightRef.offsetHeight, this.heightRef.clientHeight) -
		// 	// 			(distance - difference)),
		// 	// );
		//
		// 	this.setState({
		// 		footerDistance: distance - difference,
		// 		heightDifference:
		// 			Math.max(this.heightRef.offsetHeight, this.heightRef.clientHeight) -
		// 			(distance - difference),
		// 	});
		// } else if (this.state.footerDistance) {
		// 	this.setState({
		// 		footerDistance: 0,
		// 	});
		// }

		const resizeHeight = 0;
		if (!this.outOfBounds) {
			// console.log('this.state.isScrollingDown', this.state.isScrollingDown);
			// Previous state was not scrolling down but new state is
			if (
				this.scrollTop >= this.previousScrollTop &&
				!this.state.isScrollingDown &&
				!(
					this.scrollTop + this.mainPhysicalHeight >=
					this.mainHeight - resizeHeight
				)
			) {
				this.setState(
					{
						subFooterOpen:
							this.scrollTop + this.mainPhysicalHeight >
							this.mainHeight - resizeHeight,
						isScrollingDown: !!this.isMobileSized,
					},
					() => {
						// console.log('Setting new prev scroll and stuff for down');

						this.previousScrollTop = this.scrollTop;
						this.scrollTicking = false;
					},
				);
				// New state is scrolling up and old state is scrolling down
			} else if (
				this.scrollTop < this.previousScrollTop &&
				this.state.isScrollingDown
			) {
				this.setState(
					{
						subFooterOpen:
							this.scrollTop + this.mainPhysicalHeight >
							this.mainHeight - resizeHeight,
						isScrollingDown: false,
					},
					() => {
						// console.log('Setting new prev scroll and stuff for up');

						this.previousScrollTop = this.scrollTop;
						this.scrollTicking = false;
					},
				);
			} else if (
				this.scrollTop + this.mainPhysicalHeight >=
				this.mainHeight - resizeHeight
			) {
				this.setState(
					{
						isScrollingDown: false,
					},
					() => {
						this.previousScrollTop = this.scrollTop;
						this.scrollTicking = false;
					},
				);
			} else {
				this.setState(
					{
						subFooterOpen:
							this.scrollTop + this.mainPhysicalHeight >
							this.mainHeight - resizeHeight,
					},
					() => {
						// console.log('Setting new prev scroll and stuff for up');

						this.previousScrollTop = this.scrollTop;
						this.scrollTicking = false;
					},
				);
			}
		} else if (this.isAtTop || this.isAtBottom) {
			this.setState(
				{
					subFooterOpen:
						this.scrollTop + this.mainPhysicalHeight >
						this.mainHeight - resizeHeight,
					isScrollingDown: false,
				},
				() => {
					this.previousScrollTop = this.scrollTop;
					this.scrollTicking = false;
				},
			);
		} else {
			this.setState(
				{
					subFooterOpen:
						this.scrollTop + this.mainPhysicalHeight >
						this.mainHeight - resizeHeight,
				},
				() => {
					// console.log('Setting new prev scroll and stuff for up');

					this.previousScrollTop = this.scrollTop;
					this.scrollTicking = false;
				},
			);
		}
	};

	// This may be buggy if the function got called before the
	// dom was mounted but I have yet to experience any bugs
	previousScrollTop = this.main ? this.main.scrollTop : 0;

	scrollTicking = false;

	resetPasswordSent = () => {
		// We might still want this to try and provide a slightly better user experience
		// the idea is to take the user back to where they were once they reset their password
		// // this.props.history.replace(`/${localStorage.getItem('bible_is_1_bible_id') || 'engesv'}/${localStorage.getItem('bible_is_2_book_id') || 'mat'}/${localStorage.getItem('bible_is_3_chapter') || '1'}`)
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
			activeTextName,
			activeBookName,
			activeNotesView,
			autoPlayEnabled,
			audioPlayerState,
			books,
			highlights,
			invalidBibleId,
			isProfileActive,
			isNotesModalActive,
			isSearchModalActive,
			isSettingsModalActive,
			isVersionSelectionActive,
			isChapterSelectionActive,
			isInformationModalActive,
			userAgent,
			textDirection,
			loadingAudio,
			loadingCopyright,
			loadingNewChapterText,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
			userId,
			userAuthenticated,
			history,
			isMenuOpen,
			// highlights,
			// updatedText,
		} = this.props;

		const {
			isScrollingDown,
			subFooterOpen,
			// heightDifference: height,
			footerDistance: distance,
		} = this.state;
		// console.log('height diffs', height, distance);
		// const distance = 0;
		// const height = 0;

		const { userNotes, bookmarks, text: updatedText } = this.props.textData;
		// console.log('chapterText', chapterText);
		// console.log('updatedText', updatedText);
		// if (chapterText) {
		// 	console.log('chapterText.length', chapterText.length);
		// }
		// if (updatedText) {
		// 	console.log('updatedText.length', updatedText.length);
		// }
		// console.log('text', updatedText);
		// console.log('Homepage re-rendered bc reasons');
		const token = this.props.match.params.token || '';
		const verse = this.props.match.params.verse || '';
		// const token = '';
		// const verse = '';

		return (
			<GenericErrorBoundary affectedArea="Homepage">
				<div ref={this.handleHeightRef} className={'homepage'}>
					<NavigationBar
						userAgent={userAgent}
						activeTextId={activeTextId}
						activeChapter={activeChapter}
						activeTextName={activeTextName}
						activeBookName={activeBookName}
						theme={userSettings.get('activeTheme')}
						isScrollingDown={isScrollingDown}
						isChapterSelectionActive={isChapterSelectionActive}
						isVersionSelectionActive={isVersionSelectionActive}
						toggleChapterSelection={this.toggleChapterSelection}
						toggleVersionSelection={this.toggleVersionSelection}
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
									history={history}
									books={books}
									toggleSearchModal={this.toggleSearchModal}
								/>
							</FadeTransition>
						) : null}
					</TransitionGroup>
					<Text
						books={books}
						userId={userId}
						text={updatedText}
						distance={distance}
						verseNumber={verse}
						userNotes={userNotes}
						bookmarks={bookmarks}
						bibleId={activeTextId}
						menuIsOpen={isMenuOpen}
						highlights={highlights}
						audioSource={audioSource}
						activeTextId={activeTextId}
						activeBookId={activeBookId}
						loadingAudio={loadingAudio}
						userSettings={userSettings}
						activeChapter={activeChapter}
						textDirection={textDirection}
						subFooterOpen={subFooterOpen}
						invalidBibleId={invalidBibleId}
						activeBookName={activeBookName}
						notesActive={isNotesModalActive}
						formattedSource={formattedSource}
						isScrollingDown={isScrollingDown}
						audioPlayerState={audioPlayerState}
						loadingCopyright={loadingCopyright}
						userAuthenticated={userAuthenticated}
						informationActive={isInformationModalActive}
						loadingNewChapterText={loadingNewChapterText}
						isLargeBp={this.isLargeBp()}
						isMobileBp={this.isMobileSized()}
						addBookmark={this.addBookmark}
						addHighlight={this.addHighlight}
						setActiveNote={this.setActiveNote}
						getCopyrights={this.getCopyrights}
						isAudioPlayerBp={this.isAudioPlayerBp()}
						toggleNotesModal={this.toggleNotesModal}
						deleteHighlights={this.deleteHighlights}
						setActiveNotesView={this.setActiveNotesView}
						toggleInformationModal={this.toggleInformationModal}
					/>
					<AudioPlayer
						audioPaths={audioPaths}
						autoPlay={autoPlayEnabled}
						audioPlayerState={audioPlayerState}
						audioSource={audioSource}
						isScrollingDown={isScrollingDown}
						subFooterOpen={subFooterOpen}
						books={books}
						text={updatedText}
						verseNumber={verse}
						activeTextId={activeTextId}
						activeBookId={activeBookId}
						activeChapter={activeChapter}
						// nextAudioSource={nextAudioSource}
						// prevAudioSource={prevAudioSource}
						setAudioPlayerState={this.setAudioPlayerState}
						toggleAutoPlay={this.toggleAutoPlay}
					/>
					<Footer
						profileActive={isProfileActive}
						searchActive={isSearchModalActive}
						notebookActive={isNotesModalActive}
						settingsActive={isSettingsModalActive}
						isScrollingDown={isScrollingDown}
						toggleProfile={this.toggleProfile}
						toggleSearch={this.toggleSearchModal}
						toggleNotebook={this.toggleNotesModal}
						setActiveNotesView={this.setActiveNotesView}
						toggleSettingsModal={this.toggleSettingsModal}
					/>
				</div>
				<div
					// style={
					// 	distance ? { height: distance, maxHeight: distance, flex: 1 } : {}
					// }
					id={'sub-footer'}
					className={'sub-footer'}
				>
					<SubFooter
						userAgent={userAgent}
						theme={userSettings.get('activeTheme')}
					/>
				</div>
			</GenericErrorBoundary>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
	// activeBook: PropTypes.object,
	// previousBook: PropTypes.object,
	// nextBook: PropTypes.object,
	userSettings: PropTypes.object,
	formattedSource: PropTypes.object,
	history: PropTypes.object,
	match: PropTypes.object,
	// userNotes: PropTypes.object,
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.string,
	// text: PropTypes.object,
	textData: PropTypes.object,
	isMenuOpen: PropTypes.bool,
	// updatedText: PropTypes.array,
	// highlights: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	// previousBook: selectPrevBook(),
	// nextBook: selectNextBook(),
	// activeBook: selectActiveBook(),
	userSettings: selectSettings(),
	formattedSource: selectFormattedSource(),
	userAuthenticated: selectAuthenticationStatus(),
	userId: selectUserId(),
	textData: selectUserNotes(),
	isMenuOpen: selectMenuOpenState(),
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
