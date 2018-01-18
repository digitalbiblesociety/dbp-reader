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
import {
	getChapterText,
	setActiveChapter,
	setActiveBookName,
	toggleChapterSelection,
} from 'containers/HomePage/actions';
import BooksTable from 'components/BooksTable';
import SvgWrapper from 'components/SvgWrapper';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import GenericErrorBoundary from 'components/GenericErrorBoundary';
import { setSelectedBookName } from './actions';
import makeSelectChapterSelection, {
	selectBooks,
	selectActiveBookName,
	selectActiveTextId,
	selectActiveChapter,
	selectActiveFilesets,
} from './selectors';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';

export class ChapterSelection extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside);
	}

	setAsideRef = (el) => {
		this.aside = el;
	}

	setSelectedBookName = (book) => this.props.dispatch(setSelectedBookName(book))

	getChapters = (props) => this.props.dispatch(getChapterText({ ...props, audioObjects: this.props.activeFilesets }))

	setActiveChapter = (props) => this.props.dispatch(setActiveChapter(props))

	setActiveBookName = (props) => this.props.dispatch(setActiveBookName(props))

	toggleChapterSelection = (props) => this.props.dispatch(toggleChapterSelection(props))

	handleClickOutside = (event) => {
		const bounds = this.aside.getBoundingClientRect();
		const insideWidth = event.x >= bounds.x && event.x <= bounds.x + bounds.width;
		const insideHeight = event.y >= bounds.y && event.y <= bounds.y + bounds.height;

		if (this.aside && !(insideWidth && insideHeight)) {
			this.toggleChapterSelection();
			document.removeEventListener('click', this.handleClickOutside);
		}
	}

	render() {
		const { selectedBookName } = this.props.chapterselection;
		const {
			activeChapter,
			books,
			activeTextId,
			activeBookName,
		} = this.props;

		return (
			<GenericErrorBoundary affectedArea="ChapterSelection">
				<aside ref={this.setAsideRef} className="chapter-text-dropdown">
					<header>
						<h2 className="text-selection">{`${activeBookName} ${activeChapter}`}</h2>
						<SvgWrapper role="button" tabIndex={0} className="close-icon icon" onClick={this.toggleChapterSelection} svgid="go-up" opacity=".5" />
					</header>
					<BooksTable
						activeChapter={activeChapter}
						setActiveChapter={this.setActiveChapter}
						activeTextId={activeTextId}
						selectedBookName={selectedBookName}
						setSelectedBookName={this.setSelectedBookName}
						toggleChapterSelection={this.toggleChapterSelection}
						getChapterText={this.getChapters}
						setActiveBookName={this.setActiveBookName}
						activeBookName={activeBookName}
						books={books}
					/>
				</aside>
			</GenericErrorBoundary>
		);
	}
}

ChapterSelection.propTypes = {
	dispatch: PropTypes.func.isRequired,
	activeChapter: PropTypes.number.isRequired,
	books: PropTypes.array,
	activeBookName: PropTypes.string.isRequired,
	activeTextId: PropTypes.string.isRequired,
	chapterselection: PropTypes.object.isRequired,
	activeFilesets: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
	chapterselection: makeSelectChapterSelection(),
	activeBookName: selectActiveBookName(),
	activeTextId: selectActiveTextId(),
	activeChapter: selectActiveChapter(),
	books: selectBooks(),
	activeFilesets: selectActiveFilesets(),
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
