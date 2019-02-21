import firstMatchingChapter from '../getFirstMatchingChapter';
import { textChapters, audioChapters } from '../testUtils/chapterLists';

describe('First matching chapter utility function', () => {
	it('should return the first chapter that matches between two book lists', () => {
		expect(firstMatchingChapter(textChapters, audioChapters)).toEqual('LUK/7');
	});
});
