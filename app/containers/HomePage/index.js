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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import get from 'lodash/get';
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
import FadeTransition from '../../components/FadeTransition';
import svg4everybody from '../../utils/svgPolyfill';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from '../Settings/themes';
import notesReducer from '../Notes/reducer';
import textReducer from '../TextSelection/reducer';
import textSaga from '../TextSelection/saga';
import { getBookmarksForChapter, addBookmark } from '../Notes/actions';
import {
	addHighlight,
	deleteHighlights,
	getBooks,
	getNotes,
	getChapterText,
	getHighlights,
	getCopyrights,
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
	setChapterTextLoadingState,
	initApplication,
} from './actions';
import makeSelectHomePage, {
	selectSettings,
	selectFormattedSource,
	selectAuthenticationStatus,
	selectUserId,
	selectMenuOpenState,
	selectUserNotes,
} from './selectors';
import reducer from './reducer';
import saga from './saga';

class HomePage extends React.PureComponent {
	state = {
		isScrollingDown: false,
		footerDistance: 0,
		heightDifference: 0,
	};
	// eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// console.log('Homepage mounted______________________');
		const {
			activeFilesets,
			activeBookId,
			activeChapter,
			activeTextId,
			userAuthenticated,
			userId,
		} = this.props.homepage;
		const params = this.props.homepage.match.params;
		this.props.dispatch({
			type: 'getbible',
			bibleId: params.bibleId,
			bookId: params.bookId,
			chapter: params.chapter,
			authenticated: this.props.homepage.userAuthenticated,
			userId: this.props.homepage.userId,
			verse: params.verse,
		});
		this.getCopyrights({ filesetIds: activeFilesets });
		if (userId && userAuthenticated) {
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
			this.props.dispatch(
				getHighlights({
					bible: activeTextId,
					book: activeBookId,
					chapter: activeChapter,
					userAuthenticated: !!userId,
					userId,
				}),
			);
			if (userId) {
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

		if (this.props.homepage.match.params.token) {
			// Open Profile
			this.toggleProfile();
			// Give profile the token - done in render
			// Open Password Reset Verified because there is a token - done in Profile/index
		}

		const activeTheme =
			localStorage.getItem('bible_is_theme') ||
			sessionStorage.getItem('bible_is_theme') ||
			'red';
		const activeFontFamily =
			localStorage.getItem('bible_is_font_family') ||
			sessionStorage.getItem('bible_is_font_family') ||
			'sans';
		const activeFontSize =
			localStorage.getItem('bible_is_font_size') ||
			sessionStorage.getItem('bible_is_font_size') ||
			42;
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
			get(this, ['props', 'homepage', 'userSettings', 'activeTheme'])
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
					try {
						window.auth2 = gapi.auth2.init({
							client_id:
								process.env.NODE_ENV === 'development'
									? process.env.GOOGLE_APP_ID
									: process.env.GOOGLE_APP_ID_PROD || 'no_client',
							scope: 'profile',
						});
					} catch (err) {
						if (process.env.NODE_ENV === 'development') {
							console.warn('Error initializing google api lower catch', err); // eslint-disable-line no-console
						}
					}
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
		if (browserObject.agent === 'msie') {
			this.props.dispatch(setUA());
			svg4everybody();
		}

		if (window && document && document.firstElementChild) {
			// Main can be unset in this instance
			this.main = document.getElementsByTagName('main')[0];
			window.addEventListener('scroll', this.handleScrolling, true);
		}

		// Should move these to being tracked in state or move them to media queries
		this.window = window;
		this.document = document;
	}

	componentWillReceiveProps() {
		// console.log('Homepage received props ______________________');
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

	setTextLoadingState = (props) =>
		this.props.dispatch(setChapterTextLoadingState(props));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props));

