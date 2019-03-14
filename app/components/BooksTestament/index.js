/**
 *
 * BooksTestament
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ChaptersContainer from '../ChaptersContainer';
import SvgWrapper from '../SvgWrapper';

const BooksTestament = ({
	books,
	selectedBookName,
	testamentPrefix,
	handleRef,
	handleBookClick,
	handleChapterClick,
	activeBookName,
	activeTextId,
	activeChapter,
	audioType,
	testamentTitle,
}) => [
	<div key={`${testamentPrefix}_title_key`} className={'testament-title'}>
		<h3>{testamentTitle}</h3>
	</div>,
	books.map((book) => (
		<div
			className={'book-button'}
			ref={
				(book.get('name') || book.get('name_short')) === selectedBookName
					? (el) => handleRef(el, 'button')
					: null
			}
			key={(book.get('name') || book.get('name_short')).concat(
				book.get('book_id'),
			)}
			id={(book.get('name') || book.get('name_short')).concat(
				book.get('book_id'),
			)}
			onClick={(e) =>
				handleBookClick(e, book.get('name') || book.get('name_short'))
			}
		>
			<h4
				className={
					(book.get('name') || book.get('name_short')) === selectedBookName
						? 'active-book'
						: ''
				}
			>
				{book.get('name') || book.get('name_short')}
				{book.get('hasVideo') && (
					<SvgWrapper className={'gospel-films'} svgid={'gospel_films'} />
				)}
			</h4>
			<ChaptersContainer
				bookName={book.get('name')}
				audioType={audioType}
				bookNameShort={book.get('name_short')}
				activeTextId={activeTextId}
				activeChapter={activeChapter}
				handleChapterClick={handleChapterClick}
				chapters={book.get('chapters')}
				selectedBookName={selectedBookName}
				activeBookName={activeBookName}
				bookId={book.get('book_id')}
				book={book}
			/>
		</div>
	)),
];

BooksTestament.propTypes = {
	books: PropTypes.object,
	handleRef: PropTypes.func,
	handleBookClick: PropTypes.func,
	handleChapterClick: PropTypes.func,
	activeChapter: PropTypes.number,
	testamentPrefix: PropTypes.string,
	testamentTitle: PropTypes.string,
	selectedBookName: PropTypes.string,
	activeBookName: PropTypes.string,
	activeTextId: PropTypes.string,
	audioType: PropTypes.string,
};

export default BooksTestament;
