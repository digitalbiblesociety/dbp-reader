import getPreviousChapter from '../getPreviousChapterUrl';
import { books } from '../testUtils/booksData';

const params = {
  books,
  chapter: 2,
  bookId: 'MAT',
  textId: 'ENGESV',
  verseNumber: 0,
  text: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  isHref: false,
  audioType: 'audio_drama',
};

describe('getPreviousChapter utility function', () => {
  it('should return the expected url for default parameters', () => {
    const url = getPreviousChapter(params);
    expect(url).toEqual('/bible/ENGESV/MAT/1?audio_type=audio_drama');
  });
  it('should return the expected url for default parameters as an href', () => {
    const url = getPreviousChapter({ ...params, isHref: true });
    expect(url).toEqual(
      '/app?bibleId=ENGESV&bookId=MAT&chapter=1&audio_type=audio_drama',
    );
  });
  it('should return the expected url when going to previous book', () => {
    const url = getPreviousChapter({ ...params, chapter: 1 });
    expect(url).toEqual('/bible/ENGESV/MAL/4?audio_type=audio_drama');
  });
  it('should return the expected url when at the last chapter in resource', () => {
    const url = getPreviousChapter({ ...params, bookId: 'MAL', chapter: 1 });
    expect(url).toEqual('/bible/ENGESV/MAL/1?audio_type=audio_drama');
  });
  it('should return the existing url if there are no books in array', () => {
    const url = getPreviousChapter({ ...params, books: [] });
    expect(url).toEqual('/bible/ENGESV/MAT/2?audio_type=audio_drama');
  });
  it('should return the existing url if the books array is undefined', () => {
    const url = getPreviousChapter({ ...params, books: undefined });
    expect(url).toEqual('/bible/ENGESV/MAT/2?audio_type=audio_drama');
  });
  describe('Testing verse functionality for getPreviousChapter', () => {
    it('should get the previous verse', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: 3,
      });
      expect(url).toEqual('/bible/ENGESV/MAL/1/2?audio_type=audio_drama');
    });
    it('should return first verse if verse is invalid', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: -2,
      });
      expect(url).toEqual('/bible/ENGESV/MAL/1/1?audio_type=audio_drama');
    });
    it('should return last verse if verse is past the end of the range', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: 13,
      });

      expect(url).toEqual('/bible/ENGESV/MAL/1/11?audio_type=audio_drama');
    });
    it('should get the previous verse if no chapter data is available', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: 3,
        text: [],
      });
      expect(url).toEqual('/bible/ENGESV/MAL/1/2?audio_type=audio_drama');
    });
    it('should return first verse if verse is invalid if no chapter data is available', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: -2,
        text: [],
      });
      expect(url).toEqual('/bible/ENGESV/MAL/1/1?audio_type=audio_drama');
    });
    it('should return last verse if verse is past the end of the range if no chapter data is available', () => {
      const url = getPreviousChapter({
        ...params,
        bookId: 'MAL',
        chapter: 1,
        verseNumber: 13,
        text: [],
      });
      expect(url).toEqual('/bible/ENGESV/MAL/1/12?audio_type=audio_drama');
    });
  });
});
