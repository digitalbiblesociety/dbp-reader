const createFormattedHighlights = (highlights, formattedTextString) => {
	// Iterate over each verse
		// Find all the highlights for a single verse
		// Apply all highlights for that verse
			// If the highlight goes past the end of the verse
			// Create a new highlight that has the update range and a start verse of the next verse in line

	try {
		const parser = new DOMParser();
		const serializer = new XMLSerializer();
		const xmlDoc = parser.parseFromString(formattedTextString, 'text/xml');
		const arrayOfVerses = [...xmlDoc.getElementsByClassName('v')];

		arrayOfVerses.forEach((verse, verseElementIndex) => {
			if (verseElementIndex < 4) {
				console.log('element index', verseElementIndex);
				// Parse the verse data-id to get the verse number
				const verseNumber = parseInt(verse.attributes['data-id'].value.split('_')[1], 10);
				// Get all of the highlights that start in this verse
				const highlightsStartingInVerse = highlights.filter((highlight) => highlight.verse_start === verseNumber);
				console.log('all the highlights starting in verse: ', verseNumber);
				console.log(highlightsStartingInVerse);
				// Reduce the highlights into an array of non-overlapping highlight objects
				const combinedHighlights = highlightsStartingInVerse.reduce((acc, highlight, index) => {
					// Face I made when I found out highlight_start is a string while everything else is an integer... ( ‾ ʖ̫ ‾)
					// If the current highlight overlaps another highlight before it. example v5 - v19, v3 - v6 = v3 - v19
					const overlapBefore = acc.find((h) => highlight.highlight_start <= (h.highlighted_words + h.highlight_start) && highlight.highlight_start >= h.highlight_start);
					// If the current highlight overlaps another highlight after it. example v1 - v6, v5 - v9 = v1 - v9
					const overlapAfter = acc.find((h) => highlight.highlight_start <= (h.highlighted_words + h.highlight_start) && highlight.highlight_start >= h.highlight_start);
					// New highlight
					const newHighlight = highlight;
					// New acc so I don't introduce side effects - mostly so eslint leaves me alone ( ͡~ ͜ʖ ͡°)
					const newAcc = acc;

					if (overlapBefore) {
						// Take highlight start of the overlapped highlight and the highlight end of this highlight to create a new highlight
						console.log('overlap before', overlapBefore);
						newHighlight.highlight_start = overlapBefore.highlight_start;
						newAcc.splice(overlapBefore.index, 1);
					}

					if (overlapAfter) {
						// Take start of this highlight and end of the overlapped highlight to create a new highlight
						console.log('overlap after', overlapAfter);
						newHighlight.highlighted_words = overlapAfter.highlighted_words;
						newAcc.splice(overlapAfter.index, 1);
					}
					// Check for these here so that the start and end of the current highlight will already have been expanded
					// If the current highlight encompasses another highlight. example v1 - v12, v4 - v6 = v1 - v12
					const encompasses = acc.find((h) => highlight.highlight_start <= h.highlight_start && highlight.highlighted_words >= h.highlighted_words);
					// If the current highlight is encompassed by another highlight. example v4 - v6, v1 - v12 = v1 - v12
					const encompassed = acc.find((h) => highlight.highlight_start >= h.highlight_start && highlight.highlighted_words <= h.highlighted_words);

					if (encompasses) {
						// Replace the encompasses highlight with this one
						console.log('encompasses', encompasses);
						newAcc.splice(encompasses.index, 1);
					}

					if (encompassed) {
						// If another highlight already encompasses this one then I don't need to add it
						console.log('encompassed by something else', encompassed);
						return newAcc;
					}

					newHighlight.index = index;
					console.log('the value that I am returning', [...newAcc, newHighlight]);
					return [...newAcc, newHighlight];
				}, []);
				console.log('combined highlights for verse: ', verseNumber);
				console.log(combinedHighlights);
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
