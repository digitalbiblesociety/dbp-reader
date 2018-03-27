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
import get from 'lodash/get';
// import { fromJS, is } from 'immutable';
import Settings from 'containers/Settings';
import AudioPlayer from 'containers/AudioPlayer';
// import TextSelection from 'containers/TextSelection';
// import ChapterSelection from 'containers/ChapterSelection';
import Profile from 'containers/Profile';
import Notes from 'containers/Notes';
import Text from 'containers/Text';
import NavigationBar from 'components/NavigationBar';
import Information from 'components/Information';
import Footer from 'components/Footer';
import SearchContainer from 'containers/SearchContainer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import FadeTransition from 'components/FadeTransition';
import logo from 'images/app-icons/favicon-96x96.png';
import {
	applyTheme,
	applyFontFamily,
	applyFontSize,
	toggleWordsOfJesus,
} from 'containers/Settings/themes';
import {
	getCountries,
	getLanguages,
	getTexts,
} from 'containers/TextSelection/actions';
import textReducer from 'containers/TextSelection/reducer';
import textSaga from 'containers/TextSelection/saga';
import {
	addHighlight,
	getBooks,
	getChapterText,
	getHighlights,
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
	selectChapterText,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import MenuBar from 'components/MenuBar';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		// Get the first bible based on the url here
		const { params } = this.props.match;
		const { bibleId, bookId, chapter } = params;
		const { userAuthenticated: authenticated, userId } = this.props;
		// console.log('authenticated in home did mount', authenticated);
		// console.log('userId in home did mount', userId);

		if (bibleId && bookId && chapter) {
			this.props.dispatch({
				type: 'getbible',
				bibleId,
				bookId,
				chapter,
				authenticated,
				userId,
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
			});
			// console.log('redirecting from bible and book');
			this.props.history.replace(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/1`);
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
			});
			// May want to use replace here at some point
			// this.props.history.replace(`/${bibleId}/gen/1`);
		} else {
			// If the user doesn't provide a url then redirect
			// them to the default bible
			// I think I may need a different saga for this
			// I will use the browser language and the first
			// version available in that language as the default

			// Defaulting to esv until browser language detection is implemented
			// console.log('redirecting from else in did mount');
			this.props.history.replace('/engesv/gen/1');
		}

		const activeTheme = get(this, ['props', 'homepage', 'userSettings', 'activeTheme']);
		const activeFontFamily = get(this, ['props', 'homepage', 'userSettings', 'activeFontType']);
		const activeFontSize = get(this, ['props', 'homepage', 'userSettings', 'activeFontSize']);
		const redLetter = get(this, ['props', 'homepage', 'userSettings', 'toggleOptions', 'redLetter', 'active']);

		if (redLetter !== this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])) {
			toggleWordsOfJesus(redLetter);
		}

		if (activeTheme !== this.props.userSettings.getIn(['toggleOptions', 'redLetter', 'active'])) {
			applyTheme(activeTheme);
		}

		if (activeFontFamily !== this.props.userSettings.get('activeFontType')) {
			applyFontFamily(activeFontFamily);
		}

		if (activeFontSize !== this.props.userSettings.get('activeFontSize')) {
			applyFontSize(activeFontSize);
		}

		if (this.props.homepage.firstLoad) {
			this.props.dispatch(getCountries());
			this.props.dispatch(getLanguages());
			this.props.dispatch(getTexts({ languageISO: this.props.homepage.defaultLanguageIso }));
			this.toggleFirstLoadForTextSelection();
		}

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
		const { userAuthenticated, userId } = nextProps;

		if (!isEqual(params, nextParams)) {
			// console.log('received props and params are different');
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
					authenticated: userAuthenticated,
					userId,
				});
				// todo need to update the url if the parameters given weren't valid
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
					authenticated: userAuthenticated,
					userId,
				});
			}
		} else if (this.props.homepage.activeBookId !== nextProps.homepage.activeBookId) {
		// Deals with when the new text doesn't have the same books
		// 	console.log('the current id doesnt match');
		// 	console.log(this.props);
		// 	console.log('redirecting from activeBookId willReceiveProps');
			this.props.history.replace(`/${nextProps.homepage.activeTextId.toLowerCase()}/${nextProps.homepage.activeBookId.toLowerCase()}/${nextProps.homepage.activeChapter}${nextParams.verse ? `/${nextParams.verse}` : ''}`);
			// console.log('route that I pushed', `/${nextProps.homepage.activeTextId}/${nextProps.homepage.activeBookId}/${nextProps.homepage.activeChapter}`);
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
			this.props.dispatch(getHighlights({
				bible: activeTextId,
				book: activeBookId,
				chapter: activeChapter,
				userAuthenticated,
				userId,
			}));
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
		if (!isEqual(nextProps.homepage.activeFilesets, this.props.homepage.activeFilesets) && nextProps.homepage.activeTextId === this.props.homepage.activeTextId) {
			// do something
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
		const nextVerse = (parseInt(verse, 10) + 1) || 1;
		const lastVerse = chapterText.length;
		// Is it past the max verses for the chapter?
		// if not increment it by 1
		if (nextVerse <= lastVerse && nextVerse > 0) {
			this.props.history.push(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${nextVerse}`);
		} else if (nextVerse < 0) {
			this.props.history.replace(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/1`);
		} else if (nextVerse > lastVerse) {
			this.props.history.replace(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${lastVerse}`);
		}
	}

	setPrevVerse = (verse) => {
		const { bibleId, bookId, chapter } = this.props.match.params;
		const { chapterText } = this.props.homepage;
		const prevVerse = (parseInt(verse, 10) - 1) || 1;
		const lastVerse = chapterText.length;
		// Is it past the max verses for the chapter?
		// if not increment it by 1
		if (prevVerse <= lastVerse && prevVerse > 0) {
			this.props.history.push(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${prevVerse}`);
		} else if (prevVerse < 0) {
			this.props.history.replace(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/1`);
		} else if (prevVerse > lastVerse) {
			this.props.history.replace(`/${bibleId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}/${lastVerse}`);
		}
	}

	getNextChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
		} = this.props.homepage;
		const { activeBook, nextBook } = this.props;
		const verseNumber = this.props.match.params.verse || '';
		const maxChapter = activeBook.get('chapters').size;

		if (verseNumber) {
			this.setNextVerse(verseNumber);
			return;
		}
		// If the next book in line doesn't exist and we are already at the last chapter just return
		if (!nextBook.size && activeChapter === maxChapter) {
			return;
		}

		if (activeChapter === maxChapter) {
			this.setActiveBookName({ book: nextBook.get('name'), id: nextBook.get('book_id') });
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: nextBook.get('book_id'), chapter: 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(1);
			this.props.history.push(`/${activeTextId.toLowerCase()}/${nextBook.get('book_id').toLowerCase()}/1`);
		} else {
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter + 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(activeChapter + 1);
			this.props.history.push(`/${activeTextId.toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter + 1}`);
		}
	}

	getPrevChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			books,
		} = this.props.homepage;
		const { previousBook } = this.props;
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
			const lastChapter = previousBook.get('chapters').size;

			this.setActiveBookName({ book: previousBook.get('name'), id: previousBook.get('book_id') });
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: previousBook.get('book_id'), chapter: lastChapter, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(lastChapter);
			this.props.history.push(`/${activeTextId.toLowerCase()}/${previousBook.get('book_id').toLowerCase()}/${lastChapter}`);
			// Goes to the previous Chapter
		} else {
			// this.getChapters({ userAuthenticated, userId, bible: activeTextId, book: activeBookId, chapter: activeChapter - 1, audioObjects, hasTextInDatabase, formattedText: filesetTypes.text_formatt });
			this.setActiveChapter(activeChapter - 1);
			this.props.history.push(`/${activeTextId.toLowerCase()}/${activeBookId.toLowerCase()}/${activeChapter - 1}`);
		}
	}

	getBooks = (props) => this.props.dispatch(getBooks(props))

	getChapters = (props) => this.props.dispatch(getChapterText(props))

	setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))

	setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props))

	setActiveNotesView = (view) => this.props.dispatch(setActiveNotesView(view))

	setActiveNote = ({ note }) => this.props.dispatch(setActiveNote({ note }))

	goToFullChapter = () => {
		const { bibleId, bookId, chapter } = this.props.match.params;

		this.props.history.push(`/${bibleId}/${bookId}/${chapter}`);
	}

	addHighlight = (props) => this.props.dispatch(addHighlight({ ...props, bible: this.props.homepage.activeTextId, userId: this.props.userId }))

	toggleFirstLoadForTextSelection = () => this.props.homepage.firstLoad && this.props.dispatch(toggleFirstLoadForTextSelection())

	toggleProfile = () => this.props.dispatch(toggleProfile())

	toggleNotesModal = () => this.props.dispatch(toggleNotesModal())

	toggleAutoPlay = () => this.props.dispatch(toggleAutoPlay())

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
			invalidBibleId,
			highlights,
			autoPlayEnabled,
		} = this.props.homepage;

		const {
			userSettings,
			formattedSource,
			userId,
			userAuthenticated,
			updatedText,
		} = this.props;

		const verse = this.props.match.params.verse || '';

		return (
			<GenericErrorBoundary affectedArea="Homepage">
				<Helmet
					meta={[
						{ name: 'description', content: 'Main page for the Bible.is web app' },
						{ property: 'og:title', content: `${activeBookName} ${activeChapter}${verse ? `:${verse}` : ''}` },
						{ property: 'og:url', content: window.location.href },
						{ property: 'og:description', content: 'Main page for the Bible.is web app' },
						{ property: 'og:type', content: 'website' },
						{ property: 'og:site_name', content: 'Bible.is' },
						{ property: 'og:image', content: logo },
					]}
				>
					<title>{`${activeBookName} ${activeChapter}${verse ? `:${verse}` : ''}`} | Bible.is</title>
					<meta name="description" content="Main page for the Bible.is web app" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					activeTextId={activeTextId}
					activeBookName={activeBookName}
					activeChapter={activeChapter}
					isChapterSelectionActive={isChapterSelectionActive}
					isVersionSelectionActive={isVersionSelectionActive}
					toggleChapterSelection={this.toggleChapterSelection}
					toggleVersionSelection={this.toggleVersionSelection}
				/>
				<AudioPlayer autoPlay={autoPlayEnabled} toggleAutoPlay={this.toggleAutoPlay} audioSource={audioSource} skipBackward={this.getPrevChapter} skipForward={this.getNextChapter} />
				<TransitionGroup>
					{
						isSettingsModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isSettingsModalActive}>
								<Settings userSettings={userSettings} toggleSettingsModal={this.toggleSettingsModal} />
							</FadeTransition>
						) : null
					}
					{
						isProfileActive ? (
							<FadeTransition classNames="slide-from-left" in={isProfileActive}>
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
							<FadeTransition classNames="slide-from-left" in={isSearchModalActive}>
								<SearchContainer toggleSearchModal={this.toggleSearchModal} />
							</FadeTransition>
						) : null
					}
				</TransitionGroup>
				<Text
					text={updatedText}
					verseNumber={verse}
					highlights={highlights}
					userId={userId}
					userSettings={userSettings}
					activeBookId={activeBookId}
					invalidBibleId={invalidBibleId}
					activeChapter={activeChapter}
					activeBookName={activeBookName}
					notesActive={isNotesModalActive}
					formattedSource={formattedSource}
					userAuthenticated={userAuthenticated}
					loadingNewChapterText={loadingNewChapterText}
					addHighlight={this.addHighlight}
					goToFullChapter={this.goToFullChapter}
					nextChapter={this.getNextChapter}
					prevChapter={this.getPrevChapter}
					setActiveNote={this.setActiveNote}
					toggleNotesModal={this.toggleNotesModal}
					setActiveNotesView={this.setActiveNotesView}
				/>
				<Footer
					settingsActive={isSettingsModalActive}
					profileActive={isProfileActive}
					searchActive={isSearchModalActive}
					notebookActive={isNotesModalActive}
					toggleNotebook={this.toggleNotesModal}
					toggleSettingsModal={this.toggleSettingsModal}
					toggleProfile={this.toggleProfile}
					toggleSearch={this.toggleSearchModal}
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
	userAuthenticated: PropTypes.bool,
	userId: PropTypes.string,
	updatedText: PropTypes.array,
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
	updatedText: selectChapterText(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'homepage', reducer });
const withSaga = injectSaga({ key: 'homepage', saga });
const withTextReducer = injectReducer({ key: 'textSelection', reducer: textReducer });
const withTextSaga = injectSaga({ key: 'textSelection', saga: textSaga });

export default compose(
	withReducer,
	withTextReducer,
	withSaga,
	withTextSaga,
	withConnect,
)(HomePage);
