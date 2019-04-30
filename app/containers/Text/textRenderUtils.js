/**
 * Sets the appropriate classes based on given parameters
 * @param {String} textDirection Can be rtl (right to left) or ltr (left to right)
 * @param {Boolean} menuIsOpen
 */
export const getClassNameForMain = (textDirection, menuIsOpen) => {
  const isRtl = textDirection === 'rtl' ? 'rtl' : '';
  const menuOpenClass = menuIsOpen ? ' menu-is-open' : '';

  return `${isRtl}${menuOpenClass}`;
};
/**
 * Sets the appropriate classes based on given parameters
 * @param {Object} param0 Contains multiple boolean values to determine which classes currently need to be applied
 */
export const getClassNameForTextContainer = ({
  isScrollingDown,
  subFooterOpen,
  videoPlayerOpen,
  hasVideo,
  audioPlayerState,
}) => {
  let classNames = 'text-container';

  if (isScrollingDown) {
    classNames += ' scrolled-down';
  }

  if (videoPlayerOpen && hasVideo) {
    classNames += ' video-player-open';
  }

  if (hasVideo) {
    classNames += ' has-video';
  }

  if (subFooterOpen && !isScrollingDown) {
    classNames += ' sub-footer-open';
  }

  if (audioPlayerState && (!hasVideo || (hasVideo && !videoPlayerOpen))) {
    classNames += ' audio-player-open';
  }

  return classNames;
};
/**
 * Calculates the height needed for the div containing the verse text
 * @param {Boolean} isLargeBp
 * @param {Boolean} isAudioPlayerBp
 * @param {Boolean} isMobileBp
 * @param {Boolean} isScrollingDown
 * @param {String} audioSource The source for the audio player track that is currently selected
 * @param {Boolean} audioPlayerState
 */
export const getInlineStyleForTextContainer = (
  isLargeBp,
  isAudioPlayerBp,
  isMobileBp,
  isScrollingDown,
  audioSource,
  audioPlayerState
) => {
  let headerHeight = 136;

  if (isScrollingDown) {
    headerHeight -= 5;
  }

  if (isLargeBp) {
    headerHeight += 25;

    if (!audioSource || !audioPlayerState) {
      headerHeight -= 56;
    }
  } else if (isAudioPlayerBp) {
    headerHeight += 30;

    if (!audioSource || !audioPlayerState) {
      headerHeight -= 96;
    }
  } else if (isMobileBp) {
    headerHeight += 50;

    if (!audioSource || !audioPlayerState) {
      headerHeight -= 85;
    }
  }

  return {
    height: `calc(100vh - ${headerHeight}px)`,
    maxHeight: `calc(100vh - ${headerHeight}px)`,
  };
};
/**
 * Finds the start of the bible by ordering the books according to their cannon order
 * @param {Array} books
 * @param {String} activeBookId
 * @param {Number} activeChapter
 */
export const isStartOfBible = (books, activeBookId, activeChapter) => {
  if (!books || !books.length) {
    return false;
  }
  // Get book that is the last in bible
  // Need to slice first because sort mutates the given array
  const book = books.slice().sort((a, b) => a.book_order - b.book_order)[0];

  if (!book) {
    return false;
  }
  const chapter = book.chapters[0];
  const bookId = book.book_id;

  return bookId === activeBookId && chapter === activeChapter;
};
/**
 * Finds the end of the bible according to the cannon order
 * @param {Array} books
 * @param {String} activeBookId
 * @param {Number} activeChapter
 */
export const isEndOfBible = (books, activeBookId, activeChapter) => {
  if (!books || !books.length) {
    return false;
  }
  // Get book that is the last in bible
  const book = books.slice().sort((a, b) => b.book_order - a.book_order)[0];

  if (!book) {
    return false;
  }
  const chapters = book.chapters;
  const chapter = chapters[chapters.length - 1];

  const bookId = book.book_id;

  return bookId === activeBookId && chapter === activeChapter;
};
