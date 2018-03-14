import React from 'react';

const createHighlights = (highlights, arrayOfVerseObjects) => {
	// Iterate over each verse
		// Find all the highlights for a single verse
		// Apply all highlights for that verse
			// If the highlight goes past the end of the verse
			// Create a new highlight that has the update range and a start verse of the next verse in line

	try {
		// Parse the plain text
		const newArrayOfVerseObjects = [];
		// needs to run for each highlight object that the user has added
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
		return newArrayOfVerseObjects;
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			console.warn('Error in parsing highlights', error); // eslint-disable-line no-console
		}
		// If there was an error just return the text without highlights
		return arrayOfVerseObjects;
	}
};

export default createHighlights;
