import highlightPlainText from '../highlightPlainText';
import chapterText from './sampleChapterArray.json';

describe('highlightPlainText', () => {
	it('Should be a function', () => {
		expect(typeof highlightPlainText).toBe('function');
	});
	it('Should return a string', () => {
		const sampleHighlights = [];
		const text = [...chapterText];

		expect(Array.isArray(highlightPlainText(sampleHighlights, text))).toBe(true);
	});
	it('Should return inital text if no highlight', () => {
		const sampleHighlights = [];
		const sampleText = [...chapterText];
		const result = [...chapterText];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Should highlight the text for a single highlight in one verse', () => {
		const smallChapterData = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: 'In the beginning, God created the heavens and the earth.',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const result = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				hasHighlight: true,
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: '<em class="text-highlighted" style="background:#EE0">In the begi</em>nning, God created the heavens and the earth.',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const sampleHighlights = [
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 0,
				highlighted_words: 11,
				highlighted_color: '#EE0',
			},
		];

		expect(highlightPlainText(sampleHighlights, smallChapterData)).toEqual(result);
	});
	it('Should highlight the text for a multi-verse highlight', () => {
		const smallChapterData = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: 'In the beginning, God created the heavens and the earth.',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const result = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				hasHighlight: true,
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: '<em class="text-highlighted" style="background:#EE0">In the beginning, God created the heavens and the earth.</em>',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				hasHighlight: true,
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: '<em class="text-highlighted" style="background:#EE0">Th</em>e earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const sampleHighlights = [
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 0,
				highlighted_words: 58,
				highlighted_color: '#EE0',
			},
		];

		expect(highlightPlainText(sampleHighlights, smallChapterData)).toEqual(result);
	});
	it('Should highlight the text for multiple highlights in one verse', () => {
		const smallChapterData = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: 'In the beginning, God created the heavens and the earth.',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const result = [
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				hasHighlight: true,
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: '<em class="text-highlighted" style="background:#EE0">In the begi</em>nni<em class="text-highlighted" style="background:#EE0">ng, G</em>od created the heavens and the earth.',
			},
			{
				book_id: 'GEN',
				book_name: 'Genesis',
				book_name_alt: 'Genesis',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				verse_text: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
			},
		];
		const sampleHighlights = [
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 0,
				highlighted_words: 11,
				highlighted_color: '#EE0',
			},
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 14,
				highlighted_words: 5,
				highlighted_color: '#EE0',
			},
		];

		expect(highlightPlainText(sampleHighlights, smallChapterData)).toEqual(result);
	});
});
