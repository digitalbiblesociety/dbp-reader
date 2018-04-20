const createFormattedHighlights = (highlights, formattedTextString) => {
	// TODO: Major! If the starting index in a verse is past the end of the verse then start the highlight on the next line
	/* NOTES
	* 1. Need to subtract 1 from any addition of highlight_start + highlighted_words, this is because the result is the length not the index
	* todo check and see if this function fully supports overlapping highlights
	* */
	/* Notes on Logic for function
	* Iterate over each verse
	* Find all the highlights for a single verse
	* Apply all highlights for that verse
	* If the highlight goes past the end of the verse
	* Create a new highlight that has the update range and a start verse of the next verse in line
	* */

	// Sort the highlights
	const sortedHighlights = highlights.sort((a, b) => {
		if (a.verse_start < b.verse_start) return -1;
		if (a.verse_start > b.verse_start) return 1;
		if (a.verse_start === b.verse_start) {
			if (a.highlight_start < b.highlight_start) return -1;
			if (a.highlight_start > b.highlight_start) return 1;
		}
		return 0;
	});

	try {
		const parser = new DOMParser();
		const serializer = new XMLSerializer();
		const xmlDoc = parser.parseFromString(formattedTextString, 'text/xml');

		// const arrayOfVerses = [...xmlDoc.getElementsByClassName('v')];
		let charsLeftAfterVerseEnd = 0; // the number of characters for the highlight
		let continuingColor = '';
		let lastVerseNumber = 0;

		const ad = [...xmlDoc.querySelectorAll('[data-id]')].slice(1); // Get all verse elements

		// console.log('------------------------------------------------------------------------');

		ad.forEach((verseElement) => {
			const children = verseElement.childNodes.length ? [...verseElement.childNodes] : [verseElement];
			// Parse the verse data-id to get the verse number
			const verseNumber = parseInt(verseElement.attributes['data-id'].value.split('_')[1], 10);
			// console.log('children for verseElement', children);
			// Test theory only on the fifteenth element
			// if (i === 15) {
			// 	verseElement.childNodes.forEach((node) => {
			// 		// get text for node
			// 		console.log('test theory on children textContent', node.textContent, '\n\nand innerHTML', node.innerHTML);
			// 	});
			// }
			const newChildren = [];

			children.forEach((originalVerse) => {
				const verse = originalVerse.cloneNode(true);
				// console.log(!!verse.attributes);
				// if (verse.attributes) {
				// 	console.log(verse.attributes.class.value);
				// }
				const isNote = (!!verse.attributes && verse.attributes.class.value === 'note');
				// console.log('is a note', isNote);
				verseElement.removeChild(originalVerse);
				// Verse already started -> need to treat it like a new verse
				const sameVerse = verseNumber === lastVerseNumber;

				// Get all of the highlights that start in this verse
				const highlightsStartingInVerse = sortedHighlights.filter((highlight) => highlight.verse_start === verseNumber);

				// Get the text for a verse
				let verseText = verse.textContent.split('');
				// console.log('child node', verse);
				// console.log('same verse', sameVerse);
				// console.log(verseNumber, lastVerseNumber);
				// todo: If the highlight start is greater than this sections length
				// todo: update the start to be highlight_start - verseText.length
				// todo: use the new highlight start in the next section of the verse
				if (!isNote) {
				// If the node is a footnote then skip over it
					if (sameVerse) {
						// If the verse has the same index as the last one
						// console.log('same verse text', verseText);
						try {
							const newData = handleSameVerse({
								charsLeftAfterVerseEnd,
								continuingColor,
								verseText,
							});

							verseText = newData.verseText;
							charsLeftAfterVerseEnd = newData.charsLeftAfterVerseEnd;
							continuingColor = newData.continuingColor;
						} catch (e) {
							if (process.env.NODE_ENV === 'development') {
								console.warn('Error in handleNewVerse', e); // eslint-disable-line no-console
							}
						}
					} else {
						// This verse is different from the last one
						try {
							const newData = handleNewVerse({
								highlightsStartingInVerse,
								charsLeftAfterVerseEnd,
								continuingColor,
								verseText,
							});

							verseText = newData.verseText;
							charsLeftAfterVerseEnd = newData.charsLeftAfterVerseEnd;
							continuingColor = newData.continuingColor;
						} catch (e) {
							if (process.env.NODE_ENV === 'development') {
								console.warn('Error in handleNewVerse', e); // eslint-disable-line no-console
							}
						}
					}
				}
				const newNonTextNode = xmlDoc.createElement('span');
				if (verse.nodeType === 3) {
					// this is a text node and cannot have inner html
					newNonTextNode.innerHTML = verseText.join('');
					// console.log('newly created element', newNonTextNode);
				} else if (!isNote) {
					// console.log('verse before setting the inner html', verse);
					// Set the inner html for this verse - this overrides any other styling that had been inside that verse
					verse.innerHTML = verseText.join(''); // eslint-disable-line no-param-reassign
					// verse.textContent = verseText.join('');
					// console.log('new verse element', verse, 'and verse text', verseText);
				}
				newChildren.push(verse.nodeType === 3 ? newNonTextNode : verse);
				// console.log('new inner html', verse.innerHTML);
				// Use charsLeft to highlight as much of this verse as possible, then carry its value over into the next verse
				// Save this verse number as the new 'previous verse number'
				lastVerseNumber = verseNumber;
			});

			newChildren.forEach((child) => {
				// console.log('new child', child);
				verseElement.appendChild(child);
			});

			// console.log('verse element', verseElement);
			// console.log('xml right after updating inner html', xmlDoc);
		});
		// console.log('xml outside loop', xmlDoc);

		return serializer.serializeToString(xmlDoc);
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
		}
		// if (process.env.NODE_ENV === 'test') {
		// 	console.log('Failed applying highlight to formatted text', error);
		// }
		// If there was an error just return the text with no highlights
		return formattedTextString;
	}
};

