import url from './hrefLinkOrAsLink';

export default ({
  books,
  chapter,
  bookId,
  textId,
  verseNumber,
  text: chapterText,
  isHref,
  audioType,
}) => {
  if (!books || !books.length) {
    return url({ audioType, textId, bookId, chapter, isHref });
  }
  if (verseNumber && chapterText.length) {
    const nextVerse = parseInt(verseNumber, 10) + 1 || 1;
    const lastVerse = chapterText.length;

    // Handles the verses
    if (nextVerse <= lastVerse && nextVerse > 0) {
      // The next verse is within a valid range
      return url({ audioType, textId, bookId, chapter, nextVerse, isHref });
    } else if (nextVerse < 0) {
      // The next verse is below 0 and thus invalid
      return url({
        audioType,
        textId,
        bookId,
        chapter,
        nextVerse: '1',
        isHref,
      });
    } else if (nextVerse > lastVerse) {
      // Next verse is above the last verse in the chapter and thus is invalid
      return url({
        audioType,
        textId,
        bookId,
        chapter,
        nextVerse: lastVerse,
        isHref,
      });
    }
  } else if (verseNumber) {
    const nextVerse = parseInt(verseNumber, 10) + 1 || 1;

    if (nextVerse && nextVerse > 0) {
      // The next verse is within a valid range
      return url({ audioType, textId, bookId, chapter, nextVerse, isHref });
    } else if (nextVerse < 0) {
      // The next verse is below 0 and thus invalid

      return url({
        audioType,
        textId,
        bookId,
        chapter,
        nextVerse: '1',
        isHref,
      });
      // Need to find a way to do this for formatted text
      // Next verse is above the last verse in the chapter and thus is invalid
    }
  }

  // Handles the chapters
  const activeBook = books.find(
    (book) => book.book_id.toLowerCase() === bookId.toLowerCase(),
  );
  // This relies on the books list already being sorted in ascending book_order
  const nextBook = books.find(
    (book) =>
      book.book_order === activeBook.book_order + 1 ||
      book.book_order > activeBook.book_order,
  );
  const maxChapter = activeBook.chapters[activeBook.chapters.length - 1];
  // If the next book in line doesn't exist and we are already at the last chapter just return
  if (!nextBook && chapter === maxChapter) {
    return url({ audioType, textId, bookId, chapter });
  }

  if (chapter === maxChapter) {
    // Need to get the first chapter of the next book
    return url({
      audioType,
      textId,
      bookId: nextBook.book_id,
      chapter: nextBook.chapters[0],
      isHref,
    });
  }

  const chapterIndex = activeBook.chapters.findIndex(
    (c) => c === chapter || c > chapter,
  );
  const nextChapterNumber =
    activeBook.chapters[chapterIndex] === chapter
      ? activeBook.chapters[chapterIndex + 1]
      : activeBook.chapters[chapterIndex];

  return url({
    audioType,
    textId,
    bookId,
    chapter: nextChapterNumber,
    isHref,
  });
};