	setActiveNotesView = (view) => this.props.dispatch(setActiveNotesView(view));

	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }));

	setAudioPlayerState = (state) =>
		this.props.dispatch(setAudioPlayerState(state));

	// May need more than one to determine the different audio player heights
	get isMobileSized() {
		return (
			this.window &&
			this.document &&
			this.document.firstElementChild &&
			this.document.firstElementChild.clientWidth < 500
		);
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
		return Math.max(this.main.offsetHeight, this.main.clientHeight);
	}

	// The current scroll position
	get scrollTop() {
		return this.main.scrollTop;
	}

	// If the scroll event would result in a value above or below the actual size of the container
	get outOfBounds() {
		return (
			this.scrollTop + this.mainPhysicalHeight >= this.mainHeight ||
			this.scrollTop < 5
		);
	}

	get isAtTop() {
		return this.scrollTop < 5;
	}

	get isAtBottom() {
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

		const resizeHeight = 0;
		if (!this.outOfBounds) {
			// Previous state was not scrolling down but new state is
			if (
				this.scrollTop >= this.previousScrollTop &&
				!this.state.isScrollingDown
			) {
				this.setState(
					{
						isScrollingDown: !!this.isMobileSized,
					},
					() => {
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
						isScrollingDown: false,
					},
					() => {
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
				this.previousScrollTop = this.scrollTop;
				this.scrollTicking = false;
			}
		} else if (this.isAtTop || this.isAtBottom) {
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
			this.previousScrollTop = this.scrollTop;
			this.scrollTicking = false;
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
			loadingNewChapterText,
			chapterTextLoadingState,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
			userId,
			userAuthenticated,
			history,
			isMenuOpen,
		} = this.props;

		// console.log('Homepage props', this.props);

		const { isScrollingDown, footerDistance: distance } = this.state;

		const { userNotes, bookmarks, text: updatedText } = this.props.textData;
		const token = this.props.homepage.match.params.token || '';
		const verse = this.props.homepage.match.params.verse || '';

		return (
			<GenericErrorBoundary affectedArea="Homepage">
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
					invalidBibleId={invalidBibleId}
					activeBookName={activeBookName}
					notesActive={isNotesModalActive}
					formattedSource={formattedSource}
					isScrollingDown={isScrollingDown}
					audioPlayerState={audioPlayerState}
					userAuthenticated={userAuthenticated}
					informationActive={isInformationModalActive}
					loadingNewChapterText={loadingNewChapterText}
					chapterTextLoadingState={chapterTextLoadingState}
					addBookmark={this.addBookmark}
					addHighlight={this.addHighlight}
					setActiveNote={this.setActiveNote}
					getCopyrights={this.getCopyrights}
					toggleNotesModal={this.toggleNotesModal}
					deleteHighlights={this.deleteHighlights}
					setActiveNotesView={this.setActiveNotesView}
					setTextLoadingState={this.setTextLoadingState}
					toggleInformationModal={this.toggleInformationModal}
				/>
				<AudioPlayer
					books={books}
					text={updatedText}
					verseNumber={verse}
					audioPaths={audioPaths}
					audioSource={audioSource}
					autoPlay={autoPlayEnabled}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
					activeChapter={activeChapter}
					isScrollingDown={isScrollingDown}
					audioPlayerState={audioPlayerState}
					toggleAutoPlay={this.toggleAutoPlay}
					setAudioPlayerState={this.setAudioPlayerState}
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
			</GenericErrorBoundary>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
	userSettings: PropTypes.object,
	formattedSource: PropTypes.object,
	history: PropTypes.object,
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.string,
	textData: PropTypes.object,
	isMenuOpen: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	userSettings: selectSettings(),
	formattedSource: selectFormattedSource(),
	userAuthenticated: selectAuthenticationStatus(),
	userId: selectUserId(),
	textData: selectUserNotes(),
	isMenuOpen: selectMenuOpenState(),
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

export default compose(
	withReducer,
	withTextReducer,
	withNotesReducer,
	withSaga,
	withTextSaga,
	withConnect,
)(HomePage);
