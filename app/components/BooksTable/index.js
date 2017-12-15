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
		const { active, activeTextId, books, activeBookName, setActiveBookName, getChapterText, toggleTextSelection } = this.props;
		if (active) {
			return (
				<div>
					<div className="book-chapter-header">
						<div className={activeBookName ? 'book-text' : 'book-text-active'} role="button" tabIndex="0" onClick={() => setActiveBookName('')}><h1>Book & Chapter</h1></div>
					</div>
					{
						<div className="book-container">
							{
								books.map((book) => (
									<div tabIndex="0" role="button" key={book.name} onClick={() => setActiveBookName(book.name)}>
										<h4>{book.name}</h4>
										<div className="chapter-container">
											{
												book.name === activeBookName ? book.chapters.map((chapter) => (
													<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => { getChapterText({ bible: activeTextId, book: book.book_id, chapter }); toggleTextSelection(); }}>
														{chapter}
													</div>
												)) : null
											}
										</div>
									</div>
								))
							}
						</div>
					}
				</div>
			);
		}
		return (
			<section className="book-chapter-header">
				<div role="button" tabIndex="0" onClick={() => setActiveBookName('')}><h1>Book & Chapter</h1></div>
			</section>
		);
	}
}

BooksTable.propTypes = {
	books: PropTypes.array,
	active: PropTypes.bool,
	setActiveBookName: PropTypes.func.isRequired,
	activeBookName: PropTypes.string,
	getChapterText: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	activeTextId: PropTypes.string,
};

export default BooksTable;
