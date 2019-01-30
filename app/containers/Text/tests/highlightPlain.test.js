import highlightPlainText from '../highlightPlainText';
import chapterText from './sampleChapterArray.json';
import highlightsObject from './sampleHighlights.json';

/* Text cases that are needed
* 1: one highlight - true
*	2: two overlapping highlights - false
*	3-4: multi-verse highlight - false
*	6: two highlights in same verse - false
*	7-8 & 9-10: multi-verse overlapping highlights - false
*	13-14 & 14: multi-verse that ends up being two highlights in the same verse - false
*	15 * 3: highlight overlaps multiple other highlights
*	Tag to insert
*	<em class="text-highlighted" style="background:linear-gradient(${sampleHighlights[0].highlighted_color}),${sampleHighlights[0].highlighted_color}))">
* */

describe('highlightPlainText', () => {
	it('Should be a function', () => {
		expect(typeof highlightPlainText).toBe('function');
	});
	it('Should return an array', () => {
		const sampleHighlights = [];
		const text = chapterText.data.slice();

		expect(Array.isArray(highlightPlainText(sampleHighlights, text))).toBe(
			true,
		);
	});
	it('Should return inital text if no highlight', () => {
		const sampleHighlights = [];
		const sampleText = chapterText.data.slice();
		const result = chapterText.data.slice();

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 1: It should highlight the text for a single highlight in one verse', () => {
		const smallChapterData = chapterText.data;
		const sampleHighlights = [highlightsObject.data[0]];

		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 1,
				verse_start_alt: '1',
				hasHighlight: true,
				verse_end: 1,
				verse_end_alt: '1',
				verse_text: `I <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">love</em> you, O LORD, my strength.`,
			},
		].concat(chapterText.data.slice(1));

		expect(highlightPlainText(sampleHighlights, smallChapterData)).toEqual(
			result,
		);
	});
	it('Case 2: It should handle a highlight that contains another highlight and use the color of the longer highlight', () => {
		const sampleHighlights = highlightsObject.data.slice(1, 3);
		const sampleText = chapterText.data.slice(1, 2);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 2,
				verse_start_alt: '2',
				verse_end: 2,
				verse_end_alt: '2',
				hasHighlight: true,
				verse_text: `The<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})"> <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">LORD</em> is my</em> rock and my fortress and my deliverer, my God, my rock, in whom I take refuge, my shield, and the horn of my salvation, my stronghold.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 3: It should handle a multi-verse highlight', () => {
		const sampleHighlights = highlightsObject.data.slice(3, 4);
		const sampleText = chapterText.data.slice(2, 4);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 3,
				verse_start_alt: '3',
				verse_end: 3,
				verse_end_alt: '3',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">I call upon the LORD, who is worthy to be praised, and I am saved from my enemies.</em>`,
			},
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 4,
				verse_start_alt: '4',
				verse_end: 4,
				verse_end_alt: '4',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">The cords of death encompassed me; the torrents of destruction assailed me</em>;`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 4: It should apply two non-overlapping highlights in the same verse', () => {
		const sampleHighlights = highlightsObject.data.slice(4, 6);
		const sampleText = chapterText.data.slice(5, 6);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 6,
				verse_start_alt: '6',
				verse_end: 6,
				verse_end_alt: '6',
				hasHighlight: true,
				verse_text: `In my <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">distress</em> I called upon t<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">he LO</em>RD; to my God I cried for help. From his temple he heard my voice, and my cry to him reached his ears.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 5: It should stop the first highlight at the beginning of the next when they both are multi-verse and neither contains the other', () => {
		const sampleHighlights = highlightsObject.data.slice(6, 8);
		const sampleText = chapterText.data.slice(7, 10);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 8,
				verse_start_alt: '8',
				verse_end: 8,
				verse_end_alt: '8',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">Smoke went up from his nostrils, and devouring fire from his mouth; glowing coals flamed forth from him.</em>`,
			},
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 9,
				verse_start_alt: '9',
				verse_end: 9,
				verse_end_alt: '9',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">He bowed the heavens and came down; thick darkness was under his </em><em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})"><em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${sampleHighlights[0].highlighted_color})">feet.</em></em>`,
			},
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 10,
				verse_start_alt: '10',
				verse_end: 10,
				verse_end_alt: '10',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">He rode on a cherub and flew; he came swiftly on the wings of the win</em>d.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 6: It should apply a multi-verse highlight correctly when there is a non-overlapping highlight in the ending verse', () => {
		const sampleHighlights = highlightsObject.data.slice(8, 10);
		const sampleText = chapterText.data.slice(11, 13);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 12,
				verse_start_alt: '12',
				verse_end: 12,
				verse_end_alt: '12',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">Out of the brightness before him hailstones and coals of fire broke through his clouds.</em>`,
			},
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 13,
				verse_start_alt: '13',
				verse_end: 13,
				verse_end_alt: '13',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">The LORD also thundered</em> in the heavens, and <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">the Most </em>High uttered his voice, hailstones and coals of fire.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 7: It should apply two overlapping highlights where newest highlight take priority', () => {
		const sampleHighlights = [
			{
				id: 262,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 0,
				highlighted_words: 21,
				highlighted_color: '17,170,255,.6',
			},
			{
				id: 263,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 11,
				highlighted_words: 10,
				highlighted_color: '85,187,68,.6',
			},
		];
		const sampleText = chapterText.data.slice(11, 12);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 12,
				verse_start_alt: '12',
				verse_end: 12,
				verse_end_alt: '12',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">Out of the <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">brightness</em></em> before him hailstones and coals of fire broke through his clouds.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 8: It should apply a newer highlight over the top of two pre-existing highlights where the new highlight starts at the same index as the first one and ends at the same index of the second', () => {
		const sampleHighlights = [
			{
				id: 262,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 0,
				highlighted_words: 3,
				highlighted_color: '17,170,255,.6',
			},
			{
				id: 263,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 11,
				highlighted_words: 10,
				highlighted_color: '85,187,68,.6',
			},
			{
				id: 264,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 0,
				highlighted_words: 21,
				highlighted_color: '221,102,170,.6',
			},
		];
		const sampleText = chapterText.data.slice(11, 12);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 12,
				verse_start_alt: '12',
				verse_end: 12,
				verse_end_alt: '12',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[2].highlighted_color
				},${
					sampleHighlights[2].highlighted_color
				})"><em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">Out</em> of the <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">brightness</em></em> before him hailstones and coals of fire broke through his clouds.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
		// expect(false).toBe(true);
	});
	it('Case 9: It should apply a highlight contained within an older highlight where the new highlight is on top of the old one and they are the same color', () => {
		const sampleHighlights = [
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:1',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '84,185,72,.25',
				highlight_start: 0,
				verse_start: 1,
				id: 224,
				highlighted_words: 41,
			},
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:1',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '84,185,72,.25',
				highlight_start: 4,
				verse_start: 1,
				id: 500,
				highlighted_words: 30,
			},
		];
		const sampleText = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				verse_text:
					'The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.',
			},
		];
		const result = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">The <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">book of the genealogy of Jesus</em> Christ</em>, the son of David, the son of Abraham.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	it('Case 10: It should apply a highlight contained within an older highlight where the new highlight is on top of the old one and they are NOT the same color', () => {
		const sampleHighlights = [
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:1',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '84,185,72,.25',
				highlight_start: 0,
				verse_start: 1,
				id: 224,
				highlighted_words: 41,
			},
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:1',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '17,170,255,.6',
				highlight_start: 4,
				verse_start: 1,
				id: 500,
				highlighted_words: 30,
			},
		];
		const sampleText = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				verse_text:
					'The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.',
			},
		];
		const result = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 1,
				verse_start_alt: '1',
				verse_end: 1,
				verse_end_alt: '1',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})">The <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">book of the genealogy of Jesus</em> Christ</em>, the son of David, the son of Abraham.`,
			},
		];
		const sampleHighlights2 = [
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:13',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '84,185,72,.25',
				highlight_start: 4,
				verse_start: 13,
				id: 501,
				highlighted_words: 30,
			},
			{
				bible_id: 'ENGESV',
				reference: 'Matthew 1:13',
				chapter: 1,
				book_id: 'MAT',
				highlighted_color: '80,165,220,.25',
				highlight_start: 4,
				verse_start: 13,
				id: 502,
				highlighted_words: 10,
			},
		];
		const sampleText2 = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 13,
				verse_start_alt: '13',
				verse_end: 13,
				verse_end_alt: '13',
				verse_text:
					'and Zerubbabel the father of Abiud, and Abiud the father of Eliakim, and Eliakim the father of Azor,',
			},
		];
		const result2 = [
			{
				book_id: 'MAT',
				book_name: 'Matthew',
				book_name_alt: 'Matthew',
				chapter: 1,
				chapter_alt: '1',
				verse_start: 13,
				verse_start_alt: '13',
				verse_end: 13,
				verse_end_alt: '13',
				hasHighlight: true,
				verse_text: `and <em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights2[0].highlighted_color
				},${
					sampleHighlights2[0].highlighted_color
				})"><em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights2[1].highlighted_color
				},${
					sampleHighlights2[1].highlighted_color
				})">Zerubbabel</em> the father of Abiud</em>, and Abiud the father of Eliakim, and Eliakim the father of Azor,`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
		expect(highlightPlainText(sampleHighlights2, sampleText2)).toEqual(result2);
	});
	it('Case 11: It should apply a newer highlight over the top of two pre-existing highlights where the new highlight does not start at the same index as the first one and does not end at the same index of the second', () => {
		const sampleHighlights = [
			{
				id: 262,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 3,
				highlighted_words: 8,
				highlighted_color: '17,170,255,.6',
			},
			{
				id: 263,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 11,
				highlighted_words: 10,
				highlighted_color: '85,187,68,.6',
			},
			{
				id: 264,
				bible_id: 'ENGESV',
				book_id: 'PSA',
				chapter: 18,
				verse_start: 12,
				highlight_start: 0,
				highlighted_words: 28,
				highlighted_color: '221,102,170,.6',
			},
		];
		const sampleText = chapterText.data.slice(11, 12);
		const result = [
			{
				book_id: 'PSA',
				book_name: 'Psalm',
				book_name_alt: 'Psalm',
				chapter: 18,
				chapter_alt: '18',
				verse_start: 12,
				verse_start_alt: '12',
				verse_end: 12,
				verse_end_alt: '12',
				hasHighlight: true,
				verse_text: `<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[2].highlighted_color
				},${
					sampleHighlights[2].highlighted_color
				})">Out<em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[0].highlighted_color
				},${
					sampleHighlights[0].highlighted_color
				})"> of the </em><em class="text-highlighted" style="background:linear-gradient(${
					sampleHighlights[1].highlighted_color
				},${
					sampleHighlights[1].highlighted_color
				})">brightness</em> before</em> him hailstones and coals of fire broke through his clouds.`,
			},
		];

		expect(highlightPlainText(sampleHighlights, sampleText)).toEqual(result);
	});
	xit('Case 12: Should handle applying a highlight that spans mutliple verses and starts at the same index as a differently colored highlight', () => {
		expect('tests to be defined').toBe(true);
	});
});
