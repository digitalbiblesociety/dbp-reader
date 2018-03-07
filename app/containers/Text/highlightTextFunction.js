import React from 'react';

const createHighlights = ({ plainText, verseStart, highlightStart: originalHighlightStart, highlightedWords }) => {
	// console.log(`text array for verse ${verseStart} and highlight ${originalHighlightStart}`, plainText);
	// console.log('highlight verse start', verseStart);
	// console.log('highlight highlight start', originalHighlightStart);
	// console.log('highlight highlighted words', highlightedWords);
	// need to pass this function these values from the api
	// needs to run for each highlight object that the user has added
	let wordsLeftToHighlight = highlightedWords;
	// This has to be done because arrays have a 0 based index but the api is using a 1 based index
	const highlightStart = parseInt(originalHighlightStart, 10) - 1;
	// Add highlightedTextStart, highlightedTextEnd and highlightedText to each verse object
	// Each time a highlight is going to be applied check the following conditions
	// If v.verse_start === verseStart
	// Is the inclusive difference between highlightedTextEnd equal to the length of the verse
	// If it is then subtract the length from wordsLeftToHighlight and move on
	// If wordsLeftToHighlight is now 0 or < 0
	// End the function
	// Is the highlightStart before highlightedTextStart
	// If it is
	try {
		return plainText.map((v) => {
			const newVerse = [];
			// let highlightedTextEnd = v.highlightedTextEnd || null;
			// let highlightedTextStart = v.highlightedTextStart || null;
			// let highlightedText = v.highlightedText || [];
			const highlightedPortion = [];
			const plainPortion = [];
			// If the verse text is already an array that means there is already a highlight
			// Since there is already a highlight we need to do a different set of operations on the text
			// if (Array.isArray(v.verse_text)) {
			// console.log('verse already has a highlight from', v.highlightedTextStart, ' to ', highlightedTextEnd);
			// If v.verse_start === verseStart
			// Is the inclusive difference between highlightedTextEnd equal to the length of the verse
			// If it is then subtract the length from wordsLeftToHighlight and move on
			// If wordsLeftToHighlight is now 0 or < 0
			// End the function
			// Is the highlightStart before highlightedTextStart
			// }
			// The conditional is to prevent the code trying to split a verse after it has become an array
			// This is an issue because of a flaw in the program, I will need to stop iterating over each index
			const verseTextLength = (v.verse_text.split && v.verse_text.split(' ').length);
			const verseTextArray = (v.verse_text.split && v.verse_text.split(' '));
			// If the verse start of the current verse is the same as the starting verse of the highlight
			if (v.verse_start === verseStart) {
				const before = [];
				const after = [];
				// Iterates over each word in that verse's text
				verseTextArray.forEach((word, index) => {
					// if the index is past the start of the highlight
					// and the index minus the starting index is less than the total number of words to highlight
					if (index >= (highlightStart) && (index - highlightStart < wordsLeftToHighlight)) {
						highlightedPortion.push(word);
						// if the index is greater than the highlight start
						// and the index minus the starting index is great than the number of words to highlight
						// then the word must come after the end of the highlight
					} else if (index > (highlightStart) && index - highlightStart >= wordsLeftToHighlight) {
						after.push(word);
						// if the index is less than the starting index
					} else {
						// If the word wasn't in the range to be highlighted or after that range then it must come before it
						before.push(word);
					}
				});

				wordsLeftToHighlight -= (verseTextLength - (highlightStart + 1));
				newVerse.push(before.join(' '));
				newVerse.push(' ');
				// Join the highlighted words together inside a react element - might consider
				// doing the react part later on and just leaving the array as is
				// this would probably help with the issue of highlights overlapping
				newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
				newVerse.push(' ');
				newVerse.push(after.join(' '));
				// if there are still more words left to highlight after the first verse was finished
				// and this verse is past the highlights starting verse
			} else if (wordsLeftToHighlight > 0 && v.verse_start > verseStart) {
				if (wordsLeftToHighlight - verseTextLength > 0) {
					newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{v.verse_text}</span>);
					wordsLeftToHighlight -= verseTextLength;
				} else {
					verseTextArray.forEach((word, index) => {
						// may need to do <=
						if (index < (wordsLeftToHighlight)) {
							highlightedPortion.push(word);
						} else {
							plainPortion.push(word);
						}
					});
					wordsLeftToHighlight -= verseTextLength;
					newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
					newVerse.push(' ');
					newVerse.push(plainPortion.join(' '));
				}
			}

			return { ...v, verse_text: newVerse.length ? newVerse : v.verse_text };
		});
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Error in parsing highlights', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text without highlights
		return plainText;
	}
};

export default createHighlights;
