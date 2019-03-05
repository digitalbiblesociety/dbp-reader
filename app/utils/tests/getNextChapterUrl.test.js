import getNextChapterUrl from '../getNextChapterUrl';
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

describe('getNextChapterUrl utility function', () => {
	it('should return the expected url for default parameters', () => {
		const url = getNextChapterUrl(params);
		expect(url).toEqual('/bible/ENGESV/MAT/3?audio_type=audio_drama');
	});
	it('should return the expected url for default parameters as an href', () => {
		const url = getNextChapterUrl({ ...params, isHref: true });
		expect(url).toEqual(
			'/app?bibleId=ENGESV&bookId=MAT&chapter=3&audio_type=audio_drama',
		);
	});
	it('should return the expected url when going to previous book', () => {
		const url = getNextChapterUrl({ ...params, chapter: 28 });
		expect(url).toEqual('/bible/ENGESV/MRK/1?audio_type=audio_drama');
	});
	it('should return the expected url when at the last chapter in resource', () => {
		const url = getNextChapterUrl({ ...params, bookId: 'MRK', chapter: 16 });
		expect(url).toEqual('/bible/ENGESV/MRK/16?audio_type=audio_drama');
	});
	it('should return the existing url if there are no books in array', () => {
		const url = getNextChapterUrl({ ...params, books: [] });
		expect(url).toEqual('/bible/ENGESV/MAT/2?audio_type=audio_drama');
	});
	it('should return the existing url if the books array is undefined', () => {
		const url = getNextChapterUrl({ ...params, books: undefined });
		expect(url).toEqual('/bible/ENGESV/MAT/2?audio_type=audio_drama');
	});
	describe('Testing verse functionality for getNextChapterUrl', () => {
		it('should get the previous verse', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: 3,
			});
			expect(url).toEqual('/bible/ENGESV/MAL/1/4?audio_type=audio_drama');
		});
		it('should return first verse if verse is invalid', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: -2,
			});
			expect(url).toEqual('/bible/ENGESV/MAL/1/1?audio_type=audio_drama');
		});
		it('should return last verse if verse is past the end of the range', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: 13,
			});

			expect(url).toEqual('/bible/ENGESV/MAL/1/11?audio_type=audio_drama');
		});
		it('should get the previous verse if no chapter data is available', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: 3,
				text: [],
			});
			expect(url).toEqual('/bible/ENGESV/MAL/1/4?audio_type=audio_drama');
		});
		it('should return first verse if verse is invalid if no chapter data is available', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: -2,
				text: [],
			});
			expect(url).toEqual('/bible/ENGESV/MAL/1/1?audio_type=audio_drama');
		});
		it('should return last verse if verse is past the end of the range if no chapter data is available', () => {
			const url = getNextChapterUrl({
				...params,
				bookId: 'MAL',
				chapter: 1,
				verseNumber: 13,
				text: [],
			});
			expect(url).toEqual('/bible/ENGESV/MAL/1/14?audio_type=audio_drama');
		});
	});
});
