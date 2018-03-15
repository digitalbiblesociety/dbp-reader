const createHighlights = (highlights, arrayOfVerseObjects) => {
	// Iterate over each verse
	// Find all the highlights for a single verse
	// Apply all highlights for that verse
	// If the highlight goes past the end of the verse
	// Create a new highlight that has the update range and a start verse of the next verse in line
	const sortedHighlights = highlights.sort((a, b) => {
		if (a.verse_start < b.verse_start) return -1;
		if (a.verse_start > b.verse_start) return 1;
		if (a.verse_start === b.verse_start) {
			if (a.highlight_start < b.highlight_start) return -1;
			if (a.highlight_start > b.highlight_start) return 1;
		}
		return 0;
	});
	// console.log('sorted highlights', sortedHighlights);
	try {
		const newArrayOfVerses = [];
		const arrayOfVerses = [...arrayOfVerseObjects];
		let charsLeftAfterVerseEnd = 0; // the number of characters for the highlight

		arrayOfVerses.forEach((verse, verseElementIndex) => {
			console.log('element index', verseElementIndex);
			// Parse the verse data-id to get the verse number
			const verseNumber = verse.verse_start;
			// Get all of the highlights that start in this verse
			const highlightsStartingInVerse = sortedHighlights.filter((highlight) => highlight.verse_start === verseNumber);
			const verseText = verse.verse_text.split('');
			let charsLeft = charsLeftAfterVerseEnd;
			let hStart = 0;

			if (charsLeftAfterVerseEnd && highlightsStartingInVerse.length === 0) {
				// console.log('this verse has a highlight that did not start in it');
				verseText.splice(0, 1, `<em class="text-highlighted">${verseText[0]}`);
				if (charsLeftAfterVerseEnd > verseText.length) {
					// multi verse highlight
					// console.log('whole verse is highlighted', charsLeftAfterVerseEnd, verseText.length);
					verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length]}</em>`);
					charsLeftAfterVerseEnd -= verseText.length;
				} else {
					// console.log('the whole verse is not highlighted', charsLeftAfterVerseEnd, verseText.length);
					verseText.splice(charsLeftAfterVerseEnd, 1, `${verseText[charsLeftAfterVerseEnd]}</em>`);
					charsLeftAfterVerseEnd = 0;
				}
			}
			// console.log('verse text length', verseText.length);
			// console.log('verse txt', verseText.join(''));
			// console.log('all the highlights starting in verse: ', verseNumber);
			// console.log(highlightsStartingInVerse);
			// Reduce the highlights into an array of non-overlapping highlight objects

			highlightsStartingInVerse.forEach((h, i) => {
				// Next highlight
				const nh = highlightsStartingInVerse[i + 1];
				// console.log('each highlight in verse', h);
				// Highlights are sorted by highlight_start so the first index has the very first highlight
				if (i === 0 || charsLeft === 0) {
					verseText.splice(h.highlight_start, 1, `<em class="text-highlighted">${verseText[h.highlight_start]}`);
					hStart = h.highlight_start;
				}
				// if the next highlight start is less than the end of this highlight
				if (nh && nh.highlight_start <= (h.highlight_start + h.highlighted_words)) {
					// check if the furthest highlighted character for this highlight is greater than the furthest character for the next highlight
					if ((h.highlighted_words + h.highlight_start) > (nh.highlight_start + nh.highlighted_words)) {
						// in this case the next highlight will be contained within this highlight and doesn't need to be accounted for
						charsLeft = h.highlighted_words;
					} else {
						// in this case the next highlight will continue to extend past where this one ends
						charsLeft = nh.highlighted_words + (nh.highlight_start);
					}
					// console.log('chars left for overlap', charsLeft);
				} else if ((charsLeft + hStart) <= verseText.length && (h.highlighted_words + h.highlight_start) < verseText.length) {
					// The next highlight is not overlapped by this one
					// This highlight doesn't go past the end of the verse
					if (charsLeft === 0) {
						verseText.splice(h.highlighted_words + h.highlight_start, 1, `${verseText[h.highlighted_words + h.highlight_start]}</em>`);
					} else {
						verseText.splice(charsLeft, 1, `${verseText[charsLeft]}</em>`);
						charsLeft = 0;
					}
					// console.log('chars left at splice', charsLeft);
				} else if ((charsLeft + hStart) > verseText.length || (h.highlighted_words + h.highlight_start) > verseText.length) {
					// diff between highlight start and verse end
					const diff = verseText.length - hStart;
					// console.log('diff', diff);
					verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length - 1]}</em>`);
					if (charsLeft === 0) {
						charsLeft = h.highlighted_words - diff;
					} else {
						charsLeft -= diff;
					}
					// console.log('chars left after verse end', charsLeft);
					charsLeftAfterVerseEnd = charsLeft;
				}
				// Face I made when I found out highlight_start is a string while everything else is an integer... ( ‾ ʖ̫ ‾)
				// If the current highlight overlaps another highlight before it. example v5 - v19, v3 - v6 = v3 - v19
				// If the current highlight overlaps another highlight after it. example v1 - v6, v5 - v9 = v1 - v9
				// If the current highlight encompasses another highlight. example v1 - v12, v4 - v6 = v1 - v12
				// If the current highlight is encompassed by another highlight. example v4 - v6, v1 - v12 = v1 - v12
				// New acc so I don't introduce side effects - mostly so eslint leaves me alone ( ͡~ ͜ʖ ͡°)
			});
			// console.log('verse text after highlights', verseText.join(''));
			// eslint-disable-line no-param-reassign
			// Use charsLeft to highlight as much of this verse as possible, then carry its value over into the next verse
			newArrayOfVerses.push({ ...verse, verse_text: verseText.join('') });
		});
		// console.log('new verses', newArrayOfVerses);
		return newArrayOfVerses;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text with no highlights
		return arrayOfVerseObjects;
	}
};

export default createHighlights;
