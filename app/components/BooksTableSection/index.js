/**
*
* BooksTableSection
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import {
	Accordion,
	AccordionItem,
	AccordionItemBody,
	AccordionItemTitle,
} from 'react-accessible-accordion';
import { Link } from 'react-router-dom';

/* Put this in BooksTable if I want to actually use this component
	{
		books.get('OT') ?
		[
			<div key={'ot_title_key'} className={'testament-title'}><h3>Old Testament</h3></div>,
			<div className={'book-list-section'} key={'ot_book_list'}>
				<BooksTableSection
					books={books.get('OT')}
					bookClick={this.handleBookClick}
					chapterClick={this.handleChapterClick}
					activeTextId={activeTextId}
					activeChapter={activeChapter}
					activeBookName={activeBookName}
					selectedBookName={selectedBookName}
				/>
			</div>,
		] :
		null
	}
*/

function BooksTableSection({ books, bookClick, chapterClick, activeTextId, activeChapter, activeBookName, selectedBookName }) {
	return (
		<Accordion>
			{
				books.map((book) => (
					<AccordionItem expanded={book.get('name') === selectedBookName || book.get('name_short') === selectedBookName} className={'accordion-title-style'} key={book.get('book_id')}>
						<AccordionItemTitle
							className={'book-button'}
							tabIndex="0"
							role="button"
							key={(book.get('name') || book.get('name_short')).concat(book.get('book_id')).concat('_title')}
							onClick={(e) => bookClick(e, book.get('name') || book.get('name_short'))}
						>
							{book.get('name')}
						</AccordionItemTitle>
						<AccordionItemBody className={'accordion-body-style'} key={(book.get('name') || book.get('name_short')).concat(book.get('book_id')).concat('_body')}>
							<div className="chapter-container">
								{
									book.get('chapters').map((chapter) => (
										<Link
											to={`/${activeTextId.toLowerCase()}/${book.get('book_id').toLowerCase()}/${chapter}`}
											key={chapter}
											onClick={() => chapterClick(book, chapter)}
											className={'chapter-box'}
										>
											<span className={(activeChapter === chapter && (book.get('name') || book.get('name_short')) === activeBookName) ? 'active-chapter' : ''}>{chapter}</span>
										</Link>
									))
								}
							</div>
						</AccordionItemBody>
					</AccordionItem>
				))
			}
		</Accordion>
	);
}

BooksTableSection.propTypes = {
	books: PropTypes.object,
	bookClick: PropTypes.func,
	chapterClick: PropTypes.func,
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	activeBookName: PropTypes.string,
	selectedBookName: PropTypes.string,
};

export default BooksTableSection;
