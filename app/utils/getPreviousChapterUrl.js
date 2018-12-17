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
		const prevVerse = parseInt(verseNumber, 10) - 1 || 1;
		const lastVerse = chapterText.length;
		// Is it past the max verses for the chapter?
		// if not increment it by 1
		if (prevVerse <= lastVerse && prevVerse > 0) {
			// Verse was valid

			return url({ textId, bookId, chapter, nextVerse: prevVerse, isHref });
		} else if (prevVerse < 0) {
			// Verse was below valid range

			return url({ textId, bookId, chapter, nextVerse: '1', isHref });
		} else if (prevVerse > lastVerse) {
			// Verse was above valid range

			return url({ textId, bookId, chapter, nextVerse: lastVerse, isHref });
		}
		return url({ textId, bookId, chapter, nextVerse: verseNumber, isHref });
	} else if (verseNumber) {
		const nextVerse = parseInt(verseNumber, 10) - 1 || 1;

		if (nextVerse && nextVerse > 0) {
			// The next verse is within a valid range

			return url({ textId, bookId, chapter, nextVerse, isHref });
		} else if (nextVerse < 0) {
			// The next verse is below 0 and thus invalid

			return url({ textId, bookId, chapter, nextVerse: '1', isHref });
		}
		// Worst case just go back to the same verse (In hindsight this may not be the best...)
		return url({ textId, bookId, chapter, nextVerse: verseNumber, isHref });
	}

	if (books[0] && bookId === books[0].book_id && chapter - 1 === 0) {
		return url({ textId, bookId, chapter, isHref });
	}

	let activeBookIndex;
	let previousBookIndex;

	books.forEach((book, index) => {
		if (book.book_id.toLowerCase() === bookId) {
			activeBookIndex = index;

			if (index - 1 >= 0) {
				previousBookIndex = index - 1;
			} else {
				previousBookIndex = index;
			}
		}
	});

	const previousBook =
		fromJS(books[previousBookIndex]) || fromJS({ chapters: [], book_id: '' });
	const activeBook =
		fromJS(books[activeBookIndex]) || fromJS({ chapters: [], book_id: '' });
	if (chapter - 1 === 0) {
		// Goes to the last chapter in the previous book
		return url({
			textId,
			bookId: previousBook.get('book_id').toLowerCase(),
			chapter: previousBook.getIn(['chapters', -1]),
			isHref,
		});
	}
	// If the chapter number is greater than the active chapter then we have gone too far and need to get the previous chapter
	const chapterIndex = activeBook
		.get('chapters')
		.findIndex((c) => c === chapter || c > chapter);

	return url({ textId, bookId, chapter: chapterIndex, isHref });
};
