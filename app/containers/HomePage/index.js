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
// import { fromJS, is } from 'immutable';
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
	// initApplication,
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
		// Get the first bible based on the url here
		const { params } = this.props.match;

		this.props.dispatch({
			type: 'getbible',
			bibleId: params.bibleId,
			bookId: params.bookId,
			chapter: params.chapter,
		});

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
	// Need to fix how many times this gets called. The main issue is all the state that is managed by this one thing
	componentWillReceiveProps(nextProps) {
		// Deals with updating page based on the url params
		// previous props
		const { params } = this.props.match;
		// next props
		const { params: nextParams } = nextProps.match;
		// console.log('prev and next match\n', this.props.match, '\n', nextProps.match);

		if (!isEqual(params, nextParams)) {
			// if the route isn't the same as before find which parts changed
			const newChapter = params.chapter !== nextParams.chapter;
			const newBook = params.bookId !== nextParams.bookId;
			const newBible = params.bibleId !== nextParams.bibleId;
			// console.log('new bible', newBible);
			// console.log('new book', newBook);
			// console.log('new chapter', newChapter);
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
				});
				// need to update the url if the parameters given weren't valid
			} else if (newBook) {
				// console.log('new book');
				// This needs to be here for the case when a user goes from Genesis 7 to Mark 7 via the dropdown menu
				// Need to get the audio and text for the new book /bibles/[bibleId]/[bookId]/chapter
					// Preserve current chapter and try to use it first
					// Default to first chapter if the new book doesn't have the current chapter
				this.props.dispatch({
					type: 'getchapter',
					filesets: nextProps.homepage.activeFilesets,
					bibleId: nextParams.bibleId,
					bookId: nextParams.bookId,
					chapter: nextParams.chapter,
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
				});
			}
		} else if (this.props.homepage.activeBookId !== nextProps.homepage.activeBookId) {
		// Deals with when the new text doesn't have the same books
		// 	console.log('the current id doesnt match');
		// 	console.log(this.props);
			this.props.history.replace(`/${nextProps.homepage.activeTextId}/${nextProps.homepage.activeBookId}/${nextProps.homepage.activeChapter}`);
			// console.log('route that I pushed', `/${nextProps.homepage.activeTextId}/${nextProps.homepage.activeBookId}/${nextProps.homepage.activeChapter}`);
		}

		// Deals with updating the interface if a user is authenticated or added highlights
		const {
			activeTextId,
			activeBookId,
			activeChapter,
			highlights,
		} = nextProps.homepage;
		const { userAuthenticated, userId } = nextProps;

		if (userAuthenticated !== this.props.userAuthenticated && userAuthenticated && userId) {
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
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: nextBook.get('book_id'), chapter: 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(1);
			this.props.history.push(`/${activeTextId}/${nextBook.get('book_id')}/1`);
		} else {
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter + 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
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
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: previousBook.get('book_id'), chapter: lastChapter, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(lastChapter);
			this.props.history.push(`/${activeTextId}/${previousBook.get('book_id')}/${lastChapter}`);
			// Goes to the previous Chapter
		} else {
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter - 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
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
			<GenericErrorBoundary affectedArea="Homepage">
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
									activeTextId={activeTextId}
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
