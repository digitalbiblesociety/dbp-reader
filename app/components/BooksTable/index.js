/**
*
* BooksTable
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import ChaptersCell from './ChaptersCell';
// import styled from 'styled-components';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';
// TODO: change logic for rendering chapter to use isBookActive instead of activeBookName

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	componentDidMount() {
		if (this.button && this.container) {
			this.container.scrollTop = this.button.offsetTop - this.container.offsetTop;
		}
	}
	// Doesn't quite work, need to account for the closing of the chapters
	handleBookClick = (e, name) => {
		const book = e.target;
		const bookButton = book.parentElement;
		const bookContainer = bookButton.parentElement;
		bookContainer.scrollTop = (bookButton.offsetTop - bookContainer.offsetTop) - 5;
		this.props.setSelectedBookName(name);
	}

	handleRef = (el, name) => {
		this[name] = el;
	}

	render() {
		const {
			activeTextId,
			books,
			selectedBookName,
			activeChapter,
			setActiveBookName,
			setActiveChapter,
			getChapterText,
		} = this.props;

		return (
			<div className="chapter-selection-section">
				<div ref={(el) => this.handleRef(el, 'container')} className="book-container">
					{
						books.map((book) => (
							<div className={'book-button'} ref={book.name === selectedBookName ? (el) => this.handleRef(el, 'button') : null} tabIndex="0" role="button" key={book.name} onClick={(e) => this.handleBookClick(e, book.name)}>
								<h4 className={book.name === selectedBookName ? 'active-book' : ''}>{book.name}</h4>
								<div className="chapter-container">
									{
										book.name === selectedBookName ? book.chapters.map((chapter) => (
											<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => { getChapterText({ bible: activeTextId, book: book.book_id, chapter }); setActiveChapter(chapter); setActiveBookName(book.name, book.book_id); }}>
												<span className={activeChapter === chapter ? 'active-chapter' : ''}>{chapter}</span>
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
	setSelectedBookName: PropTypes.func,
	setActiveChapter: PropTypes.func,
	selectedBookName: PropTypes.string,
	getChapterText: PropTypes.func,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
};

export default BooksTable;
