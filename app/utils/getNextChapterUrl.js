import { fromJS } from 'immutable';

export default (books, chapter, bookId, textId, verseNumber, chapterText) => {
	const baseUrl = '/bible';

	if (verseNumber && chapterText) {
		const nextVerse = parseInt(verseNumber, 10) + 1 || 1;
		const lastVerse = chapterText.length;

		if (nextVerse <= lastVerse && nextVerse > 0) {
			// The next verse is within a valid range

			return `${baseUrl}/${textId}/${bookId}/${chapter}/${nextVerse}`;
		} else if (nextVerse < 0) {
			// The next verse is below 0 and thus invalid

			return `${baseUrl}/${textId}/${bookId}/${chapter}/1`;
		} else if (nextVerse > lastVerse) {
			// Next verse is above the last verse in the chapter and thus is invalid

			return `${baseUrl}/${textId}/${bookId}/${chapter}/${lastVerse}`;
		}
		return `${baseUrl}/${textId}/${bookId}/${chapter}/${verseNumber}`;
	}

	let activeBookIndex;
	let nextBookIndex;

	books.forEach((book, index) => {
		if (book.book_id.toLowerCase() === bookId) {
			activeBookIndex = index;
			if (index + 1) {
				nextBookIndex = index + 1;
			}
		}
	});

	const nextBook = fromJS(books[nextBookIndex]);
	const activeBook = fromJS(books[activeBookIndex]);
	const maxChapter = activeBook.getIn(['chapters', -1]);

	// If the next book in line doesn't exist and we are already at the last chapter just return
	if (!nextBook.size && chapter === maxChapter) {
		return `${baseUrl}/${textId}/${bookId}/${chapter}`;
	}

	if (chapter === maxChapter) {
		// Need to get the first chapter of the next book
		return `${baseUrl}/${textId}/${nextBook
			.get('book_id')
			.toLowerCase()}/${nextBook.getIn(['chapters', 0])}`;
	}
	const chapterIndex = activeBook
		.get('chapters')
		.findIndex((c) => c === chapter || c > chapter);
	const nextChapterIndex =
		activeBook.getIn(['chapters', chapterIndex]) === chapter
			? chapterIndex + 1
			: chapterIndex;

	return `${baseUrl}/${textId}/${bookId}/${activeBook.getIn([
		'chapters',
		nextChapterIndex,
	])}`;
};
