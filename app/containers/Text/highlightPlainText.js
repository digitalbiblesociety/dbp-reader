const createHighlights = (highlights, arrayOfVerseObjects) => {
	/* NOTES
	* 1. Need to subtract 1 from any addition of highlight_start + highlighted_words, this is because the result is the length not the index
	* */
	// Iterate over each verse
	// Find all the highlights for a single verse
	// Apply all highlights for that verse
	// If the highlight goes past the end of the verse
	// Create a new highlight that has the update range and a start verse of the next verse in line
	const sortedHighlights = JSON.parse(JSON.stringify(highlights))
		.sort((a, b) => {
			if (a.verse_start < b.verse_start) return -1;
			if (a.verse_start > b.verse_start) return 1;
			if (a.verse_start === b.verse_start) {
				if (a.highlight_start === b.highlight_start) {
					// if a was smaller than b then a needs to come first
					if (
						a.highlight_start + a.highlighted_words <
						b.highlight_start + b.highlighted_words
					) {
						return -1;
					}
					if (
						a.highlight_start + a.highlighted_words >
						b.highlight_start + b.highlighted_words
					) {
						return 1;
					}
					// I want the newest (highest id) - Not sure this is helping anything...
					if (a.id > b.id) return 1;
					if (a.id < b.id) return -1;
				}
				if (a.highlight_start < b.highlight_start) return -1;
				if (a.highlight_start > b.highlight_start) return 1;
			}
			return 0;
		})
		.filter((h) => h.highlighted_words);
	try {
		const newArrayOfVerses = [];
		const arrayOfVerses = [...arrayOfVerseObjects];
		let previousHighlightArray = sortedHighlights;

		arrayOfVerses.forEach((verse) => {
			const verseNumber = verse.verse_start;
			// Get all of the highlights that start in this verse
			// Make the text an array
			let verseText = verse.verse_text.split('');
			// Set the start of the highlight to 0 since this is a "new" verse
			const highlightsStartingInVerse = previousHighlightArray
				.filter(
					(h) =>
						h.verse_start === verseNumber ||
						(h.verse_start < verseNumber && h.highlighted_words > 0),
				)
				.map(
					(h) =>
						h.verse_start !== verseNumber
							? { ...h, verse_start: verseNumber }
							: h,
				)
				.sort((a, b) => {
					// I want the highlight that starts first to be applied first
					if (a.highlight_start === b.highlight_start) {
						// I need the highlight that ends first to be applied first
						if (
							a.highlight_start + a.highlighted_words <
							b.highlight_start + b.highlighted_words
						) {
							return -1;
						}
						if (
							a.highlight_start + a.highlighted_words >
							b.highlight_start + b.highlighted_words
						) {
							return 1;
						}
						// I want the newest highlight to be before the older highlight
						if (a.id > b.id) return 1;
						if (a.id < b.id) return -1;
					}
					if (a.highlight_start < b.highlight_start) return -1;
					if (a.highlight_start > b.highlight_start) return 1;
					return 0;
				});

			try {
				const newData = handleNewVerse({
					highlightsStartingInVerse,
					verseText,
				});

				verseText = newData.verseText;
				// Creating the new array with the updated highlight lengths based on which highlights were applied
				// Map: -> Applies the updated highlighted_words values supplied by the highlighting function
				// Reduce: -> Removes the highlights that were "used up" in the last verse
				previousHighlightArray = previousHighlightArray
					.map((h) => {
						// Gets the object representing the changing needing to be made to this highlight
						if (newData.highlightsToUpdate[h.id]) {
							// If there was an object it means that this highlight needs to be updated
							const newH = { ...h };
							// For each update add the value to the appropriate key in the new highlight
							Object.entries(newData.highlightsToUpdate[h.id]).forEach(
								(entry) => {
									newH[entry[0]] = entry[1];
								},
							);
							return newH;
						}
						// Return the initial highlight
						return h;
					})
					.reduce(
						(a, h) =>
							h.verse_start === verseNumber && h.highlighted_words <= 0
								? a
								: [...a, h],
						[],
					);
			} catch (e) {
				if (process.env.NODE_ENV === 'development') {
					console.warn('Error in handleNewVerse', e); // eslint-disable-line no-console
				}
			}
			// eslint-disable-line no-param-reassign
			if (verseText.join('') !== verse.verse_text) {
				newArrayOfVerses.push({
					...verse,
					verse_text: `${verseText.join('')}`,
					hasHighlight: true,
				});
			} else {
				newArrayOfVerses.push({ ...verse });
			}
		});
		return newArrayOfVerses;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text with no highlights
		return arrayOfVerseObjects;
	}
};

