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
import TextSelection from 'components/TextSelection';
import Text from 'components/Text';
import Settings from 'containers/Settings';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
// import BooksTable from 'components/BooksTable';

import { getTexts, getLanguages, toggleBibleNames, toggleBookNames, setActiveBookName, toggleSettingsModal, getBooks, getChapterText, setActiveText } from './actions';
import makeSelectHomePage, { selectTexts, selectLanguages } from './selectors';
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
		this.props.dispatch(getBooks({ textId: activeTextId }));
		this.props.dispatch(getLanguages());
		this.props.dispatch(getTexts());
	}

	getBooksForText = ({ textId }) => this.props.dispatch(getBooks({ textId }));

	getChapterText = ({ book, chapter }) => this.props.dispatch(getChapterText({ bible: this.props.homepage.activeTextId, book, chapter }));

	setActiveBookName = (bookName) => this.props.dispatch(setActiveBookName(bookName));

	setActiveText = ({ textName, textId }) => this.props.dispatch(setActiveText({ textName, textId }));

	toggleBibleNames = () => this.props.dispatch(toggleBibleNames());

	toggleBookNames = () => this.props.dispatch(toggleBookNames());

	toggleSettingsModal = () => this.props.dispatch(toggleSettingsModal());

	render() {
		const {
			activeTextName,
			isBibleTableActive,
			isBookTableActive,
			chapterText,
			isChapterActive,
			isSettingsModalActive,
		} = this.props.homepage;
		const { texts, languages } = this.props;

		return (
			<GenericErrorBoundary>
				<Helmet>
					<title>Home Page</title>
					<meta name="description" content="Home page for bible.is" />
				</Helmet>
				<NavigationBar
					activeTextName={activeTextName}
					toggleBibleNames={this.toggleBibleNames}
					toggleBookNames={this.toggleBookNames}
					toggleSettingsModal={this.toggleSettingsModal}
				/>
				{
					isBibleTableActive || isBookTableActive ? (
						(<TextSelection
							{...this.props.homepage}
							bibles={texts}
							languages={languages}
							setActiveBookName={this.setActiveBookName}
							getChapterText={this.getChapterText}
							getBooksForText={this.getBooksForText}
							setActiveText={this.setActiveText}
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
	texts: PropTypes.object,
	languages: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
	homepage: makeSelectHomePage(),
	texts: selectTexts(),
	languages: selectLanguages(),
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
