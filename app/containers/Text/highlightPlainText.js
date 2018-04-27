const createHighlights = (highlights, arrayOfVerseObjects) => {
	// todo: plain text use highlighted_color on highlight to add the background color inline
	// Todo: Huge issue if highlights overlap, breaks a lot of things
	/* NOTES
	* 1. Need to subtract 1 from any addition of highlight_start + highlighted_words, this is because the result is the length not the index
	*
	* */
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
	// console.log(arrayOfVerseObjects);
	// console.log('sorted highlights', sortedHighlights);
	try {
		const newArrayOfVerses = [];
		const arrayOfVerses = [...arrayOfVerseObjects];
		let charsLeftAfterVerseEnd = 0; // the number of characters for the highlight
		let continuingColor = ''; // Need to save the color of the active highlight that is still being applied
		// console.log('New Highlight Iteration\n\n----------------------------------------------------------------------------------');
		arrayOfVerses.forEach((verse) => {
			// console.log('element index', verseElementIndex);
			const verseNumber = verse.verse_start;
			// Get all of the highlights that start in this verse
			const highlightsStartingInVerse = sortedHighlights.filter((highlight) => highlight.verse_start === verseNumber);

			// Make the text an array
			const verseText = verse.verse_text.split('');
			// Set the start of the highlight to 0 since this is a "new" verse
			let hStart = 0;
			if (charsLeftAfterVerseEnd && highlightsStartingInVerse.length === 0) {
				// if there were characters left and there were not any highlights in this verse
				// console.log('this verse has a highlight that did not start in it', charsLeftAfterVerseEnd);
				verseText.splice(0, 1, `<em class="text-highlighted" style="background:${continuingColor}">${verseText[0]}`);
				if (charsLeftAfterVerseEnd > verseText.length) {
					// The characters left is greater than the length of this verse
					// console.log('The characters left is greater than the length of this verse', charsLeftAfterVerseEnd, verseText.length);
					verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length - 1]}</em>`);
					charsLeftAfterVerseEnd -= verseText.length;
				} else if (charsLeftAfterVerseEnd === verseText.length) {
					// The characters left is exactly equal to the length of this verse
					// console.log('The number of characters left is exactly equal to the length of this verse', charsLeftAfterVerseEnd, verseText.length);
					// I am guessing that I do not need to subtract 1 here
					verseText.splice(charsLeftAfterVerseEnd - 1, 1, `${verseText[charsLeftAfterVerseEnd - 1]}</em>`);
					charsLeftAfterVerseEnd = 0;
				} else {
					// The number of characters left is less than the entirety of this verse and before the beginning of the next highlight
					// console.log('The number of characters left is less than the entirety of this verse and before the beginning of the next highlight', charsLeftAfterVerseEnd, verseText.length);
					verseText.splice(charsLeftAfterVerseEnd, 1, `</em>${verseText[charsLeftAfterVerseEnd]}`);
					charsLeftAfterVerseEnd = 0;
				}
			} else if (charsLeftAfterVerseEnd) {
				// Apply previous highlight up until the first highlight in this verse starts
				// Subtract appropriate amount of characters from charsLeft - todo: handle continuing the previous highlight after the highlights in this verse have been applied
				const firstHighlightStart = highlightsStartingInVerse[0].highlight_start;
				// console.log('firstHighlightStart', firstHighlightStart);
				// console.log('firstHighlightStart > charsLeftAfterVerseEnd', firstHighlightStart > charsLeftAfterVerseEnd);
				// console.log('!(firstHighlightStart === 0)', !(firstHighlightStart === 0));
				// End of previous highlight is before the first highlight in this verse
				if (charsLeftAfterVerseEnd < firstHighlightStart) {
					verseText.splice(0, 1, `<em class="text-highlighted" style="background:${continuingColor}">${verseText[0]}`);

					verseText.splice(charsLeftAfterVerseEnd, 1, `</em>${verseText[charsLeftAfterVerseEnd]}`);

					charsLeftAfterVerseEnd = 0;
				} else if (!(firstHighlightStart === 0)) {
					// console.log('firstHighlightStart is not equal to zero and is less than charsLeftAfterVerseEnd');
					verseText.splice(0, 1, `<em class="text-highlighted" style="background:${continuingColor}">${verseText[0]}`);

					// May not need to subtract 1 here - highlight start might be an index instead of a length
					verseText.splice(firstHighlightStart - 1, 1, `${verseText[firstHighlightStart - 1]}</em>`);
					charsLeftAfterVerseEnd -= (firstHighlightStart - 1);
					// console.log('charsLeftAfterVerseEnd', charsLeftAfterVerseEnd);
				}
				// Set the local charsLeft variable to equal the remaining charsLeftAfterVerseEnd global variable
				// For everything else I need to wait until the highlights in this verse have been applied
				// Might consider setting a "this highlight still has x number of characters" variable
			}

			// May need to take steps to ensure this doesn't go below 0
			let charsLeft = charsLeftAfterVerseEnd;
			// Todo: Need to handle the case where there are highlights in this verse but they do not overlap the highlight that is multi-line

			highlightsStartingInVerse.forEach((h, i) => {
				// Next highlight
				const nh = highlightsStartingInVerse[i + 1];
				// console.log('each highlight in verse', h);
				// Highlights are sorted by highlight_start so the first index has the very first highlight
				if (i === 0 || charsLeft === 0) {
					// If this is the first highlight or if there are no characters left from the last highlight
					// console.log(verseText);
					verseText.splice(h.highlight_start, 1, `<em class="text-highlighted" style="background:${h.highlighted_color ? h.highlighted_color : 'inherit'}">${verseText[h.highlight_start]}`);
					// Saves where the highlight started
					hStart = h.highlight_start;
				}
				// if the next highlight start is less than the end of this highlight and there is a next highlight
				/* ESSENTIALLY GATHERS ALL OVERLAPPING HIGHLIGHTS */
				if (nh && nh.highlight_start <= ((h.highlighted_words + h.highlight_start) - 1)) {
					// check if the furthest highlighted character for this highlight is greater than the furthest character for the next highlight
					// console.log('Next highlight start is lower than the end of this one');
					// Todo: The function breaks here if there is one highlight overlapping multiple other highlights
					if (((h.highlighted_words + h.highlight_start) - 1) >= ((nh.highlight_start + nh.highlighted_words) - 1)) {
						// If the end of this highlight is greater than the end of the next highlight
						// the next highlight will be contained within this highlight and doesn't need to be accounted for
						// console.log('current test should apply highlight here', h);
						charsLeft = h.highlighted_words;
					} else {
						// If the end of this highlight was not greater than the end of the next one, then it must not contain the next highlight
						// in this case the next highlight will continue to extend past where this one ends
						charsLeft = (nh.highlighted_words + nh.highlight_start) - 1;
					}

					/* IS SINGLE VERSE NON-OVERLAPPING */
				} else if ((charsLeft + hStart) <= verseText.length && ((h.highlighted_words + h.highlight_start) - 1) < verseText.length) {
					// If the characters left plus the start of the highlight are less than the verse length and this highlight is less than the verse length
					// This highlight doesn't go past the end of the verse
					if (charsLeft === 0) {
						// This highlight was not overlapped by another
						// If there are not any characters left to highlight then close the em tag at the index where the highlight ends
						verseText.splice((h.highlighted_words + h.highlight_start) - 1, 1, `${verseText[(h.highlighted_words + h.highlight_start) - 1]}</em>`);
					} else {
						// Since there are characters left highlight close the em tag at the index that will expend those characters
						verseText.splice((charsLeft + hStart) - 1, 1, `${verseText[(charsLeft + hStart) - 1]}</em>`);
						charsLeft = 0;
					}

					/* IS MULTI-VERSE */
				} else if ((charsLeft + hStart) > verseText.length || ((h.highlighted_words + h.highlight_start) - 1) > verseText.length) {
					// If the characters left to highlight plus where the highlight started is greater than the verse length or the highlight is longer than the verse

					// diff between highlight start and verse end
					const diff = verseText.length - hStart;

					// Close the em tag at the end of the verse since this highlight goes on into the next verse
					verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length - 1]}</em>`);

					// If the remaining characters in this highlight is greater than the characters leftover
					// Set the characters left as this highlights remaining
					// else leave the characters leftover

					if (charsLeft === 0 || (h.highlighted_words - diff) > charsLeft) {
						// If the previous highlight was completed set the characters left to equal the space remaining un-highlighted in the verse
						charsLeft = h.highlighted_words - diff;
						// console.log('Chars left is correct for first highlight', h.highlighted_words === 174 && charsLeft === 70);
					} else {
						// Subtract the number of characters applied from the number left
						charsLeft -= diff;
					}
					// Set the variables needed for the next verse to continue this highlight
					charsLeftAfterVerseEnd = charsLeft;
					continuingColor = h.highlighted_color;
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
			if (verseText.join('') !== verse.verse_text) {
				newArrayOfVerses.push({ ...verse, verse_text: `${verseText.join('')}`, hasHighlight: true });
			} else {
				newArrayOfVerses.push({ ...verse });
			}
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
