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
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { TransitionGroup } from 'react-transition-group';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { fromJS, is } from 'immutable';
import Settings from 'containers/Settings';
import AudioPlayer from 'containers/AudioPlayer';
import TextSelection from 'containers/TextSelection';
import ChapterSelection from 'containers/ChapterSelection';
import Profile from 'containers/Profile';
import Notes from 'containers/Notes';
import Text from 'containers/Text';
import NavigationBar from 'components/NavigationBar';
import MenuBar from 'components/MenuBar';
import Information from 'components/Information';
import Footer from 'components/Footer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import FadeTransition from 'components/FadeTransition';
import {
	getBooks,
	getAudio,
	toggleMenuBar,
	toggleProfile,
	toggleChapterSelection,
	toggleNotesModal,
	toggleSettingsModal,
	toggleVersionSelection,
	toggleInformationModal,
	setActiveBookName,
	setActiveChapter,
	setActiveTextId,
	setActiveNotesView,
	getChapterText,
	updateSelectedText,
} from './actions';
import makeSelectHomePage, {
	selectActiveBook,
	selectPrevBook,
	selectNextBook,
	selectSettings,
	selectFormattedText,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const {
			activeTextId,
			activeBookId,
			activeChapter,
			activeFilesets,
			audioObjects,
		} = this.props.homepage;

		this.props.dispatch(getAudio({ list: fromJS(activeFilesets) }));
		this.props.dispatch(getBooks({ textId: activeTextId }));
		this.props.dispatch(getChapterText({ bible: activeTextId, book: activeBookId, chapter: activeChapter, audioObjects }));
		// Need to get the audio for the initial chapter
	}

	componentWillReceiveProps(nextProps) {
		const nextBooks = fromJS(nextProps.homepage.books);
		const curBooks = fromJS(this.props.homepage.books);
		// can probably use find to get the current book if the new version
		// has it
		const nextBookId = nextBooks.getIn([0, 'book_id']);
		const nextBookName = nextBooks.getIn([0, 'name']);
		const chapter = nextBooks.getIn([0, 'chapters', 0]);
		// Solving the issue of requesting the new data from the
		// api when a new version is clicked
		if (nextProps.homepage.activeTextId !== this.props.homepage.activeTextId) {
			this.getBooks(nextProps.homepage.activeTextId);
			this.toggleChapterSelection();
		} else if (!is(nextBooks, curBooks) && curBooks.size) {
			this.setActiveBookName({ book: nextBookName, id: nextBookId });
			this.getChapters({ bible: nextProps.homepage.activeTextId, book: nextBookId, chapter, audioObjects: nextProps.audioObjects });
		}
	}

	getNextChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			audioObjects,
		} = this.props.homepage;
		const { activeBook, nextBook } = this.props;
		const maxChapter = activeBook.get('chapters').size;

		if (activeChapter === maxChapter) {
			this.setActiveBookName({ book: nextBook.get('name'), id: nextBook.get('book_id') });
			this.getChapters({ bible: activeTextId, book: nextBook.get('book_id'), chapter: 1, audioObjects });
			this.setActiveChapter(1);
		} else {
			this.getChapters({ bible: activeTextId, book: activeBookId, chapter: activeChapter + 1, audioObjects });
			this.setActiveChapter(activeChapter + 1);
		}
	}

	getPrevChapter = () => {
		const {
			activeTextId,
			activeChapter,
			activeBookId,
			audioObjects,
		} = this.props.homepage;
		const { previousBook } = this.props;

		if (activeChapter - 1 === 0) {
			const lastChapter = previousBook.get('chapters').size;
			this.setActiveBookName({ book: previousBook.get('name'), id: previousBook.get('book_id') });
			this.getChapters({ bible: activeTextId, book: previousBook.get('book_id'), chapter: lastChapter, audioObjects });
			this.setActiveChapter(lastChapter);
		} else {
			this.getChapters({ bible: activeTextId, book: activeBookId, chapter: activeChapter - 1, audioObjects });
			this.setActiveChapter(activeChapter - 1);
		}
	}

	getBooks = (textId) => this.props.dispatch(getBooks({ textId }))

	getAudio = ({ list }) => this.props.dispatch(getAudio({ list }))

	getChapters = ({ bible, book, chapter }) => this.props.dispatch(getChapterText({ bible, book, chapter, audioObjects: this.props.homepage.audioObjects }))

	setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))

	setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props))

	setActiveNotesView = (view) => this.props.dispatch(setActiveNotesView(view))

	updateSelectedText = ({ text }) => this.props.dispatch(updateSelectedText({ text }))

	toggleMenuBar = () => this.props.dispatch(toggleMenuBar())

	toggleProfile = () => this.props.dispatch(toggleProfile())

	toggleNotesModal = () => this.props.dispatch(toggleNotesModal())

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal())

	toggleChapterSelection = () => this.props.dispatch(toggleChapterSelection())

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection())

	toggleInformationModal = () => this.props.dispatch(toggleInformationModal())

	render() {
		const {
			activeTextName,
			activeTextId,
			chapterText,
			isSettingsModalActive,
			isNotesModalActive,
			isVersionSelectionActive,
			isChapterSelectionActive,
			isInformationModalActive,
			activeBookName,
			isMenuBarActive,
			activeChapter,
			isProfileActive,
			copywrite,
			audioSource,
			activeNotesView,
			formattedTextActive,
		} = this.props.homepage;

		const {
			userSettings,
			formattedText,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="Your entire app is corrupted and bad, try again!">
				<Helmet>
					<title>Home Page</title>
					<meta name="description" content="Home page for bible.is" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					activeTextId={activeTextId}
					activeBookName={activeBookName}
					activeChapter={activeChapter}
					toggleMenuBar={this.toggleMenuBar}
					toggleProfile={this.toggleProfile}
					toggleChapterSelection={this.toggleChapterSelection}
					toggleVersionSelection={this.toggleVersionSelection}
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
									activeBookName={activeBookName}
									activeTextName={activeTextName}
									getAudio={this.getAudio}
									setActiveText={this.setActiveTextId}
									setActiveChapter={this.setActiveChapter}
									toggleVersionSelection={this.toggleVersionSelection}
								/>
							</FadeTransition>
						) : null
					}
					{
						isSettingsModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isSettingsModalActive}>
								<Settings userSettings={userSettings} toggleSettingsModal={this.toggleSettingsModal} />
							</FadeTransition>
						) : null
					}
					{
						isMenuBarActive ? (
							<FadeTransition classNames="slide-from-left" in={isSettingsModalActive}>
								<MenuBar toggleMenuBar={this.toggleMenuBar} />
							</FadeTransition>
						) : null
					}
					{
						isProfileActive ? (
							<FadeTransition classNames="slide-from-right" in={isSettingsModalActive}>
								<Profile toggleProfile={this.toggleProfile} />
							</FadeTransition>
						) : null
					}
					{
						isNotesModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isNotesModalActive}>
								<Notes toggleNotesModal={this.toggleNotesModal} openView={activeNotesView} />
							</FadeTransition>
						) : null
					}
					{
						isInformationModalActive ? (
							<FadeTransition classNames="slide-from-right" in={isInformationModalActive}>
								<Information copywrite={copywrite} toggleInformationModal={this.toggleInformationModal} />
							</FadeTransition>
						) : null
					}
				</TransitionGroup>
				<Text formattedText={formattedText} formattedTextActive={formattedTextActive} oneVersePerLine={userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active'])} readersMode={userSettings.getIn(['toggleOptions', 'readersMode', 'active'])} setActiveNotesView={this.setActiveNotesView} activeBookName={activeBookName} activeChapter={activeChapter} notesActive={isNotesModalActive} toggleNotesModal={this.toggleNotesModal} text={chapterText} nextChapter={this.getNextChapter} prevChapter={this.getPrevChapter} />
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
	formattedText: PropTypes.string,
};
// TODO: Sort books in selector
const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	previousBook: selectPrevBook(),
	nextBook: selectNextBook(),
	activeBook: selectActiveBook(),
	userSettings: selectSettings(),
	formattedText: selectFormattedText(),
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
