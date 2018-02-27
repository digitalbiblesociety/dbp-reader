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

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import isEqual from 'lodash/isEqual';
import { fromJS, is } from 'immutable';
import Settings from 'containers/Settings';
import AudioPlayer from 'containers/AudioPlayer';
import TextSelection from 'containers/TextSelection';
import ChapterSelection from 'containers/ChapterSelection';
import Profile from 'containers/Profile';
import Notes from 'containers/Notes';
import Text from 'containers/Text';
import NavigationBar from 'components/NavigationBar';
import Information from 'components/Information';
import Footer from 'components/Footer';
import SearchContainer from 'containers/SearchContainer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import FadeTransition from 'components/FadeTransition';
import {
	addHighlight,
	getAudio,
	getBooks,
	getChapterText,
	getHighlights,
	// toggleMenuBar,
	toggleProfile,
	toggleNotesModal,
	toggleSearchModal,
	toggleSettingsModal,
	toggleChapterSelection,
	toggleVersionSelection,
	toggleFirstLoadForTextSelection,
	toggleInformationModal,
	setActiveNote,
	setActiveTextId,
	setActiveChapter,
	setActiveBookName,
	setActiveNotesView,
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
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import MenuBar from 'components/MenuBar';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const {
			// activeTextId,
			// activeBookId,
			// activeChapter,
			// defaultLanguageIso: iso,
			activeFilesets,
			audioObjects,
			hasTextInDatabase,
			filesetTypes,
		} = this.props.homepage;
		const { userAuthenticated, userId } = this.props;
		// Using let here so that I can init with either the default application params or the url params
		let {
			activeTextId,
			activeBookId,
			activeChapter,
		} = this.props.homepage;
		// Ensure that the route has a parameter in each category
		const hasThreeParams = this.props.match.params.bibleId && this.props.match.params.bookId && this.props.match.params.chapter;
		// Either come up with a callback/promise solution or move the progressive logic
		// into the saga so that each call will be assured to have the data from the call before
		if (hasThreeParams) {
			activeTextId = this.props.match.params.bibleId && this.props.match.params.bibleId.toUpperCase();
			activeBookId = this.props.match.params.bookId && this.props.match.params.bookId.toUpperCase();
			activeChapter = this.props.match.params.chapter;
		}

		if (Object.keys(activeFilesets).length === 0) {
			this.props.dispatch(initApplication({ activeTextId }));
		}

		// this.props.dispatch(getAudio({ list: fromJS(activeFilesets) })); <- probably not needed, but I left it just in case
		this.props.dispatch(getBooks({ textId: activeTextId, filesets: fromJS(activeFilesets), activeBookId }));
		this.props.dispatch(getChapterText({
			userAuthenticated,
			userId,
			bible: activeTextId,
			book: activeBookId,
			chapter: activeChapter,
			audioObjects,
			hasTextInDatabase,
			formattedText: filesetTypes.text_formatt,
		}));
		// Needed for setting the active names based on the url params
		this.setActiveTextId({ textId: activeTextId, filesets: activeFilesets, textName: '' });
		// I don't have access to the book name at this point so I thought it best to just use the id as a filler
		this.setActiveBookName({ book: activeBookId, id: activeBookId });
		this.setActiveChapter(parseInt(activeChapter, 10));
		// need to get the data for the new url and use it as the basis for my api calls instead of redux state

		// Init the Facebook api here
		window.fbAsyncInit = () => {
			FB.init({ // eslint-disable-line no-undef
				appId: process.env.FB_APP_ID,
				autoLogAppEvents: true,
				xfbml: true,
				version: 'v2.12',
			});
		};

		((d, s, id) => {
			let js = d.getElementsByTagName(s)[0];
			const fjs = d.getElementsByTagName(s)[0];
			if (d.getElementById(id)) return;
			js = d.createElement(s); js.id = id;
			js.src = 'https://connect.facebook.net/en_US/sdk.js';
			fjs.parentNode.insertBefore(js, fjs);
		})(document, 'script', 'facebook-jssdk');
	}
	// TODO: Rewrite componentWillReceiveProps to only use the route parameters and auth state
	// The current version of the below function is gross and prone to breaking
	// This function needs to solve the issue of requesting the new data from the api when a new version is clicked
	componentWillReceiveProps(nextProps) {
		// Next props supplied to component
		const {
			hasTextInDatabase,
			activeTextId,
			activeBookId,
			activeFilesets,
			activeChapter,
			books,
			audioObjects,
			filesetTypes,
			highlights,
		} = nextProps.homepage;
		const { userAuthenticated, userId } = nextProps;
		const nextBooks = fromJS(books);
		const nextUrlBibleId = nextProps.match.params.bibleId;
		const nextUrlBookId = nextProps.match.params.bookId;
		const nextUrlChapter = nextProps.match.params.chapter;

		// Current props supplied to component
		const curBooks = fromJS(this.props.homepage.books);
		const curAudioObjects = this.props.homepage.audioObjects;
		const curUrlBibleId = this.props.match.params.bibleId;
		const curUrlBookId = this.props.match.params.bookId;
		const curUrlChapter = this.props.match.params.chapter;

		// Currently we only have text_formatt as an option in the api
		// This will be changed to formatted at some point
		// We may also have the addition of a text_plain option

		if (nextUrlBibleId !== curUrlBibleId) {
			this.setActiveTextId({ textId: activeTextId, filesets: fromJS({}), textName: '' });
		}
		// Returning in if block here to keep the next if/else blocks from running
		// This prevents the state being updated twice when a user isn't
		// directly manipulating the url or coming from another site.
		if (nextUrlChapter !== curUrlChapter) {
			if (curUrlBookId !== nextUrlBookId) {
				const nextBook = nextBooks.find((book) => book.get('book_id') === nextUrlBookId);

				this.setActiveBookName({ book: nextBook.get('name_short'), id: nextUrlBookId });
			}

			this.setActiveChapter(parseInt(nextUrlChapter, 10));
			this.getChapters({
				bible: nextUrlBibleId,
				book: nextUrlBookId,
				chapter: parseInt(nextUrlChapter, 10),
				audioObjects,
				hasTextInDatabase,
				formattedText: filesetTypes.text_formatt,
				userAuthenticated,
				userId,
			});

			return;
		}

		if (activeTextId !== this.props.homepage.activeTextId) {
			this.getBooks({ textId: activeTextId, filesets: fromJS(activeFilesets) });
		} else if (!is(nextBooks, curBooks) && curBooks.size) {
			// Determines if the next set of books has the same book that is already active
			const nextHasCurrent = nextBooks.find((book) => book.book_id === activeBookId);
			// Gets each piece of the next book that is needed
			const nextBookId = nextHasCurrent ? activeBookId : nextBooks.getIn([0, 'book_id']);
			const nextBookName = nextHasCurrent ? nextHasCurrent.get('name_short') : nextBooks.getIn([0, 'name']);
			const chapter = nextHasCurrent ? activeChapter : nextBooks.getIn([0, 'chapters', 0]);

			this.setActiveBookName({ book: nextBookName, id: nextBookId });
			this.setActiveChapter(chapter);
			this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: nextBookId, chapter, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
		} else if (!isEqual(audioObjects, curAudioObjects)) {
			// Should change this so that it only requests the audio
			// combining the text and audio into one call isn't the best
			this.getChapters({
				bible: activeTextId,
				book: activeBookId,
				chapter: activeChapter,
				audioObjects,
				hasTextInDatabase,
				formattedText: filesetTypes.text_formatt,
				userAuthenticated,
				userId,
			});
		} else if (userAuthenticated !== this.props.userAuthenticated && userAuthenticated && userId) {
			this.props.dispatch(getHighlights({
				bible: activeTextId,
				book: activeBookId,
				chapter: activeChapter,
				userAuthenticated,
				userId,
			}));
		} else if (!isEqual(highlights, this.props.homepage.highlights)) {
			this.props.dispatch(getHighlights({
				bible: activeTextId,
				book: activeBookId,
				chapter: activeChapter,
				userAuthenticated,
				userId,
			}));
		}
	}

	getNextChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			audioObjects,
			hasTextInDatabase,
			filesetTypes,
		} = this.props.homepage;
		const { activeBook, nextBook, userAuthenticated, userId } = this.props;
		const maxChapter = activeBook.get('chapters').size;

		if (activeChapter === maxChapter) {
			this.setActiveBookName({ book: nextBook.get('name'), id: nextBook.get('book_id') });
			this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: nextBook.get('book_id'), chapter: 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(1);
			this.props.history.push(`/${activeTextId}/${nextBook.get('book_id')}/1`);
		} else {
			this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter + 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(activeChapter + 1);
			this.props.history.push(`/${activeTextId}/${activeBookId}/${activeChapter + 1}`);
		}
	}

	getPrevChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			audioObjects,
			hasTextInDatabase,
			filesetTypes,
			books,
		} = this.props.homepage;
		const { previousBook, userAuthenticated, userId } = this.props;
		// Keeps the button from trying to go backwards to a book that doesn't exist
		if (activeBookId === books[0].book_id && activeChapter - 1 === 0) {
			return;
		}
		// Goes to the previous book in the bible in canonical order from the current book
		if (activeChapter - 1 === 0) {
			const lastChapter = previousBook.get('chapters').size;

			this.setActiveBookName({ book: previousBook.get('name'), id: previousBook.get('book_id') });
			this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: previousBook.get('book_id'), chapter: lastChapter, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(lastChapter);
			this.props.history.push(`/${activeTextId}/${previousBook.get('book_id')}/${lastChapter}`);
			// Goes to the previous Chapter
		} else {
			this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter - 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(activeChapter - 1);
			this.props.history.push(`/${activeTextId}/${activeBookId}/${activeChapter - 1}`);
		}
	}

	getBooks = (props) => this.props.dispatch(getBooks(props))

	getAudio = ({ list }) => this.props.dispatch(getAudio({ list }))

	getChapters = (props) => this.props.dispatch(getChapterText(props))

	setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))

	setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props))

	setActiveNotesView = (view) => this.props.dispatch(setActiveNotesView(view))

	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }))

	addHighlight = (props) => this.props.dispatch(addHighlight({ ...props, bible: this.props.homepage.activeTextId, userId: this.props.userId }))

	toggleFirstLoadForTextSelection = () => this.props.homepage.firstLoad && this.props.dispatch(toggleFirstLoadForTextSelection())

	toggleProfile = () => this.props.dispatch(toggleProfile())

	toggleNotesModal = () => this.props.dispatch(toggleNotesModal())

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal())

	toggleSearchModal = () => this.props.dispatch(toggleSearchModal())

	toggleChapterSelection = () => this.props.dispatch(toggleChapterSelection())

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection())

	toggleInformationModal = () => this.props.dispatch(toggleInformationModal())

	render() {
		const {
			activeTextName,
			activeBookId,
			activeTextId,
			chapterText,
			isSettingsModalActive,
			isNotesModalActive,
			isVersionSelectionActive,
			isChapterSelectionActive,
			isInformationModalActive,
			isSearchModalActive,
			activeBookName,
			activeChapter,
			isProfileActive,
			copywrite,
			audioSource,
			activeNotesView,
			loadingNewChapterText,
			firstLoad,
			highlights,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="Your entire app is corrupted and bad, try again!">
				<Helmet
					meta={[
						{ name: 'description', content: 'Main page for the Bible.is web app' },
						{ name: 'og:title', content: `${activeBookName} ${activeChapter}` },
						{ name: 'og:url', content: window.location.href },
						{ name: 'og:description', content: 'Main page for the Bible.is web app' },
						{ name: 'og:type', content: 'website' },
						{ name: 'og:site_name', content: 'Bible.is' },
					]}
				>
					<title>{`${activeBookName} ${activeChapter}`} | Bible.is</title>
					<meta name="description" content="Main page for the Bible.is web app" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					activeTextId={activeTextId}
					activeBookName={activeBookName}
					activeChapter={activeChapter}
					toggleProfile={this.toggleProfile}
					toggleChapterSelection={this.toggleChapterSelection}
					toggleVersionSelection={this.toggleVersionSelection}
					toggleSearchModal={this.toggleSearchModal}
				/>
				<AudioPlayer audioSource={audioSource} skipBackward={this.getPrevChapter} skipForward={this.getNextChapter} />
				<TransitionGroup>
					{
						isChapterSelectionActive ? (
							<FadeTransition in={isSettingsModalActive}>
								<ChapterSelection />
							</FadeTransition>
						) : null
					}
					{
						isVersionSelectionActive ? (
							<FadeTransition in={isSettingsModalActive}>
								<TextSelection
									firstLoad={firstLoad}
									activeBookName={activeBookName}
									activeTextName={activeTextName}
									getAudio={this.getAudio}
									setActiveText={this.setActiveTextId}
									setActiveChapter={this.setActiveChapter}
									toggleVersionSelection={this.toggleVersionSelection}
									toggleFirstLoadForTextSelection={this.toggleFirstLoadForTextSelection}
								/>
							</FadeTransition>
						) : null
					}
					{
						isSettingsModalActive ? (
							<FadeTransition classNames="slide-from-left" in={isSettingsModalActive}>
								<Settings userSettings={userSettings} toggleSettingsModal={this.toggleSettingsModal} />
							</FadeTransition>
						) : null
					}
					{
						isProfileActive ? (
							<FadeTransition classNames="slide-from-right" in={isProfileActive}>
								<Profile toggleProfile={this.toggleProfile} />
							</FadeTransition>
						) : null
					}
					{
						isNotesModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isNotesModalActive}>
								<Notes toggleProfile={this.toggleProfile} toggleNotesModal={this.toggleNotesModal} openView={activeNotesView} />
							</FadeTransition>
						) : null
					}
					{
						isInformationModalActive ? (
							<FadeTransition classNames="slide-from-left" in={isInformationModalActive}>
								<Information copywrite={copywrite} toggleInformationModal={this.toggleInformationModal} />
							</FadeTransition>
						) : null
					}
					{
						isSearchModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isSearchModalActive}>
								<SearchContainer toggleSearchModal={this.toggleSearchModal} />
							</FadeTransition>
						) : null
					}
				</TransitionGroup>
				<Text highlights={highlights} addHighlight={this.addHighlight} activeBookName={activeBookName} loadingNewChapterText={loadingNewChapterText} userSettings={userSettings} setActiveNote={this.setActiveNote} formattedSource={formattedSource} setActiveNotesView={this.setActiveNotesView} activeBookId={activeBookId} activeChapter={activeChapter} notesActive={isNotesModalActive} toggleNotesModal={this.toggleNotesModal} text={chapterText} nextChapter={this.getNextChapter} prevChapter={this.getPrevChapter} />
				<Footer settingsActive={isSettingsModalActive} isInformationModalActive={isInformationModalActive} toggleInformationModal={this.toggleInformationModal} toggleSettingsModal={this.toggleSettingsModal} />
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
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.string,
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
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'homepage', reducer });
const withSaga = injectSaga({ key: 'homepage', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(HomePage);
