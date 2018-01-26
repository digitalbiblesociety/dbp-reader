/**
*
* BooksTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - 54 - 10;
		}
	}
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

		if (this.props.selectedBookName === name) {
			this.props.setSelectedBookName('');
		} else {
			this.props.setSelectedBookName(name);
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
			setActiveBookName,
			setActiveChapter,
			getChapterText,
			toggleChapterSelection,
		} = this.props;

		getChapterText({ bible: activeTextId, book: book.book_id, chapter });
		setActiveChapter(chapter);
		setActiveBookName({ book: book.name || book.name_short, id: book.book_id });
		toggleChapterSelection();
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
			selectedBookName,
			activeChapter,
			activeBookName,
		} = this.props;

		return (
			<div className="chapter-selection-section">
				<div ref={(el) => this.handleRef(el, 'container')} className="book-container">
					{
						books.map((book) => (
							<div className={'book-button'} ref={(book.name || book.name_short) === selectedBookName ? (el) => this.handleRef(el, 'button') : null} tabIndex="0" role="button" key={book.name || book.name_short} onClick={(e) => this.handleBookClick(e, book.name || book.name_short)}>
								<h4 className={(book.name || book.name_short) === selectedBookName ? 'active-book' : ''}>{book.name || book.name_short}</h4>
								<div className="chapter-container">
									{
										book.name === selectedBookName ? book.chapters.map((chapter) => (
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
	books: PropTypes.array,
	setActiveBookName: PropTypes.func.isRequired,
	toggleChapterSelection: PropTypes.func,
	setSelectedBookName: PropTypes.func,
	setActiveChapter: PropTypes.func,
	selectedBookName: PropTypes.string,
	getChapterText: PropTypes.func,
	activeTextId: PropTypes.string,
	activeBookName: PropTypes.string,
	activeChapter: PropTypes.number,
};

export default BooksTable;
