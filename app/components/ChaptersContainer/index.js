/**
 *
 * ChaptersContainer
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Link from 'next/link';

function ChaptersContainer({
	bookName,
	bookNameShort,
	bookId,
	selectedBookName,
	chapters,
	activeTextId,
	activeChapter,
	activeBookName,
	handleChapterClick,
}) {
	if (bookName || bookNameShort) {
		return (
			<span
				className={`chapter-container${
					selectedBookName === (bookName || bookNameShort)
						? ' active-book-chapters'
						: ' inactive-book-chapters'
				}`}
			>
				{chapters.map(
					(chapter) =>
						chapter === activeChapter &&
						(bookName || bookNameShort) === activeBookName ? (
							<a className={'chapter-box'} onClick={() => handleChapterClick()}>
								<span className={'active-chapter'}>{chapter}</span>
							</a>
						) : (
							<Link
								href={`/app?bibleId=${activeTextId.toLowerCase()}&bookId=${bookId.toLowerCase()}&chapter=${chapter}`}
								as={`/bible/${activeTextId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}`}
								key={chapter}
							>
								<a
									className={'chapter-box'}
									onClick={() => handleChapterClick()}
								>
									<span>{chapter}</span>
								</a>
							</Link>
						),
				)}
			</span>
		);
	}

	return null;
}

ChaptersContainer.propTypes = {
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	activeBookName: PropTypes.string,
	handleChapterClick: PropTypes.func,
	selectedBookName: PropTypes.string,
	bookName: PropTypes.string,
	bookNameShort: PropTypes.string,
	bookId: PropTypes.string,
	chapters: PropTypes.object,
};

export default ChaptersContainer;
