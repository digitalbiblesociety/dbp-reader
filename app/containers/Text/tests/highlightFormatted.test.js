// import { XMLSerializer } from 'xmldom';
import { JSDOM } from 'jsdom';
import highlightFormattedText from '../highlightFormattedText';
// import sampleText, { result } from './sampleText';
// global.XMLSerializer = XMLSerializer;
// import sampleHighlights from './sampleHighlights.json';
// Can't test formatted text because of XMLSerializer not being available

describe('highlightFormattedText', () => {
	it('Should be a function', () => {
		expect(typeof highlightFormattedText).toBe('function');
	});
	it('Should return a string', () => {
		const sampleHighlights = [];
		const text = '<span class="verse1 v-num v-1">1&#160;</span><span class="v GEN1_1" data-id="GEN1_1"> In the beginning God created the heaven and the earth. </span>';

		expect(typeof highlightFormattedText(sampleHighlights, text, JSDOM)).toBe('string');
	});
	it('Should apply a highlight that contains a footnote without removing the footnote', () => {
		const sampleHighlights = [
			{
				id: 1,
				bible_id: 'ENGESV',
				book_id: 'GEN',
				chapter: 1,
				verse_start: 1,
				highlight_start: 18,
				highlighted_words: 11,
				highlighted_color: '#5B4',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_2_GEN_1 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_1" data-nextid="GEN2" lang="eng"><div class="c">1</div><p><span class="verse1 v-num v-1">1&#160;</span><span class="v GEN1_1" data-id="GEN1_1">In the beginning, God<span class=\'note\' id=\'note-0\'><a href="#footnote-0" class="key">*</a></span> created the heavens and the earth.</span></p></div>';
		const result = '<div class="chapter section ENGWEB_2_GEN_1 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_1" data-nextid="GEN2" lang="eng"><div class="c">1</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN1_1" data-id="GEN1_1"><span>In the beginning, <em class="text-highlighted" style="background:#5B4">God</em></span><span class="note" id="note-0"><a href="#footnote-0" class="key">*</a></span><span><em class="text-highlighted" style="background:#5B4"> created</em> the heavens and the earth.</span></span></p></div>';

		expect(highlightFormattedText(sampleHighlights, sampleText, JSDOM)).toEqual(result);
	});
	it('Should apply a highlight that has a highlight start after several elements within the text', () => {
		const highlights = [{
			id: 99,
			bible_id: 'ENGWEB',
			book_id: 'GEN',
			chapter: 4,
			verse_start: 1,
			highlight_start: 91,
			highlighted_words: 5,
			highlighted_color: '#FD2',
		}];
		const sampleText = '<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1">The man knew<span class="note" id="note-6"><a href="#footnote-6" class="key">*</a></span> Eve his wife. She conceived,<span class="note" id="note-7"><a href="#footnote-7" class="key">*</a></span> and gave birth to Cain, and said, “I have gotten a man with Yahweh’s help.”</span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2">Again she gave birth, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></p></div>';
		const expectedResult = `<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1"><span>The man knew</span><span class="note" id="note-6"><a href="#footnote-6" class="key">*</a></span><span> Eve his wife. She conceived,</span><span class="note" id="note-7"><a href="#footnote-7" class="key">*</a></span><span> and gave birth to Cain, and said, “I have gotten <em class="text-highlighted" style="background:${highlights[0].highlighted_color}">a man</em> with Yahweh’s help.”</span></span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2"><span>Again she gave birth, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></span></p></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should apply an array of highlights that are in two different verses that contain additional markup', () => {
		const highlights = [
			{
				id: 99,
				bible_id: 'ENGWEB',
				book_id: 'GEN',
				chapter: 4,
				verse_start: 1,
				highlight_start: 91,
				highlighted_words: 5,
				highlighted_color: '#FD2',
			},
			{
				id: 99,
				bible_id: 'ENGWEB',
				book_id: 'GEN',
				chapter: 4,
				verse_start: 2,
				highlight_start: 0,
				highlighted_words: 20,
				highlighted_color: '#FD2',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1">The man knew<span class="note" id="note-6"><a href="#footnote-6" class="key">*</a></span> Eve his wife. She conceived,<span class="note" id="note-7"><a href="#footnote-7" class="key">*</a></span> and gave birth to Cain, and said, “I have gotten a man with Yahweh’s help.”</span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2">Again she gave birth, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></p></div>';
		const expectedResult = `<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1"><span>The man knew</span><span class="note" id="note-6"><a href="#footnote-6" class="key">*</a></span><span> Eve his wife. She conceived,</span><span class="note" id="note-7"><a href="#footnote-7" class="key">*</a></span><span> and gave birth to Cain, and said, “I have gotten <em class="text-highlighted" style="background:${highlights[0].highlighted_color}">a man</em> with Yahweh’s help.”</span></span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2"><span><em class="text-highlighted" style="background:${highlights[1].highlighted_color}">Again she gave birth</em>, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></span></p></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should apply a highlight to a verse that does not contain any other markup', () => {
		const highlights = [
			{
				id: 99,
				bible_id: 'ENGWEB',
				book_id: 'GEN',
				chapter: 4,
				verse_start: 2,
				highlight_start: 0,
				highlighted_words: 20,
				highlighted_color: '#FD2',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2">Again she gave birth, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></p></div>';
		const expectedResult = `<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">Again she gave birth</em>, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></span></p></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should apply an array of highlights to verses that do not contain any other markup', () => {
		const highlights = [
			{
				id: 99,
				bible_id: 'ENGWEB',
				book_id: 'GEN',
				chapter: 4,
				verse_start: 1,
				highlight_start: 91,
				highlighted_words: 5,
				highlighted_color: '#FD2',
			},
			{
				id: 99,
				bible_id: 'ENGWEB',
				book_id: 'GEN',
				chapter: 4,
				verse_start: 2,
				highlight_start: 0,
				highlighted_words: 20,
				highlighted_color: '#FD2',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1">The man knew Eve his wife. She conceived, and gave birth to Cain, and said, “I have gotten a man with Yahweh’s help.”</span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2">Again she gave birth, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></p></div>';
		const expectedResult = `<div class="chapter section ENGWEB_2_GEN_4 ENGWEB eng GEN latin" dir="ltr" data-id="ENGWEB_2_GEN_4" data-nextid="GEN5" data-previd="GEN3" lang="eng"> <div class="c">4</div><p><span class="verse1 v-num v-1">1&nbsp;</span><span class="v GEN4_1" data-id="GEN4_1"><span>The man knew Eve his wife. She conceived, and gave birth to Cain, and said, “I have gotten <em class="text-highlighted" style="background:${highlights[0].highlighted_color}">a man</em> with Yahweh’s help.”</span></span><span class="verse2 v-num v-2">2&nbsp;</span><span class="v GEN4_2" data-id="GEN4_2"><span><em class="text-highlighted" style="background:${highlights[1].highlighted_color}">Again she gave birth</em>, to Cain’s brother Abel. Abel was a keeper of sheep, but Cain was a tiller of the ground.</span></span></p></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should highlight a verse that has multiple parent elements', () => {
		const highlights = [
			{
				id: 199,
				bible_id: 'ENGWEB',
				book_id: 'PSA',
				chapter: 50,
				verse_start: 2,
				highlight_start: 0,
				highlighted_words: 11,
				highlighted_color: '#FD2',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&#160;</span><span class="v PSA50_1" data-id="PSA50_1">The Mighty One, God, Yahweh, speaks,</span> </div><div class="q PSA50_1" data-id="PSA50_1">and calls the earth from sunrise to sunset. </div><div class="q"><span class="verse2 v-num v-2">2&#160;</span><span class="v PSA50_2" data-id="PSA50_2">Out of Zion, the perfection of beauty,</span> </div><div class="q PSA50_2" data-id="PSA50_2">God shines out. </div>';
		const expectedResult = `<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&nbsp;</span><span class="v PSA50_1" data-id="PSA50_1"><span>The Mighty One, God, Yahweh, speaks,</span></span> </div><div class="q PSA50_1" data-id="PSA50_1"><span>and calls the earth from sunrise to sunset. </span></div><div class="q"><span class="verse2 v-num v-2">2&nbsp;</span><span class="v PSA50_2" data-id="PSA50_2"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">Out of Zion</em>, the perfection of beauty,</span></span> </div><div class="q PSA50_2" data-id="PSA50_2"><span>God shines out. </span></div></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should apply highlight that spans multiple elements with the same data-id', () => {
		const highlights = [
			{
				id: 199,
				bible_id: 'ENGWEB',
				book_id: 'PSA',
				chapter: 50,
				verse_start: 1,
				highlight_start: 0,
				highlighted_words: 80,
				highlighted_color: '#FD2',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&#160;</span><span class="v PSA50_1" data-id="PSA50_1">The Mighty One, God, Yahweh, speaks,</span> </div><div class="q PSA50_1" data-id="PSA50_1">and calls the earth from sunrise to sunset. </div><div class="q"><span class="verse2 v-num v-2">2&#160;</span><span class="v PSA50_2" data-id="PSA50_2">Out of Zion, the perfection of beauty,</span> </div><div class="q PSA50_2" data-id="PSA50_2">God shines out. </div>';
		const expectedResult = `<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&nbsp;</span><span class="v PSA50_1" data-id="PSA50_1"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">The Mighty One, God, Yahweh, speaks,</em></span></span> </div><div class="q PSA50_1" data-id="PSA50_1"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">and calls the earth from sunrise to sunset. </em></span></div><div class="q"><span class="verse2 v-num v-2">2&nbsp;</span><span class="v PSA50_2" data-id="PSA50_2"><span>Out of Zion, the perfection of beauty,</span></span> </div><div class="q PSA50_2" data-id="PSA50_2"><span>God shines out. </span></div></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
	it('Should apply an array of highlights that span multiple elements with the same data-id', () => {
		const highlights = [
			{
				id: 199,
				bible_id: 'ENGWEB',
				book_id: 'PSA',
				chapter: 50,
				verse_start: 1,
				highlight_start: 0,
				highlighted_words: 80,
				highlighted_color: '#FD2',
			},
			{
				id: 199,
				bible_id: 'ENGWEB',
				book_id: 'PSA',
				chapter: 50,
				verse_start: 2,
				highlight_start: 0,
				highlighted_words: 54,
				highlighted_color: '#5B4',
			},
		];
		const sampleText = '<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&#160;</span><span class="v PSA50_1" data-id="PSA50_1">The Mighty One, God, Yahweh, speaks,</span> </div><div class="q PSA50_1" data-id="PSA50_1">and calls the earth from sunrise to sunset. </div><div class="q"><span class="verse2 v-num v-2">2&#160;</span><span class="v PSA50_2" data-id="PSA50_2">Out of Zion, the perfection of beauty,</span> </div><div class="q PSA50_2" data-id="PSA50_2">God shines out. </div>';
		const expectedResult = `<div class="chapter section ENGWEB_20_PSA_50 ENGWEB eng PSA latin" dir="ltr" data-id="ENGWEB_20_PSA_50" data-nextid="PSA51" data-previd="PSA49" lang="eng"> <div class="c">50</div> <h3>A Psalm by Asaph. </h3><div class="q"><span class="verse1 v-num v-1">1&nbsp;</span><span class="v PSA50_1" data-id="PSA50_1"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">The Mighty One, God, Yahweh, speaks,</em></span></span> </div><div class="q PSA50_1" data-id="PSA50_1"><span><em class="text-highlighted" style="background:${highlights[0].highlighted_color}">and calls the earth from sunrise to sunset. </em></span></div><div class="q"><span class="verse2 v-num v-2">2&nbsp;</span><span class="v PSA50_2" data-id="PSA50_2"><span><em class="text-highlighted" style="background:${highlights[1].highlighted_color}">Out of Zion, the perfection of beauty,</em></span></span> </div><div class="q PSA50_2" data-id="PSA50_2"><span><em class="text-highlighted" style="background:${highlights[1].highlighted_color}">God shines out. </em></span></div></div>`;

		expect(highlightFormattedText(highlights, sampleText, JSDOM)).toEqual(expectedResult);
	});
});
