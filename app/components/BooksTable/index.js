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
		const { books, activeBookName, setActiveBookName, getChapterText, toggleTextSelection } = this.props;

		return (
			<div className="row centered books-dropdown">
				<div className="book-chapter-header">
					<div className={activeBookName ? 'book-text' : 'book-text-active'} role="button" tabIndex="0" onClick={() => setActiveBookName('')}><h1>Book</h1></div><div className={activeBookName ? 'chapter-text-active' : 'chapter-text'}><h1>{activeBookName || 'Chapter'}</h1></div>
				</div>
				{
					activeBookName ? books.filter((book) => book.name === activeBookName).map((book) => (
						<div key={book.name} className="chapter-container">
							{
								book.chapters.map((chapter) => (
									<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => { getChapterText({ book: book.book_id, chapter }); toggleTextSelection(); }}>
										{chapter}
									</div>
								))
							}
						</div>
					)) : (
						<div className="book-container">
							{
								books.map((book) => (<div tabIndex="0" role="button" key={book.name} onClick={() => setActiveBookName(book.name)}>{book.name}</div>))
							}
						</div>
					)
				}
			</div>
		);
	}
}

BooksTable.propTypes = {
	books: PropTypes.array,
	setActiveBookName: PropTypes.func.isRequired,
	activeBookName: PropTypes.string,
	getChapterText: PropTypes.func,
	toggleTextSelection: PropTypes.func,
};

export default BooksTable;
