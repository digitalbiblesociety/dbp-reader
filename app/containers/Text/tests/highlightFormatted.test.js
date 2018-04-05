// import { XMLSerializer } from 'xmldom';
import highlightFormattedText from '../highlightFormattedText';
// import sampleText, { result } from './sampleText';
// global.XMLSerializer = XMLSerializer;
// import sampleHighlights from './sampleHighlights.json';
// Can't test formatted text because of XMLSerializer not being available

describe('highlightFormattedText', () => {
	it('Should be a function', () => {
		expect(typeof highlightFormattedText).toBe('function');
	});
	xit('Should return a string', () => {
		const sampleHighlights = [];
		const text = '<span class="verse1 v-num v-1">1&#160;</span><span class="v GEN1_1" data-id="GEN1_1"> In the beginning God created the heaven and the earth. </span>';

		expect(typeof highlightFormattedText(sampleHighlights, text)).toBe('string');
	});
	it('Should highlight the text', () => {
		const sampleHighlights = [
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 18,
				highlighted_words: 11,
				highlighted_color: '#EE0',
			},
		];
		const sampleText = '<span class="verse1 v-num v-1">1&#160;</span><span class="v GEN1_1" data-id="GEN1_1"> In the beginning God created the heaven and the earth. </span>';
		const result = '<span class="verse1 v-num v-1">1&#160;</span><span class="v GEN1_1" data-id="GEN1_1"> In the beginning <em class="text-highlighted" style="background:#EE0">God created</em> the heaven and the earth. </span>';

		expect(highlightFormattedText(sampleHighlights, sampleText)).toEqual(result);
	});
});
