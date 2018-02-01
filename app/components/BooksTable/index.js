/**
*
* BooksTable
*
*/

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PropTypes from 'prop-types';
import {
	getChapterText,
	// setActiveBookName,
	// setActiveChapter,
} from 'containers/HomePage/actions';
import {
	selectActiveTextId,
	selectBooks,
	selectActiveBookName,
	selectActiveChapter,
	selectAudioObjects,
	selectHasPlainText,
} from './selectors';

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		selectedBookName: this.props.initialBookName || '',
	}

	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - 54 - 10;
		}
	}

	setSelectedBookName = (name) => this.setState({ selectedBookName: name })
	// setActiveBookName = ({ book, id }) => this.props.dispatch(setActiveBookName({ book, id }))
	// setActiveChapter = (chapter) => this.props.dispatch(setActiveChapter(chapter))
	getChapterText = ({ bible, book, chapter }) => this.props.dispatch(getChapterText({ bible, book, chapter, audioObjects: this.props.audioObjects, hasPlainText: this.props.hasPlainText }))
	// Doesn't quite work, need to account for the overall height of the scroll container
	// Consider calculating the difference between the top of the clicked button and the
	// top of the active button, then if the clicked button is above the active button: move
	// add the difference to the current scroll position. Otherwise subtract the difference
	handleBookClick = (e, name) => {
		const book = e.target;
		const activeButton = this.button;
		const clickedButton = book.parentElement;
		if (activeButton && activeButton.offsetTop < clickedButton.offsetTop) {
			clickedButton.scrollIntoView();
		}
		// const padding = 10; // distance between each book
		// const distanceToTop = clickedButton.offsetTop; // distance from clicked element to the top
		// const clickedButtonHeight = clickedButton.offsetHeight;
		// const headerHeight = this.container.offsetTop; // height of the header
		// const offsetParentHeight = clickedButton.offsetParent.clientHeight;
		// let distanceToMove = 0;
		//
		// if (activeButton && activeButton.offsetTop < clickedButton.offsetTop) {
		// 	// clicked book is below the active book
		// 	const chaptersHeight = activeButton ? activeButton.offsetHeight : 28; // height of the container that was closed
		// 	distanceToMove = (distanceToTop + clickedButtonHeight) - (padding + headerHeight + chaptersHeight); // distance the clicked element needs to move towards top
		// } else {
		// 	// clicked book is above the active book
		// 	distanceToMove = distanceToTop - (padding + headerHeight);
		// }
		// // console.log(distanceToMove);
		// // console.log(offsetParentHeight);
		// if (distanceToMove >= offsetParentHeight) {
		// 	this.container.scrollTop = distanceToMove - (distanceToMove - offsetParentHeight);
		// } else {
		// 	this.container.scrollTop = distanceToMove;
		// }
		// console.log('clicked book height', clickedButton.offsetHeight);
		// console.log('clicked book distance to top', clickedButton.offsetTop);
		// console.log('clicked book offset parent', clickedButton.offsetParent);
		// console.log('container scroll height', this.container.scrollHeight);
		// console.log('container scrollTop', this.container.scrollTop);
		// console.log('container childElementCount', this.container.childElementCount);
		// console.log('scroll container distance to top', this.container.offsetTop);
		// Could potentially use scrollIntoView() to account for the part of the container that is off the screen

		if (this.state.selectedBookName === name) {
			this.setSelectedBookName('');
		} else {
			this.setSelectedBookName(name);
		}
	}

	isElementInViewport = (el) => {
		const rect = el.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}

	handleChapterClick = (book, chapter) => {
		const {
			activeTextId,
			closeBookTable,
			setActiveChapter,
			setActiveBookName,
		} = this.props;

		this.getChapterText({ bible: activeTextId, book: book.book_id, chapter });
		setActiveChapter(chapter);
		setActiveBookName({ book: book.name || book.name_short, id: book.book_id });
		closeBookTable();
	}

	handleRef = (el, name) => {
		if (name === 'button' && el) {
			const lastChapter = el.lastChild.lastChild;
			const bookName = el.firstChild;

			if (!this.isElementInViewport(lastChapter)) {
				lastChapter.scrollIntoView(false);
			}

			if (!this.isElementInViewport(bookName)) {
				bookName.scrollIntoView();
			}
		}
		this[name] = el;
	}

	render() {
		const {
			books,
			activeChapter,
			activeBookName,
		} = this.props;
		const { selectedBookName } = this.state;

		return (
			<div className="chapter-selection-section">
				<div ref={(el) => this.handleRef(el, 'container')} className="book-container">
					{
						books.map((book) => (
							<div className={'book-button'} ref={(book.name || book.name_short) === selectedBookName ? (el) => this.handleRef(el, 'button') : null} tabIndex="0" role="button" key={book.name || book.name_short} onClick={(e) => this.handleBookClick(e, book.name || book.name_short)}>
								<h4 className={(book.name || book.name_short) === selectedBookName ? 'active-book' : ''}>{book.name || book.name_short}</h4>
								<div className="chapter-container">
									{
										(book.name || book.name_short) === selectedBookName ? book.chapters.map((chapter) => (
											<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => this.handleChapterClick(book, chapter)}>
												<span className={(activeChapter === chapter && (book.name || book.name_short) === activeBookName) ? 'active-chapter' : ''}>{chapter}</span>
											</div>
										)) : null
									}
								</div>
							</div>
						))
					}
				</div>
			</div>
		);
	}
}

BooksTable.propTypes = {
	dispatch: PropTypes.func.isRequired,
	setActiveBookName: PropTypes.func.isRequired, // Set book in parent component
	closeBookTable: PropTypes.func, // closes the window open
	setActiveChapter: PropTypes.func, // Set chapter in parent component
	books: PropTypes.array,
	audioObjects: PropTypes.object,
	activeTextId: PropTypes.string, // parent components active text id
	activeBookName: PropTypes.string, // parent components active book name
	initialBookName: PropTypes.string,
	activeChapter: PropTypes.number, // parent components active chapter
	hasPlainText: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
	books: selectBooks(),
	activeTextId: selectActiveTextId(),
	activeBookName: selectActiveBookName(),
	activeChapter: selectActiveChapter(),
	audioObjects: selectAudioObjects(),
	hasPlainText: selectHasPlainText(),
});

function mapDispatchToProps(dispatch) {
	return {
		dispatch,
	};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(BooksTable);
