import get from 'lodash/get';
/*
	source is a serializable string
	notes is a list of the notes in this chapter
*/
const applyNotes = (source, notes) => {
	const serializer = new XMLSerializer();
	const parser = new DOMParser();

	if (!source || !notes.length) {
		return source;
	}
	const xmlDoc = parser.parseFromString(source, 'text/xml');
	const verses = [...xmlDoc.getElementsByClassName('v-num')];
	const lastV = verses.length - 1;
	// Todo: If the verse is the 1st verse then there will not be an element for it
	// Create the element and add it into the front of the array of children
	// If there aren't any verses or notes return the source to keep the app from breaking
	if (!getVerseNum(verses[0])) {
		return source;
	}
	// Get all verses
	// for each note
	// Check if the note is in the range of verses
	// Then find the verse element
	// Append the note icon as a svg with the appropriate event handlers
	const versesWithNotes = {};

	notes.forEach((note) => {
		if (
			note.verse_start >= getVerseNum(verses[0]) &&
			note.verse_end <= getVerseNum(verses[lastV]) &&
			!versesWithNotes[note.verse_start]
		) {
			const verseElement = verses.filter(
				(v) => getVerseNum(v) === note.verse_start,
			)[0];
			const svg = xmlDoc.createElement('svg');
			const use = xmlDoc.createElement('use');
			// Can't set the event handlers here because this "dom" is removed
			use.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			use.setAttribute('xlink:href', '/static/svglist.svg#note_in_verse');
			svg.setAttribute('class', 'icon note-in-verse');
			svg.appendChild(use);
			// If there are errors in Edge or IE check that the pollyfill for prepend
			// is being loaded, I also default to append as a safe fallback
			verseElement.appendChild(svg);
			versesWithNotes[note.verse_start] = true;
		}
	});

	return serializer.serializeToString(xmlDoc);
};

/*
	source is a serializable string
	bookmarks is a list of the bookmarks in this chapter
*/
const applyBookmarks = (source, bookmarks) => {
	const serializer = new XMLSerializer();
	const parser = new DOMParser();
	if (!source || !bookmarks.length) {
		return source;
	}
	const xmlDoc = parser.parseFromString(source, 'text/xml');
	const verses = [...xmlDoc.getElementsByClassName('v-num')];
	const lastV = verses.length - 1;
	// If there aren't any verses or notes return the source to keep the app from breaking
	if (!getVerseNum(verses[0])) {
		return source;
	}
	// Get all verses
	// for each note
	// Check if the note is in the range of verses
	// Then find the verse element
	// Append the note icon as a svg with the appropriate event handlers
	const versesWithBookmarks = {};

	bookmarks.forEach((bookmark) => {
		if (
			bookmark.verse >= getVerseNum(verses[0]) &&
			bookmark.verse <= getVerseNum(verses[lastV]) &&
			!versesWithBookmarks[bookmark.verse]
		) {
			const verseElement = verses.filter(
				(v) => getVerseNum(v) === bookmark.verse,
			)[0];
			const svg = xmlDoc.createElement('svg');
			const use = xmlDoc.createElement('use');
			// Can't set the event handlers here because this "dom" is removed
			use.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			use.setAttribute('xlink:href', '/static/svglist.svg#bookmark_in_verse');
			svg.setAttribute('class', 'icon bookmark-in-verse');
			svg.appendChild(use);
			// If there are errors in Edge or IE check that the pollyfill for prepend
			// is being loaded, I also default to appendChild as a safe fallback
			verseElement.appendChild(svg);
			versesWithBookmarks[bookmark.verse] = true;
		}
	});

	return serializer.serializeToString(xmlDoc);
};

function getVerseNum(verse) {
	const thirdClass = get(verse, ['attributes', 'class', 'value']);
	const num = thirdClass && thirdClass.split(' ')[2].split('-')[1];

	return parseInt(num, 10);
}

export { applyNotes, applyBookmarks };
