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
import SvgWrapper from 'components/SvgWrapper';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { setSelectedBookName } from './actions';
import makeSelectChapterSelection from './selectors';
import reducer from './reducer';
import saga from './saga';

// import messages from './messages';

export class ChapterSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		if (document.onclick) {
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	setRef = (node) => {
		this.ref = node;
	}

	setSelectedBookName = (book) => this.props.dispatch(setSelectedBookName(book))

	handleClickOutside = (event) => {
		const bounds = this.ref.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.ref && !(insideWidth && insideHeight)) {
			this.props.toggleChapterSelection();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	render() {
		const { selectedBookName } = this.props.chapterselection;
		const {
			setActiveChapter,
			setActiveBookName,
			activeChapter,
			getChapters,
			books,
			activeTextId,
			toggleChapterSelection,
			activeBookName,
		} = this.props;
		return (
			<aside ref={this.setRef} className="chapter-text-dropdown">
				<header>
					<h2 className="text-selection">{`${activeBookName} ${activeChapter}`}</h2>
					<SvgWrapper role="button" tabIndex={0} className="close-icon icon" onClick={toggleChapterSelection} svgid="go-up" opacity=".5" />
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
	books: PropTypes.array,
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
