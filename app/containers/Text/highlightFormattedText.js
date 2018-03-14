const createFormattedHighlights = (highlights, formattedTextString) => {
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
	console.log('sorted highlights', sortedHighlights);
	try {
		const parser = new DOMParser();
		const serializer = new XMLSerializer();
		const xmlDoc = parser.parseFromString(formattedTextString, 'text/xml');
		const arrayOfVerses = [...xmlDoc.getElementsByClassName('v')];
		let charsLeft = sortedHighlights[0].highlighted_words; // the number of characters for the highlight

		arrayOfVerses.forEach((verse, verseElementIndex) => {
			if (verseElementIndex < 4) {
				console.log('element index', verseElementIndex);
				// Parse the verse data-id to get the verse number
				const verseNumber = parseInt(verse.attributes['data-id'].value.split('_')[1], 10);
				// Get all of the highlights that start in this verse
				const highlightsStartingInVerse = sortedHighlights.filter((highlight) => highlight.verse_start === verseNumber);
				const verseText = verse.textContent;
				console.log('verse text', verseText);
				console.log('all the highlights starting in verse: ', verseNumber);
				console.log(highlightsStartingInVerse);
				// Reduce the highlights into an array of non-overlapping highlight objects

				highlightsStartingInVerse.forEach((h, i) => {
					// Next highlight
					const nh = highlightsStartingInVerse[i + 1];
					console.log('each highlight in verse', h);
					// Highlights are sorted by highlight_start so the first index has the very first highlight
					if (i === 0) {
						verseText[h.highlight_start] = `<em class="highlighted">${verseText[h.highlight_start]}`;
					}
					// if the next highlight start is less than the end of this highlight
					if (nh.highlight_start <= (h.highlight_start + h.highlighted_words)) {
						// check if the furthest highlighted character for this highlight is greater than the furthest character for the next highlight
						if (h.highlighted_words + h.highlight_start > nh.highlight_start + nh.highlighted_words) {
							// in this case the next highlight will be contained within this highlight and doesn't need to be accounted for
							charsLeft = h.highlighted_words;
						} else {
							// in this case the next highlight will continue to extend past where this one ends
							charsLeft = nh.highlighted_words + (nh.highlight_start - h.highlight_start);
						}
					} else {
						// The next highlight is not overlapped by this one
						verseText[h.highlighted_words - h.highlight_start] = `${verseText[h.highlighted_words - h.highlight_start]}</em>`;
					}
					// Face I made when I found out highlight_start is a string while everything else is an integer... ( ‾ ʖ̫ ‾)
					// If the current highlight overlaps another highlight before it. example v5 - v19, v3 - v6 = v3 - v19
					// If the current highlight overlaps another highlight after it. example v1 - v6, v5 - v9 = v1 - v9
					// If the current highlight encompasses another highlight. example v1 - v12, v4 - v6 = v1 - v12
					// If the current highlight is encompassed by another highlight. example v4 - v6, v1 - v12 = v1 - v12
					// New acc so I don't introduce side effects - mostly so eslint leaves me alone ( ͡~ ͜ʖ ͡°)
				});
				console.log('verse text after highlights', verseText);
				// Use charsLeft to highlight as much of this verse as possible, then carry its value over into the next verse
			}
		});

		return serializer.serializeToString(xmlDoc);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text with no highlights
		return formattedTextString;
	}
};

export default createFormattedHighlights;
