/**
 *
 * ChaptersContainer
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Link from 'next/link';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function ChaptersContainer({
	bookName,
	bookNameShort,
	bookId,
	selectedBookName,
	chapters,
	activeTextId,
	// book,
	activeChapter,
	activeBookName,
	// handleChapterClick,
}) {
	if (bookName || bookNameShort) {
		return (
			<div
				className={`chapter-container${
					selectedBookName === (bookName || bookNameShort)
						? ' active-book-chapters'
						: ' inactive-book-chapters'
				}`}
			>
				{chapters.map((chapter) => (
					<span className={'chapter-box'} key={chapter}>
						<Link
							href={`/${activeTextId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}`}
							as={`/bible/${activeTextId.toLowerCase()}/${bookId.toLowerCase()}/${chapter}`}
						>
							<a
								// onClick={() => handleChapterClick(book, chapter)}
								className={
									activeChapter === chapter &&
									(bookName || bookNameShort) === activeBookName
										? 'active-chapter'
										: ''
								}
							>
								{chapter}
							</a>
						</Link>
					</span>
				))}
			</div>
		);
	}

	return null;
}

ChaptersContainer.propTypes = {
	activeTextId: PropTypes.string,
	activeChapter: PropTypes.number,
	activeBookName: PropTypes.string,
	// handleChapterClick: PropTypes.func,
	selectedBookName: PropTypes.string,
	bookName: PropTypes.string,
	bookNameShort: PropTypes.string,
	bookId: PropTypes.string,
	chapters: PropTypes.object,
	// book: PropTypes.object,
};

export default ChaptersContainer;
