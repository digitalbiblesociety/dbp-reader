/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import injectSaga from '../../utils/injectSaga';
import injectReducer from '../../utils/injectReducer';
import Settings from '../Settings';
import AudioPlayer from '../AudioPlayer';
import VideoPlayer from '../VideoPlayer';
import Profile from '../Profile';
import Notes from '../Notes';
import Text from '../Text';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import SearchContainer from '../SearchContainer';
import GenericErrorBoundary from '../../components/GenericErrorBoundary';
import FadeTransition from '../../components/FadeTransition';
import notesReducer from '../Notes/reducer';
import notesSaga from '../Notes/saga';
import textReducer from '../TextSelection/reducer';
import textSaga from '../TextSelection/saga';
import { setActiveIsoCode } from '../TextSelection/actions';
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
	// setUA,
	setActiveNote,
	setActiveTextId,
	setActiveChapter,
	setActiveBookName,
	setActiveNotesView,
	setAudioPlayerState,
	setChapterTextLoadingState,
	resetBookmarkState,
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
	// Todo: Move all of this to app.js
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

		this.getCopyrights({ filesetIds: activeFilesets });
		if (userId && userAuthenticated) {
			// console.log('user is now authenticated')
			this.props.dispatch(
				getHighlights({
					bible: activeTextId,
					book: activeBookId,
					chapter: activeChapter,
					userAuthenticated,
					userId,
				}),
			);
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

		if (this.props.homepage.match.params.token) {
			// Open Profile
			this.toggleProfile();
			// Give profile the token - done in render
			// Open Password Reset Verified because there is a token - done in Profile/index
		}

		/* eslint-disable no-undef */
		if (this.props.homepage.firstLoad) {
			this.props.dispatch(
				setActiveIsoCode({
					iso: this.props.homepage.initialIsoCode,
					languageCode: this.props.homepage.defaultLanguageCode,
					name: this.props.homepage.initialLanguageName,
				}),
			);
			this.props.dispatch(
				initApplication({
					languageISO: this.props.homepage.defaultLanguageIso,
					languageCode: this.props.homepage.defaultLanguageCode,
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
							client_id: process.env.GOOGLE_APP_ID_PROD || 'no_client',
							scope: 'profile,plus.login,plus.me,contacts',
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

		if (window && document && document.firstElementChild) {
			// Main can be unset in this instance
			if (this.isMobileSized) {
				this.main = document.getElementsByTagName('main')[0];
				window.addEventListener('scroll', this.handleScrolling, true);
			}
		}

		this.window = window;
		this.document = document;
	}

	componentWillReceiveProps(nextProps) {
		// console.log('Homepage received props ______________________');
		// Based on nextProps so that requests have the latest chapter information
		const {
			userId,
			userAuthenticated,
			activeTextId,
			activeBookId,
			activeChapter,
			addBookmarkSuccess,
		} = nextProps.homepage;
		const {
			addBookmarkSuccess: addBookmarkSuccessProps,
			userId: userIdProps,
			userAuthenticated: userAuthenticatedProps,
			activeTextId: activeTextIdProps,
			activeBookId: activeBookIdProps,
			activeChapter: activeChapterProps,
		} = this.props.homepage;

		// If there is an authenticated user then send these calls
		if (
			userId &&
			userAuthenticated &&
			(userId !== userIdProps ||
				userAuthenticated !== userAuthenticatedProps ||
				activeTextId !== activeTextIdProps ||
				activeBookId !== activeBookIdProps ||
				activeChapter !== activeChapterProps)
		) {
			// Should move all of these into the same call to reduce the number of renders in the text component
			this.props.dispatch(
				getHighlights({
					bible: activeTextId,
					book: activeBookId,
					chapter: activeChapter,
					userAuthenticated,
					userId,
				}),
			);
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
			// console.log('Dispatched get bookmarks for chapter');
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
		// console.log('addBookmarkSuccess', addBookmarkSuccess, 'addBookmarkSuccessProps', addBookmarkSuccessProps);
		if (addBookmarkSuccess !== addBookmarkSuccessProps && addBookmarkSuccess) {
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
			this.props.dispatch(resetBookmarkState());
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

	// menuTicking = false;

	handleMenuTimer = (menu) => {
		if (menu === 'profile') {
			this.props.dispatch(toggleProfile());
		}
		if (menu === 'notes') {
			this.props.dispatch(toggleNotesModal());
		}
		if (menu === 'settings') {
			this.props.dispatch(toggleSettingsModal());
		}
		if (menu === 'search') {
			this.props.dispatch(toggleSearchModal());
		}
		if (menu === 'chapter') {
			this.props.dispatch(toggleChapterSelection());
		}
		if (menu === 'version') {
			this.props.dispatch(toggleVersionSelection());
		}
		// this.menuTicking = false;
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

	toggleAutoPlay = (props) => {
		this.props.dispatch(toggleAutoPlay(props));
	};

	toggleProfile = () => {
		if (this.isMenuOpen('profile')) {
			clearTimeout(this.menuTimer);
			this.menuTimer = setTimeout(this.handleMenuTimer, 700, 'profile');
			// if (!this.menuTicking) {
			// 	this.menuTicking = true;
			// 	requestAnimationFrame(this.handleMenuClose);
			// }
		} else {
			this.props.dispatch(toggleProfile());
		}
	};

	toggleNotesModal = () => {
		if (this.isMenuOpen('notes')) {
			clearTimeout(this.menuTimer);
			this.menuTimer = setTimeout(this.handleMenuTimer, 700, 'notes');
			// if (!this.menuTicking) {
			// 	this.menuTicking = true;
			// 	requestAnimationFrame(this.handleMenuClose);
			// }
		} else {
			this.props.dispatch(toggleNotesModal());
		}
	};

	toggleSettingsModal = () => {
		if (this.isMenuOpen('settings')) {
			clearTimeout(this.menuTimer);
			this.menuTimer = setTimeout(this.handleMenuTimer, 700, 'settings');
			// if (!this.menuTicking) {
			// 	this.menuTicking = true;
			// 	requestAnimationFrame(this.handleMenuClose);
			// }
		} else {
			this.props.dispatch(toggleSettingsModal());
		}
	};

	toggleSearchModal = () => {
		if (this.isMenuOpen('search')) {
			clearTimeout(this.menuTimer);
			this.menuTimer = setTimeout(this.handleMenuTimer, 700, 'search');
			// if (!this.menuTicking) {
			// 	this.menuTicking = true;
			// 	requestAnimationFrame(this.handleMenuClose);
			// }
		} else {
			this.props.dispatch(toggleSearchModal());
		}
	};

	toggleChapterSelection = () => {
		// if (this.isMenuOpen('chapter')) {
		// 	clearTimeout(this.menuTimer);
		// 	this.menuTimer = setTimeout(this.handleMenuTimer, 600, 'chapter');
		// } else {
		this.props.dispatch(toggleChapterSelection());
		// }
	};

	toggleVersionSelection = () => {
		// if (this.isMenuOpen('version')) {
		// 	clearTimeout(this.menuTimer);
		// 	this.menuTimer = setTimeout(this.handleMenuTimer, 600, 'version');
		// } else {
		this.props.dispatch(toggleVersionSelection());
		// }
	};

	// Checks if a menu other than the one given is open, otherwise returns whether any menus are open
	isMenuOpen = (menuName) => {
		const {
			isChapterSelectionActive,
			isProfileActive,
			isSettingsModalActive,
			isSearchModalActive,
			isNotesModalActive,
			isVersionSelectionActive,
		} = this.props.homepage;

		const openMap = {
			profile: isProfileActive,
			notes: isNotesModalActive,
			settings: isSettingsModalActive,
			search: isSearchModalActive,
			chapter: isChapterSelectionActive,
			version: isVersionSelectionActive,
		};

		if (menuName) {
			// console.log('menu other than self is open', Object.entries(openMap).filter(ent => ent[0] !== menuName).some(ent => ent[1]));
			// console.log('map entries', Object.entries(openMap).forEach(ent => console.log('ent[0]', ent[0], 'ent[1]', ent[1])));
			return Object.entries(openMap)
				.filter((ent) => ent[0] !== menuName)
				.some((ent) => ent[1]);
		} else if (
			isChapterSelectionActive ||
			isProfileActive ||
			isSearchModalActive ||
			isSettingsModalActive ||
			isNotesModalActive ||
			isVersionSelectionActive
		) {
			return true;
		}

		return false;
	};

	render() {
		const {
			audioPaths,
			audioSource,
			activeBookId,
			activeTextId,
			activeChapter,
			activeBookName,
			activeFilesets,
			activeTextName,
			activeNotesView,
			activeFilesetId,
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
			videoPlayerOpen,
			hasVideo,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
			userId,
			userAuthenticated,
			isMenuOpen,
			initialVolume,
			initialPlaybackRate,
		} = this.props;

		const autoPlayEnabled = userSettings.get('autoPlayEnabled');
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
				<div
					className={
						videoPlayerOpen || !audioPlayerState
							? 'content-container audio-closed'
							: 'content-container'
					}
				>
					<VideoPlayer
						fileset={activeFilesets.filter((f) => f.type === 'video_stream')[0]}
						bookId={activeBookId}
						chapter={activeChapter}
						books={books}
						text={updatedText}
						textId={activeTextId}
					/>
					<Text
						books={books}
						userId={userId}
						text={updatedText}
						hasVideo={hasVideo}
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
						videoPlayerOpen={videoPlayerOpen}
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
				</div>
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
								activeFilesetId={activeFilesetId}
								books={books}
								toggleSearchModal={this.toggleSearchModal}
							/>
						</FadeTransition>
					) : null}
				</TransitionGroup>
				<AudioPlayer
					books={books}
					hasVideo={hasVideo}
					text={updatedText}
					verseNumber={verse}
					audioPaths={audioPaths}
					audioSource={audioSource}
					autoPlay={autoPlayEnabled}
					activeTextId={activeTextId}
					activeBookId={activeBookId}
					activeChapter={activeChapter}
					initialVolume={initialVolume}
					isScrollingDown={isScrollingDown}
					videoPlayerOpen={videoPlayerOpen}
					audioPlayerState={audioPlayerState}
					toggleAutoPlay={this.toggleAutoPlay}
					initialPlaybackRate={initialPlaybackRate}
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
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	textData: PropTypes.object,
	isMenuOpen: PropTypes.bool,
	initialVolume: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	initialPlaybackRate: PropTypes.oneOfType([
		PropTypes.number,
		PropTypes.string,
	]),
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
const withNotesSaga = injectSaga({ key: 'notes', saga: notesSaga });
const withNotesReducer = injectReducer({ key: 'notes', reducer: notesReducer });

export default compose(
	withReducer,
	withTextReducer,
	withNotesReducer,
	withSaga,
	withNotesSaga,
	withTextSaga,
	withConnect,
)(HomePage);
