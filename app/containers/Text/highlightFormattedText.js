// Optional third arg for testing purposes
const createFormattedHighlights = (
	highlights,
	formattedTextString,
	DomCreator,
) => {
	/* NOTES
	* 1. Need to subtract 1 from any addition of highlight_start + highlighted_words, this is because the result is the length not the index
	* */
	/* Notes on Logic for function
	* Iterate over each verse
	* Find all the highlights for a single verse
	* Apply all highlights for that verse
	* If the highlight goes past the end of the verse
	* Create a new highlight that has the update range and a start verse of the next verse in line
	* */

	// Step 1: Create copy of highlight objects and sort them
	// Step 2: Create a dom based on the formatted text string
	// Step 3: Get all of the elements with data-id (These are all verse elements with the exception of the first one)
	// Step 4: Iterate over every verse In order from least to greatest
	// Step 5: For each verse find all the highlights starting in that verse
	// Apply each highlight in the verse from shortest to longest
	// Each time a highlight is applied reduce its highlighted_words field by the number of characters highlighted
	// If highlighted_words is 0 then remove the highlight from the array
	// Step 6: At the start of a new verse check for any highlights left over from the previous verse
	// If highlighted_words is above 0 and the verse ended
	// Update the verse number to be the next verse
	// Step 7: Set the innerHTML of the verse element with the new html that contains the highlights for that verse
	// Step 8: Create a new formatted text string out of the new dom that was created
	// Step 9: Return new formatted text string

	// Doing a deep copy of the highlights since I am going to be mutating it.
	// Sort the highlights
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
		// Set the env for testing purposes
		const env = process.env.NODE_ENV;

		// Instantiate the string -> html parser
		const parser = env === 'test' ? () => {} : new DOMParser();
		// Instantiate the html -> serializer
		const serializer = env === 'test' ? () => {} : new XMLSerializer();
		// Instantiate jsDOM for creating a mock dom (needed for testing)
		const jsDOM =
			env === 'test' ? new DomCreator(formattedTextString) : undefined;
		// Set the xml document based on whether this is live or a test
		const xmlDoc =
			env === 'test'
				? jsDOM.window.document
				: parser.parseFromString(formattedTextString, 'text/xml');
		let lastVerseNumber = 0; // the verse number of the last verse to have highlights applied
		let previousHighlightArray = sortedHighlights;

		// Get all verse elements (the first element with data-id is a div which is why I slice at 1)
		const ad = [...xmlDoc.querySelectorAll('[data-id]')].slice(1);

		// Iterate over all the verses
		ad.forEach((verseElement) => {
			// Get all the children
			/*
				Note node: <span class='note'><a class='footnote'>*</a></span>
				Text node: Adam and Eve had a son
				Emphasis node: <add>was</add>
				Highlight node: <em class="text-highlighted" style="...">and they called him Abel</em>
			*/
			const children = verseElement.childNodes.length
				? [...verseElement.childNodes]
				: [verseElement];
			// Parse the verse data-id to get the verse number
			const verseNumber = parseInt(
				verseElement.attributes['data-id'].value.split('_')[1],
				10,
			);
			const newChildren = [];

			children.forEach((originalVerse) => {
				// If this is the first child and the highlight_start is greater than its length set newHighlightStart
				// Clone each node because it has to be removed and then added again to preserve the original html and add the highlight
				const verse = originalVerse.cloneNode(true);
				// Check if this child node is a note
				const isNote =
					!!verse.attributes && verse.attributes.class.value === 'note';
				// Remove the child since I already cloned it
				verseElement.removeChild(originalVerse);
				// Verse already started -> need to treat it like a new verse
				const sameVerse = verseNumber === lastVerseNumber;

				// Filter: -> Gets all of the highlights that start in this verse and all the previous highlights that have left over characters
				// Map: -> Updates the previous highlights to contain the new verse number and also to start out at 0
				const highlightsStartingInVerse = previousHighlightArray
					.filter(
						(h) =>
							h.verse_start === verseNumber ||
							(h.verse_start < verseNumber && h.highlighted_words > 0),
					)
					.map(
						(h) =>
							h.verse_start !== verseNumber ||
							(h.verse_start === verseNumber && sameVerse)
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
				// Get the text for a verse (really just a section of a verse)
				let verseText = verse.textContent.split('');
				// If the highlight start is greater than this sections length
				// update the start to be highlight_start - verseText.length
				// use the new highlight start in the next section of the verse
				if (!isNote) {
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
				}
				// Create a blank node to use in the case that the current node is a text node
				const newNonTextNode = xmlDoc.createElement('span');
				let verseTextHtml = '';
				let isNotValidHtml = false;

				if (env === 'test') {
					verseTextHtml = verseText.join('');
				} else {
					verseTextHtml = parser
						.parseFromString(verseText.join(''), 'text/html')
						.getElementsByTagName('body')[0].innerHTML;

					try {
						xmlDoc.createElement('span').innerHTML = verseTextHtml;
					} catch (err) {
						isNotValidHtml = true;
					}
				}

				if (verse.nodeType === 3) {
					if (!isNotValidHtml) {
						// this is a text node and cannot have inner html so I need a new element to be able to add the highlight
						newNonTextNode.innerHTML = verseTextHtml;
					}
				} else if (!isNote) {
					// Set the inner html for this verse - this overrides any other styling that had been inside that verse
					if (!isNotValidHtml) {
						// this is a text node and cannot have inner html so I need a new element to be able to add the highlight
						verse.innerHTML = verseTextHtml;
					}
				}
				newChildren.push(verse.nodeType === 3 ? newNonTextNode : verse);
				// Use charsLeft to highlight as much of this verse as possible, then carry its value over into the next verse
				// Save this verse number as the new 'previous verse number'
				lastVerseNumber = verseNumber;
			});

			// Append all of the updated child nodes to the original verse node
			newChildren.forEach((child) => {
				verseElement.appendChild(child);
			});
		});

		return env === 'test'
			? xmlDoc.querySelectorAll('body')[0].innerHTML
			: serializer.serializeToString(xmlDoc);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		if (process.env.NODE_ENV === 'test') {
			console.log('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text with no highlights
		return formattedTextString;
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

export default createFormattedHighlights;
