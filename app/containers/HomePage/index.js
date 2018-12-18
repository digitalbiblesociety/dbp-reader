/*
 * HomePage
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
import FadeTransition from '../../components/FadeTransition';
import notesReducer from '../Notes/reducer';
import notesSaga from '../Notes/saga';
import textReducer from '../TextSelection/reducer';
import textSaga from '../TextSelection/saga';
import profileSaga from '../Profile/saga';
import profileReducer from '../Profile/reducer';
import makeSelectProfile from '../Profile/selectors';
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
	componentDidMount() {
		const {
			activeFilesets,
			activeBookId,
			activeChapter,
			activeTextId,
		} = this.props.homepage;
		const { userAuthenticated, userId } = this.props.profile;

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
			if (!this.props.userId && typeof gapi !== 'undefined') {
				gapi.load('auth2', () => {
					try {
						window.auth2 = gapi.auth2.init({
							client_id: process.env.GOOGLE_APP_ID_PROD || 'no_client',
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
	}

	componentWillReceiveProps(nextProps) {
		// console.log('Homepage received props ______________________');
		// Based on nextProps so that requests have the latest chapter information
		const {
			activeTextId,
			activeBookId,
			activeChapter,
			addBookmarkSuccess,
		} = nextProps.homepage;
		const { userId, userAuthenticated } = nextProps.profile;
		const {
			addBookmarkSuccess: addBookmarkSuccessProps,
			activeTextId: activeTextIdProps,
			activeBookId: activeBookIdProps,
			activeChapter: activeChapterProps,
		} = this.props.homepage;
		const {
			userId: userIdProps,
			userAuthenticated: userAuthenticatedProps,
		} = this.props.profile;

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
			this.props.dispatch(toggleProfile());
		} else {
			this.props.dispatch(toggleProfile());
		}
	};

	toggleNotesModal = () => {
		if (this.isMenuOpen('notes')) {
			this.props.dispatch(toggleNotesModal());
		} else {
			this.props.dispatch(toggleNotesModal());
		}
	};

	toggleSettingsModal = () => {
		if (this.isMenuOpen('settings')) {
			this.props.dispatch(toggleSettingsModal());
		} else {
			this.props.dispatch(toggleSettingsModal());
		}
	};

	toggleSearchModal = () => {
		if (this.isMenuOpen('search')) {
			this.props.dispatch(toggleSearchModal());
		} else {
			this.props.dispatch(toggleSearchModal());
		}
	};

	toggleChapterSelection = () => {
		this.props.dispatch(toggleChapterSelection());
	};

	toggleVersionSelection = () => {
		this.props.dispatch(toggleVersionSelection());
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
			isMenuOpen,
			initialVolume,
			initialPlaybackRate,
		} = this.props;
		const { userId, userAuthenticated } = this.props.profile;

		const autoPlayEnabled = userSettings.get('autoPlayEnabled');
		const { isScrollingDown, footerDistance: distance } = this.state;
		const { userNotes, bookmarks, text: updatedText } = this.props.textData;
		const token = this.props.homepage.match.params.token || '';
		const verse = this.props.homepage.match.params.verse || '';

		return (
			<>
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
					loadingNewChapterText={loadingNewChapterText}
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
			</>
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
	profile: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	userSettings: selectSettings(),
	formattedSource: selectFormattedSource(),
	userAuthenticated: selectAuthenticationStatus(),
	userId: selectUserId(),
	textData: selectUserNotes(),
	profile: makeSelectProfile(),
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
const withProfileReducer = injectReducer({
	key: 'profile',
	reducer: profileReducer,
});
const withProfileSaga = injectSaga({ key: 'profile', saga: profileSaga });

export default compose(
	withReducer,
	withTextReducer,
	withProfileReducer,
	withProfileSaga,
	withNotesReducer,
	withSaga,
	withNotesSaga,
	withTextSaga,
	withConnect,
)(HomePage);