function handleSameVerse({ verseText, charsLeftAfterVerseEnd: passedCharsLeft, continuingColor: passedColor }) {
	let charsLeftAfterVerseEnd = passedCharsLeft;
	const continuingColor = passedColor;
	// let charsLeft = charsLeftAfterVerseEnd;
	// let hStart = 0;

	if (charsLeftAfterVerseEnd) {
		// console.log('this verse has a highlight that did not start in it');
		verseText.splice(0, 1, `<em class="text-highlighted" style="background:${continuingColor}">${verseText[0]}`);
		if (charsLeftAfterVerseEnd > verseText.length) {
			// multi verse highlight
			// console.log('whole verse is highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length - 1]}</em>`);
			charsLeftAfterVerseEnd -= verseText.length;
		} else if (charsLeftAfterVerseEnd === verseText.length) {
			// console.log('the whole verse is not highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(charsLeftAfterVerseEnd - 1, 1, `${verseText[charsLeftAfterVerseEnd - 1]}</em>`);
			charsLeftAfterVerseEnd = 0;
		} else {
			// console.log('the whole verse is not highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(charsLeftAfterVerseEnd, 1, `${verseText[charsLeftAfterVerseEnd]}</em>`);
			charsLeftAfterVerseEnd = 0;
		}
	}

	return {
		verseText,
		charsLeftAfterVerseEnd,
		continuingColor,
	};
}

function handleNewVerse({ highlightsStartingInVerse, verseText, charsLeftAfterVerseEnd: passedCharsLeft, continuingColor: passedColor }) {
	let charsLeftAfterVerseEnd = passedCharsLeft;
	let continuingColor = passedColor;
	let charsLeft = charsLeftAfterVerseEnd;
	let hStart = 0;

	if (charsLeftAfterVerseEnd && highlightsStartingInVerse.length === 0) {
		// console.log('this verse has a highlight that did not start in it');
		verseText.splice(0, 1, `<em class="text-highlighted" style="background:${continuingColor}">${verseText[0]}`);
		if (charsLeftAfterVerseEnd > verseText.length) {
			// multi verse highlight
			// console.log('whole verse is highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(verseText.length - 1, 1, `${verseText[verseText.length - 1]}</em>`);
			charsLeftAfterVerseEnd -= verseText.length;
		} else if (charsLeftAfterVerseEnd === verseText.length) {
			// console.log('the whole verse is not highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(charsLeftAfterVerseEnd - 1, 1, `${verseText[charsLeftAfterVerseEnd - 1]}</em>`);
			charsLeftAfterVerseEnd = 0;
		} else {
			// console.log('the whole verse is not highlighted', charsLeftAfterVerseEnd, verseText.length);
			verseText.splice(charsLeftAfterVerseEnd, 1, `${verseText[charsLeftAfterVerseEnd]}</em>`);
			charsLeftAfterVerseEnd = 0;
		}
	}
	// console.log('verse text', verseText.length);
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
			// console.log('h.highlight_start', h.highlight_start);
			// console.log('h.highlighted_words', h.highlighted_words);
			verseText.splice(h.highlight_start, 1, `<em class="text-highlighted" style="background:${h.highlighted_color ? h.highlighted_color : 'inherit'}">${verseText[h.highlight_start]}`);
			hStart = h.highlight_start;
		}
		// if the next highlight start is less than the end of this highlight
		if (nh && nh.highlight_start <= ((h.highlighted_words + h.highlight_start) - 1)) {
			// check if the furthest highlighted character for this highlight is greater than the furthest character for the next highlight
			if (((h.highlighted_words + h.highlight_start) - 1) > ((nh.highlight_start + nh.highlighted_words) - 1)) {
				// in this case the next highlight will be contained within this highlight and doesn't need to be accounted for
				charsLeft = h.highlighted_words;
			} else {
				// in this case the next highlight will continue to extend past where this one ends
				charsLeft = (nh.highlighted_words + nh.highlight_start) - 1;
			}
			// console.log('chars left for overlap', charsLeft);
		} else if ((charsLeft + hStart) <= verseText.length && ((h.highlighted_words + h.highlight_start) - 1) < verseText.length) {
			// The next highlight is not overlapped by this one
			// This highlight doesn't go past the end of the verse
			if (charsLeft === 0) {
				verseText.splice((h.highlighted_words + h.highlight_start) - 1, 1, `${verseText[(h.highlighted_words + h.highlight_start) - 1]}</em>`);
			} else {
				verseText.splice(charsLeft, 1, `${verseText[charsLeft]}</em>`);
				charsLeft = 0;
			}
			// console.log('chars left at splice', charsLeft);
		} else if ((charsLeft + hStart) > verseText.length || ((h.highlighted_words + h.highlight_start) - 1) > verseText.length) {
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
			continuingColor = h.highlighted_color;
		}
		// Face I made when I found out highlight_start is a string while everything else is an integer... ( ‾ ʖ̫ ‾)
		// If the current highlight overlaps another highlight before it. example v5 - v19, v3 - v6 = v3 - v19
		// If the current highlight overlaps another highlight after it. example v1 - v6, v5 - v9 = v1 - v9
		// If the current highlight encompasses another highlight. example v1 - v12, v4 - v6 = v1 - v12
		// If the current highlight is encompassed by another highlight. example v4 - v6, v1 - v12 = v1 - v12
		// New acc so I don't introduce side effects - mostly so eslint leaves me alone ( ͡~ ͜ʖ ͡°)
	});

	return {
		verseText,
		charsLeftAfterVerseEnd,
		continuingColor,
	};
}

export default createFormattedHighlights;
