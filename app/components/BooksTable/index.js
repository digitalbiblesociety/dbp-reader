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
			active,
			activeTextId,
			toggleVersionList,
			books,
			activeBookName,
			activeChapter,
			setActiveBookName,
			setActiveChapter,
			setBookListState,
			getChapterText,
			toggleTextSelection,
			toggleLanguageList,
		} = this.props;
		if (active) {
			return (
				<div className="text-selection-section">
					<div>
						<i>icon</i>
						<span className="book-header">Book & Chapter:</span>
					</div>
					{
						<div className="book-container">
							{
								books.map((book) => (
									<div className="book-button" tabIndex="0" role="button" key={book.name} onClick={() => setActiveBookName(book.name)}>
										<h4 className={book.name === activeBookName ? 'selected-book' : ''}>{book.name}</h4>
										<div className="chapter-container">
											{
												book.name === activeBookName ? book.chapters.map((chapter) => (
													<div role="button" tabIndex="0" key={chapter} className="chapter-box" onClick={() => { getChapterText({ bible: activeTextId, book: book.book_id, chapter }); toggleTextSelection(); setActiveChapter(chapter); }}>
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
			<div className="text-selection-section closed" role="button" tabIndex="0" onClick={() => { setBookListState({ state: true }); toggleVersionList({ state: false }); toggleLanguageList({ state: false }); }}>
				<i>icon</i>
				<span className="book-header">{`${activeBookName} ${activeChapter}`}</span>
			</div>
		);
	}
}

BooksTable.propTypes = {
	books: PropTypes.array,
	active: PropTypes.bool,
	setActiveBookName: PropTypes.func.isRequired,
	setActiveChapter: PropTypes.func,
	activeBookName: PropTypes.string,
	getChapterText: PropTypes.func,
	toggleTextSelection: PropTypes.func,
	setBookListState: PropTypes.func,
	toggleVersionList: PropTypes.func,
	toggleLanguageList: PropTypes.func,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
};

export default BooksTable;
