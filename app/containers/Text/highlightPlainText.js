const createHighlights = (highlights, arrayOfVerseObjects) => {
	// Todo: Huge issue if highlights overlap, breaks a lot of things
	/* NOTES
	* 1. Need to subtract 1 from any addition of highlight_start + highlighted_words, this is because the result is the length not the index
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
			if (a.highlight_start === b.highlight_start) {
				// if a was smaller than b then a needs to come first
				if (a.highlight_start + a.highlighted_words < b.highlight_start + b.highlighted_words) return -1;
				if (a.highlight_start + a.highlighted_words > b.highlight_start + b.highlighted_words) return 1;
				// I want the newest (highest id) - Not sure this is helping anything...
				if (a.id > b.id) return -1;
				if (a.id < b.id) return 1;
			}
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
				verseText.splice(0, 1, `<em class="text-highlighted" style="background:linear-gradient(rgba(${continuingColor}),rgba(${continuingColor}))">${verseText[0]}`);
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
					verseText.splice(0, 1, `<em class="text-highlighted" style="background:linear-gradient(rgba(${continuingColor}),rgba(${continuingColor}))">${verseText[0]}`);

					verseText.splice(charsLeftAfterVerseEnd, 1, `</em>${verseText[charsLeftAfterVerseEnd]}`);

					charsLeftAfterVerseEnd = 0;
				} else if (!(firstHighlightStart === 0)) {
					// console.log('firstHighlightStart is not equal to zero and is less than charsLeftAfterVerseEnd');
					verseText.splice(0, 1, `<em class="text-highlighted" style="background:linear-gradient(rgba(${continuingColor}),rgba(${continuingColor}))">${verseText[0]}`);

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
				// Sets the actual index for the verse since this could be the 2nd or 3rd node inside the verse
				// Highlights are sorted by highlight_start so the first index has the very first highlight
				// Also need to check and see if the highlight can fit in this child node of the verse
				// console.log('The highlight starts in this section', (verseText.length + prevSectionsLength) >= h.highlight_start && !(prevSectionsLength >= h.highlight_start));
				if ((i === 0 || charsLeft === 0) && (verseText.length) >= h.highlight_start) {
					// If the length of the previous sections plus the length of this one is greater than the start of the highlight
					// And the length of the previous sections is not greater than the start of the highlight
					// console.log('Starting highlight for highlight id: ', h.id, charsLeft);
					verseText.splice(h.highlight_start, 1, `<em class="text-highlighted" style="background:linear-gradient(rgba(${h.highlighted_color ? h.highlighted_color : 'inherit'}),rgba(${h.highlighted_color ? h.highlighted_color : 'inherit'}))">${verseText[h.highlight_start]}`);
					hStart = h.highlight_start;
				}
				/* HIGHLIGHTS OVERLAP AND ARE THE SAME COLOR */
				// if the next highlight start is less than the end of this highlight and there is a next highlight
				if (
					nh &&
					nh.highlight_start <= ((h.highlighted_words + h.highlight_start) - 1) &&
					h.highlighted_color === nh.highlighted_color &&
					false &&
					(h.highlight_start !== nh.highlight_start && h.highlighted_words !== nh.highlighted_words)
				) {
					// check if the furthest highlighted character for this highlight is greater than the furthest character for the next highlight
					// console.log('Next highlight start is lower than the end of this one is the same color');
					// Todo: Check to make sure that I do not need this case. I am currently not using it and everything seems fine...
					if (((h.highlighted_words + h.highlight_start) - 1) >= ((nh.highlight_start + nh.highlighted_words) - 1)) {
						// If the end of this highlight is greater than the end of the next highlight
						// the next highlight will be contained within this highlight and doesn't need to be accounted for
						// console.log('end is greater than end of next highlight and colors match');
						continuingColor = h.highlighted_color;
						charsLeft = h.highlighted_words - nh.highlighted_words;
					} else {
						// If the end of this highlight was not greater than the end of the next one, then it must not contain the next highlight
						// in this case the next highlight will begin at the place this one ends
						// console.log('end is less than end of next highlight');
						charsLeft = (nh.highlighted_words);
						continuingColor = h.highlighted_color;
					}
					/* HIGHLIGHTS ARE THE SAME SIZE */
					// } else if (nh && nh.highlight_start === h.highlight_start && nh.highlighted_words === h.highlighted_words) {
					// 	if (h.id > nh.id) {
					// 		// do stuff for h and not nh
					// 	} else {
					// 		// do stuff for nh and not h
					// 	}
					/* HIGHLIGHTS OVERLAP AND ARE DIFFERENT COLORS */
				} else if (
					nh &&
					nh.highlight_start <= ((h.highlighted_words + h.highlight_start) - 1) &&
					// h.highlighted_color !== nh.highlighted_color &&
					(h.highlight_start !== nh.highlight_start && h.highlighted_words !== nh.highlighted_words)
				) {
					// console.log('Next highlight is a different color and is overlapped by this one');
					// If the next highlight is in this verse segment - may need to use <= instead of <
					// And this highlight has an id less than the next highlight
					// And it ends at or before the next highlight
					if (h.id < nh.id && h.highlight_start + h.highlighted_words <= nh.highlight_start + nh.highlighted_words && nh.highlight_start < verseText.length) {
						// End this highlight where the next one starts
						// Adding closing tag to the end of the character before the start of the next highlight
						// console.log('current id was less, current highlight length was less, next highlight smaller than verse');
						verseText.splice(nh.highlight_start - 1, 1, `${verseText[nh.highlight_start - 1]}</em>`);
						// This highlight ended so there is not a continuing color or any chars left
						charsLeft = 0;
						continuingColor = '';
					} else if (h.highlight_start < nh.highlight_start && h.highlighted_words > nh.highlighted_words && nh.highlight_start < verseText.length) {
						// This highlight is longer than the next one
						verseText.splice((h.highlight_start + h.highlighted_words) - 1, 1, `${verseText[(h.highlight_start + h.highlighted_words) - 1]}</em>`);
						// This highlight ended so there is not a continuing color or any chars left
						charsLeft = 0;
						continuingColor = '';
						// console.log('in else of hacked if');
					}
					// Todo: Handle case where this highlight has a larger id than the next highlight
					/* IS SINGLE VERSE NOT COMPLETELY OVERLAPPING */
					// I think both of the conditions below are exactly the same...
				} else if ((charsLeft + h.highlight_start) <= (verseText.length) && ((h.highlighted_words + h.highlight_start) - 1) < (verseText.length)) {
					// If the characters left plus the start of the highlight are less than the verse length and this highlight is less than the verse length
					// This highlight doesn't go past the end of the verse
					if (charsLeft === 0) {
						// This highlight was not overlapped by another and the highlight was not started in a child node before this one
						// If there are not any characters left to highlight then close the em tag at the index where the highlight ends
						// console.log('splicing text where chars left === 0', h.id);
						verseText.splice((h.highlighted_words + h.highlight_start) - 1, 1, `${verseText[(h.highlighted_words + h.highlight_start) - 1]}</em>`);
					} else if (continuingColor !== h.highlighted_color) {
						// console.log('ending previous highlight and starting new one', h.id);
						// Ends the previous highlight
						verseText.splice(h.highlight_start - 1, 1, `${verseText[h.highlight_start - 1]}</em>`);
						// Starts a new highlight where this one should start
						verseText.splice(h.highlight_start, 1, `<em class="text-highlighted" style="background:linear-gradient(rgba(${h.highlighted_color ? h.highlighted_color : 'inherit'}),rgba(${h.highlighted_color ? h.highlighted_color : 'inherit'}))">${verseText[h.highlight_start]}`);
						if (!nh) {
							// This is the last highlight in this verse and it does not go past the end of the verse
							// console.log('No next highlight', h.id);
							verseText.splice((h.highlighted_words + h.highlight_start) - 1, 1, `${verseText[(h.highlighted_words + h.highlight_start) - 1]}</em>`);
							// charsLeftAfterVerseEnd = 0;
						} else {
							// console.log('setting the new charsLeft and continuing color', h.id);
							charsLeft = h.highlighted_words;
							continuingColor = h.highlighted_color;
						}
					} else {
						// Since there are characters left to highlight close the em tag at the index that will expend those characters
						// console.log('splicing text chars left: ', charsLeft, h.id);
						verseText.splice((charsLeft + h.highlight_start) - 1, 1, `${verseText[(charsLeft + h.highlight_start) - 1]}</em>`);
						charsLeft = 0;
					}

					/* IS MULTI-VERSE */
				} else if ((charsLeft + hStart) > verseText.length || ((h.highlighted_words + h.highlight_start) - 1) > verseText.length) {
					// If the characters left to highlight plus where the highlight started is greater than the verse length or the highlight is longer than the verse

					// console.log('charsLeft + hStart', charsLeft + hStart);
					// console.log('(h.highlighted_words + h.highlight_start) - 1', (h.highlighted_words + h.highlight_start) - 1);
					// diff between highlight start and verse end
					if (!(verseText.length < h.highlight_start)) {
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
					} else {
						// May not want everything else to trigger this
						charsLeftAfterVerseEnd = h.highlighted_words;
						continuingColor = h.highlighted_color;
					}
				}
			});
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
