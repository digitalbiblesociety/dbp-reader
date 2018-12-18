import { fromJS } from 'immutable';
import url from './hrefLinkOrAsLink';

export default ({
	books,
	chapter,
	bookId,
	textId,
	verseNumber,
	text: chapterText,
	isHref,
}) => {
	if (verseNumber && chapterText.length) {
		const nextVerse = parseInt(verseNumber, 10) + 1 || 1;
		const lastVerse = chapterText.length;

		if (nextVerse <= lastVerse && nextVerse > 0) {
			// The next verse is within a valid range
			return url({ textId, bookId, chapter, nextVerse, isHref });
		} else if (nextVerse < 0) {
			// The next verse is below 0 and thus invalid
			return url({ textId, bookId, chapter, nextVerse: '1', isHref });
		} else if (nextVerse > lastVerse) {
			// Next verse is above the last verse in the chapter and thus is invalid
			return url({ textId, bookId, chapter, nextVerse: lastVerse, isHref });
		}
		return url({ textId, bookId, chapter, nextVerse: verseNumber, isHref });
	} else if (verseNumber) {
		const nextVerse = parseInt(verseNumber, 10) + 1 || 1;

		if (nextVerse && nextVerse > 0) {
			// The next verse is within a valid range
			return url({ textId, bookId, chapter, nextVerse, isHref });
		} else if (nextVerse < 0) {
			// The next verse is below 0 and thus invalid

			return url({ textId, bookId, chapter, nextVerse: '1', isHref });
			// Need to find a way to do this for formatted text
			// Next verse is above the last verse in the chapter and thus is invalid
		}
		// Worst case just go back to the same verse (In hindsight this may not be the best...)
		return url({ textId, bookId, chapter, nextVerse: verseNumber, isHref });
	}

	let activeBookIndex;
	let nextBookIndex;

	books.forEach((book, index) => {
		if (book.book_id.toLowerCase() === bookId) {
			activeBookIndex = index;
			if (index + 1 <= books.length - 1) {
				nextBookIndex = index + 1;
			} else {
				nextBookIndex = index;
			}
		}
	});

	const nextBook =
		fromJS(books[nextBookIndex]) || fromJS({ chapters: [1], book_id: '' });
	const activeBook =
		fromJS(books[activeBookIndex]) || fromJS({ chapters: [1], book_id: '' });
	const maxChapter = activeBook.getIn(['chapters', -1]);

	// If the next book in line doesn't exist and we are already at the last chapter just return
	if (!nextBook.size && chapter === maxChapter) {
		return url({ textId, bookId, chapter });
	}

	if (chapter === maxChapter) {
		// Need to get the first chapter of the next book
		return url({
			textId,
			bookId: nextBook.get('book_id').toLowerCase(),
			chapter: nextBook.getIn(['chapters', 0]),
			isHref,
		});
	}
	const chapterIndex = activeBook
		.get('chapters')
		.findIndex((c) => c === chapter || c > chapter);
	const nextChapterIndex =
		activeBook.getIn(['chapters', chapterIndex]) === chapter
			? chapterIndex + 1
			: chapterIndex;

	return url({
		textId,
		bookId,
		chapter: activeBook.getIn(['chapters', nextChapterIndex]),
		isHref,
	});
};
