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
	render() {
		const {
			activeTextId,
			books,
			selectedBookName,
			activeChapter,
			setActiveBookName,
			setSelectedBookName,
			setActiveChapter,
			getChapterText,
		} = this.props;
		return (
			<div className="text-selection-section">
				<div className="book-container">
					{
						books.map((book) => (
							<div className="book-button" tabIndex="0" role="button" key={book.name} onClick={() => setSelectedBookName(book.name)}>
								<h4 className={book.name === selectedBookName ? 'selected-book' : ''}>{book.name}</h4>
								<div className="chapter-container">
									{
										book.name === selectedBookName ? book.chapters.map((chapter) => (
											<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => { getChapterText({ bible: activeTextId, book: book.book_id, chapter }); setActiveChapter(chapter); setActiveBookName(book.name); }}>
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