function handleNewVerse({ highlightsStartingInVerse, verseText }) {
	const verseLength = verseText.length;
	const highlightsToUpdate = {};

	/* Highlighting Process
	* 1. Start highlight at the starting index
	* 2. Check if the highlight length is longer than the verse
	* 3. (Highlight is in this verse) -> insert the closing tag at the appropriate place and then set highlighted_words to 0
	* 4. (Highlight goes past this verse) -> insert closing tag at the end of the verse then reduce highlighted_words by the amount of characters that were highlighted
	* */
	highlightsStartingInVerse.forEach((h, i) => {
		const nextHighlight = highlightsStartingInVerse[i + 1];
		/* COMMONLY USED VALUES */
		const backgroundStyle = `style="background:linear-gradient(${
			h.highlighted_color ? h.highlighted_color : 'inherit'
		},${h.highlighted_color ? h.highlighted_color : 'inherit'})"`;
		const highlightLength = h.highlight_start + (h.highlighted_words - 1);

		/* HIGHLIGHT STARTS IN A LATER SECTION OF THIS VERSE */
		if (h.highlight_start >= verseLength) {
			// Reducing the start of the highlight by the length of the section since it cannot start here

			highlightsToUpdate[h.id] = {
				highlight_start: h.highlight_start - verseLength,
			};
		} else if (
			nextHighlight &&
			h.highlight_start < nextHighlight.highlight_start &&
			highlightLength > nextHighlight.highlight_start &&
			highlightLength <
				nextHighlight.highlight_start + (nextHighlight.highlighted_words - 1)
		) {
			/* HIGHLIGHT STOPS IN MIDDLE OF NEXT HIGHLIGHT */
			// if two highlights overlap and neither is contained completely in the other
			// Start the first highlight
			verseText.splice(
				h.highlight_start,
				1,
				`<em class="text-highlighted" ${backgroundStyle}>${
					verseText[h.highlight_start]
				}`,
			);
			// close the first highlight on the character before where the second highlight starts
			verseText.splice(
				nextHighlight.highlight_start - 1,
				1,
				`${verseText[nextHighlight.highlight_start - 1]}</em>`,
			);
			// start the first highlight again where the second starts
			verseText.splice(
				nextHighlight.highlight_start,
				1,
				`<em class="text-highlighted" ${backgroundStyle}>${
					verseText[nextHighlight.highlight_start]
				}`,
			);
			// close the first highlight where it ends
			/* SETS THE CLOSING TAG AND HANDLES UPDATING THE HIGHLIGHT OBJECT */
			if (verseLength < highlightLength) {
				// The highlight extends past this verse and into the next one
				verseText.splice(
					verseLength - 1,
					1,
					`${verseText[verseLength - 1]}</em>`,
				);
				// Setting the new value for highlighted_words and start
				// Sets start to 0 because this highlight needs to resume in the beginning of the next verse

				highlightsToUpdate[h.id] = {
					highlighted_words:
						h.highlighted_words - (verseLength - h.highlight_start),
					highlight_start: 0,
				};
			} else {
				// The highlight has to be contained within this verse
				verseText.splice(
					highlightLength,
					1,
					`${verseText[highlightLength]}</em>`,
				);
				// Setting the new value for highlighted_words
				highlightsToUpdate[h.id] = { highlighted_words: 0 };
			}
		} else {
			/* SETS THE OPENING TAG FOR THE HIGHLIGHT (BASE CASE) */
			verseText.splice(
				h.highlight_start,
				1,
				`<em class="text-highlighted" ${backgroundStyle}>${
					verseText[h.highlight_start]
				}`,
			);
			/* SETS THE CLOSING TAG AND HANDLES UPDATING THE HIGHLIGHT OBJECT */
			if (verseLength <= highlightLength) {
				// The highlight extends past this verse and into the next one
				verseText.splice(
					verseLength - 1,
					1,
					`${verseText[verseLength - 1]}</em>`,
				);
				// Setting the new value for highlighted_words and start
				// Sets start to 0 because this highlight needs to resume in the beginning of the next verse
				highlightsToUpdate[h.id] = {
					highlighted_words:
						h.highlighted_words - (verseLength - h.highlight_start),
					highlight_start: 0,
				};
			} else {
				// The highlight has to be contained within this verse
				verseText.splice(
					highlightLength,
					1,
					`${verseText[highlightLength]}</em>`,
				);
				// Setting the new value for highlighted_words
				highlightsToUpdate[h.id] = { highlighted_words: 0 };
			}
		}
	});

	// Returning the highlights here so that the changes to the highlighted words are persisted
	return {
		verseText,
		highlightsToUpdate,
	};
}

export default createHighlights;
