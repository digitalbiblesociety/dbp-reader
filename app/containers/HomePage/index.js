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
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import Settings from 'containers/Settings';
import AudioPlayer from 'containers/AudioPlayer';
import TextSelection from 'containers/TextSelection';
import ChapterSelection from 'containers/ChapterSelection';
import Profile from 'containers/Profile';
import NavigationBar from 'components/NavigationBar';
import Text from 'components/Text';
import MenuBar from 'components/MenuBar';
import Footer from 'components/Footer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import {
	toggleMenuBar,
	toggleProfile,
	toggleChapterSelection,
	toggleSettingsModal,
	toggleVersionSelection,
	setActiveBookName,
	setActiveChapter,
	setActiveTextId,
	getChapterText,
} from './actions';
import makeSelectHomePage from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const {
			activeTextId,
			initialBookId,
		} = this.props.homepage;

		this.props.dispatch(getChapterText({ bible: activeTextId, book: initialBookId, chapter: 1 }));
	}

	getChapters = ({ bible, book, chapter }) => this.props.dispatch(getChapterText({ bible, book, chapter }));

	setActiveBookName = (bookName) => this.props.dispatch(setActiveBookName(bookName));

	setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter));

	setActiveTextId = (props) => this.props.dispatch(setActiveTextId(props));

	toggleMenuBar = () => this.props.dispatch(toggleMenuBar());

	toggleProfile = () => this.props.dispatch(toggleProfile());

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal());

	toggleChapterSelection = () => this.props.dispatch(toggleChapterSelection());

	toggleVersionSelection = () => this.props.dispatch(toggleVersionSelection());

	render() {
		const {
			activeTextName,
			activeTextId,
			chapterText,
			isChapterActive,
			isSettingsModalActive,
			isVersionSelectionActive,
			isChapterSelectionActive,
			activeBookName,
			isMenuBarActive,
			activeChapter,
			isProfileActive,
		} = this.props.homepage;

		return (
			<GenericErrorBoundary>
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
				<AudioPlayer />
				{
					isChapterSelectionActive ? (
						<ChapterSelection
							activeBookName={activeBookName}
							activeChapter={activeChapter}
							activeTextId={activeTextId}
							getChapters={this.getChapters}
							setActiveBookName={this.setActiveBookName}
							setActiveChapter={this.setActiveChapter}
							toggleChapterSelection={this.toggleChapterSelection}
						/>
					) : null
				}
				{
					isVersionSelectionActive ? (
						<TextSelection
							activeBookName={activeBookName}
							activeChapter={activeChapter}
							activeTextName={activeTextName}
							setActiveText={this.setActiveTextId}
							getChapters={this.getChapters}
							setActiveBookName={this.setActiveBookName}
							setActiveChapter={this.setActiveChapter}
							toggleVersionSelection={this.toggleVersionSelection}
						/>
					) : null
				}
				{
					isChapterActive ? (
						<Text text={chapterText} />
					) : null
				}
				{
					isSettingsModalActive ? (
						<Settings toggleSettingsModal={this.toggleSettingsModal} />
					) : null
				}
				{
					isMenuBarActive ? (
						<MenuBar toggleMenuBar={this.toggleMenuBar} />
					) : null
				}
				{
					isProfileActive ? (
						<Profile toggleProfile={this.toggleProfile} />
					) : null
				}
				<Footer toggleSettingsModal={this.toggleSettingsModal} />
			</GenericErrorBoundary>
		);
	}
}

HomePage.propTypes = {
	dispatch: PropTypes.func.isRequired,
	homepage: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
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
