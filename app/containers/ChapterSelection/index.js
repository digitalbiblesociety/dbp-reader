/**
 *
 * ChapterSelection
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import BooksTable from 'components/BooksTable';
import menu from 'images/menu.svg';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { getBooks, setSelectedBookName } from './actions';
import makeSelectChapterSelection from './selectors';
import reducer from './reducer';
import saga from './saga';

// import messages from './messages';

export class ChapterSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		const { activeTextId } = this.props;

		this.props.dispatch(getBooks({ textId: activeTextId }));
	}

	setSelectedBookName = (book) => this.props.dispatch(setSelectedBookName(book))

	render() {
		const { books, selectedBookName } = this.props.chapterselection;
		const {
			setActiveChapter,
			setActiveBookName,
			activeChapter,
			getChapters,
			activeTextId,
			toggleChapterSelection,
			activeBookName,
		} = this.props;
		return (
			<aside className="chapter-text-dropdown">
				<header>
					<h2 className="text-selection">{`${activeBookName} ${activeChapter}`}</h2>
					<span role="button" tabIndex={0} className="close-icon" onClick={toggleChapterSelection}>
						<svg className="icon"><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref={`${menu}#close`}></use></svg>
					</span>
				</header>
				<BooksTable
					activeChapter={activeChapter}
					setActiveChapter={setActiveChapter}
					activeTextId={activeTextId}
					selectedBookName={selectedBookName}
					setSelectedBookName={this.setSelectedBookName}
					toggleChapterSelection={toggleChapterSelection}
					getChapterText={getChapters}
					setActiveBookName={setActiveBookName}
					activeBookName={activeBookName}
					books={books}
				/>
			</aside>
		);
	}
}

ChapterSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	activeChapter: PropTypes.number.isRequired,
	activeBookName: PropTypes.string.isRequired,
	activeTextId: PropTypes.string.isRequired,
	getChapters: PropTypes.func.isRequired,
	setActiveChapter: PropTypes.func.isRequired,
	setActiveBookName: PropTypes.func.isRequired,
	toggleChapterSelection: PropTypes.func.isRequired,
	chapterselection: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
	chapterselection: makeSelectChapterSelection(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'chapterSelection', reducer });
const withSaga = injectSaga({ key: 'chapterSelection', saga });

export default compose(
	withReducer,
	withSaga,
	withConnect,
)(ChapterSelection);
