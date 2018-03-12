import React from 'react';

const createHighlights = ({ readersMode, plainText, verseStart, highlightStart: originalHighlightStart, highlightedWords, formattedText }) => {
	if (formattedText && !readersMode) {
		// Parse the formatted text
		// console.log(formattedText);
		// console.log(stringing);
		try {
			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(formattedText, 'text/xml');
			const arrayOfVerses = [...xmlDoc.getElementsByClassName('v')];
			const highlightStart = parseInt(originalHighlightStart, 10) - 1;
			let numberOfCharsToHighlight = highlightedWords;
			let firstVerseIndex;
			// console.log(arrayOfVerses);
			// Only handles 1 highlight
			// Will need first verse index to allow multi-line highlights
			// let firstVerseIndex = 0;
			const firstVerse = arrayOfVerses.filter((verse, verseIndex) => {
				if (verse.attributes['data-id'].value.split('_')[1] === verseStart.toString()) {
					firstVerseIndex = verseIndex;
					// Keep track of how many letters are in this node
					// If the number of letters needing to be highlighted is greater than
					// What is contained in this verse, get the next verse as well
					numberOfCharsToHighlight -= verse.textContent.length;
					return true;
				}
				if (firstVerseIndex && verseIndex > firstVerseIndex && numberOfCharsToHighlight > 0) {
					numberOfCharsToHighlight -= verse.textContent.length;
					return true;
				}
				return false;
			});
			// console.log('verse dom nodes', firstVerse);
			// console.log('verse inner html', firstVerse.innerHTML);
			// console.log('verse inner text', firstVerse.textContent);
			const firstVerseText = firstVerse[0].textContent.split('');
			// console.log('verse text', firstVerseText);
			const lastIndex = firstVerseText.length;

			const newText = firstVerseText.map((char, charIndex) => {
				if (charIndex === highlightStart) {
					if (charIndex === lastIndex) {
						return `<em class="text-highlighted">${char}</em>`;
					}
					return `<em class="text-highlighted">${char}`;
				}
				if (charIndex - highlightStart === highlightedWords) {
					// this is the last char
					// console.log('calc in last char', charIndex, highlightStart, highlightedWords);
					// console.log('last char is highlighted');
					return `${char}</em>`;
				}
				if (charIndex === lastIndex) {
					return `${char}</em>`;
				}
				return char;
			});
			firstVerse[0].innerHTML = newText.join('');
			// console.log('updated verse', firstVerse[0]);
			// console.log('xml document', xmlDoc);
			// console.log('new text with highlight', newText);
			// console.log('the first verses text', firstVerseText);
			// console.log('index of the first verse', firstVerseIndex);
			// console.log('xml after making highlight', xmlDoc);
			const serializer = new XMLSerializer();

			return serializer.serializeToString(xmlDoc);
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Failed applying highlight to formatted text', error); // eslint-disable-line no-console
			}
			return formattedText;
		}
	} else {
		try {
			// Parse the plain text
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
				// Should try to use the <em /> method I used for formatted text
				const verseTextLength = (v.verse_text.split && v.verse_text.split('').length);
				const verseTextArray = (v.verse_text.split && v.verse_text.split(''));
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
					newVerse.push(before.join(''));
					newVerse.push(' ');
					// Join the highlighted words together inside a react element - might consider
					// doing the react part later on and just leaving the array as is
					// this would probably help with the issue of highlights overlapping
					newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join('')}</span>);
					newVerse.push(' ');
					newVerse.push(after.join(''));
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
						newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join('')}</span>);
						newVerse.push(' ');
						newVerse.push(plainPortion.join(''));
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
	}
};

export default createHighlights;
