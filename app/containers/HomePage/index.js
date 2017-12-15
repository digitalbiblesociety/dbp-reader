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
import NavigationBar from 'components/NavigationBar';
import TextSelection from 'containers/TextSelection';
import Text from 'components/Text';
import Settings from 'containers/Settings';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import {
	toggleTextSelection,
	toggleSettingsModal,
	setActiveBookName,
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

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal());

	toggleTextSelection = () => this.props.dispatch(toggleTextSelection());

	render() {
		const {
			activeTextName,
			chapterText,
			isChapterActive,
			isSettingsModalActive,
			textSelectionActive,
			activeBookName,
		} = this.props.homepage;

		return (
			<GenericErrorBoundary>
				<Helmet>
					<title>Home Page</title>
					<meta name="description" content="Home page for bible.is" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					activeBookName={activeBookName}
					toggleTextSelection={this.toggleTextSelection}
					toggleSettingsModal={this.toggleSettingsModal}
				/>
				{
					textSelectionActive ? (
						(<TextSelection
							activeBookName={activeBookName}
							getChapters={this.getChapters}
							setActiveBookName={this.setActiveBookName}
							toggleTextSelection={this.toggleTextSelection}
						/>)
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
