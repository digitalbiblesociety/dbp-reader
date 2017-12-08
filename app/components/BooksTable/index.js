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

class BooksTable extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	render() {
		const { books, activeBookName, setActiveBookName, getChapterText } = this.props;

		return (
			<div className="row centered books-dropdown">
				<div className="centered small-6 shadow">
					<div className="book-chapter-header">
						<div role="button" tabIndex="0" onClick={() => setActiveBookName('')}><h1>Book</h1></div><div><h1>{activeBookName || 'Chapter'}</h1></div>
					</div>
				</div>
				{
					activeBookName ? books.filter((book) => book.name === activeBookName).map((book) => (
						<div key={book.name} className="centered small-6 chapter-container">
							{
								book.chapters.map((chapter) => (
									<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => getChapterText({ book: book.book_id, chapter })}>
										{chapter}
									</div>
								))
							}
						</div>
					)) :
					books.map((book) => (<div tabIndex="0" role="button" key={book.name} onClick={() => setActiveBookName(book.name)} className="centered small-6 shadow">{book.name}</div>))
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
};

export default BooksTable;
