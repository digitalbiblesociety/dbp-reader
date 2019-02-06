/**
 *
 * ChaptersContainer
 *
 */

import React from 'react';
import { PropTypes } from 'prop-types';
import Chapter from '../Chapter';
import url from '../../utils/hrefLinkOrAsLink';

function ChaptersContainer({
	bookName,
	bookNameShort,
	bookId,
	audioType,
	selectedBookName,
	chapters,
	activeTextId: textId,
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
				{chapters.map((chapter) => (
					<Chapter
						key={`${bookName}-${chapter}`}
						active={
							chapter === activeChapter &&
							(bookName || bookNameShort) === activeBookName
						}
						chapter={chapter}
						href={url({ textId, bookId, chapter, isHref: true, audioType })}
						as={url({ textId, bookId, chapter, isHref: false, audioType })}
						clickHandler={handleChapterClick}
					/>
				))}
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
	audioType: PropTypes.string,
	chapters: PropTypes.object,
};

export default ChaptersContainer;
