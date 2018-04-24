import get from 'lodash/get';
import svgs from 'images/svglist.svg';
// Declare Globals - I use these in multiple functions below
// so it makes sense to only declare them once
const serializer = new XMLSerializer();
const parser = new DOMParser();

/*
	source is a serializable string
	notes is a list of the notes in this chapter
*/
const applyNotes = (source, notes) => {
	if (!source || !notes.length) {
		return source;
	}
	const xmlDoc = parser.parseFromString(source, 'text/xml');
	const verses = [...xmlDoc.getElementsByClassName('v-num')];
	const lastV = verses.length - 1;
	// If there aren't any verses or notes return the source to keep the app from breaking
	if (!getVerseNum(verses[0])) {
		return source;
	}
	// console.log('notes', notes);
	// Get all verses
	// for each note
	// Check if the note is in the range of verses
	// Then find the verse element
	// Append the note icon as a svg with the appropriate event handlers
	notes.forEach((note) => {
		if (note.verse_start >= getVerseNum(verses[0]) && note.verse_end <= getVerseNum(verses[lastV])) {
			const verseElement = verses.filter((v) => getVerseNum(v) === note.verse_start)[0];
			const svg = xmlDoc.createElement('svg');
			const use = xmlDoc.createElement('use');
			// Can't set the event handlers here because this "dom" is removed
			use.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			use.setAttribute('xlink:href', `${svgs}#note_in_verse`);
			svg.setAttribute('class', 'icon note-in-verse');
			svg.appendChild(use);
			// If there are errors in Edge or IE check that the pollyfill for prepend
			// is being loaded, I also default to append as a safe fallback
			verseElement.prepend ? verseElement.prepend(svg) : verseElement.appendChild(svg);
			// console.log('verseElement', verseElement);
			// console.log('icon', icon);
		}
	});

	return serializer.serializeToString(xmlDoc);
};

/*
	source is a serializable string
	bookmarks is a list of the bookmarks in this chapter
*/
const applyBookmarks = (source, bookmarks) => {
	if (!source || !bookmarks.length) {
		return source;
	}
	const xmlDoc = parser.parseFromString(source, 'text/xml');
	// console.log('bookmarks', bookmarks);
	const verses = [...xmlDoc.getElementsByClassName('v-num')];
	const lastV = verses.length - 1;
	// If there aren't any verses or notes return the source to keep the app from breaking
	if (!getVerseNum(verses[0])) {
		// console.log('there werent any verses');
		return source;
	}
	// Get all verses
	// for each note
	// Check if the note is in the range of verses
	// Then find the verse element
	// Append the note icon as a svg with the appropriate event handlers
	// console.log(verses);
	// console.log(verses[0]);
	// console.log(verses[lastV]);
	bookmarks.forEach((bookmark) => {
		if (bookmark.verse_start >= getVerseNum(verses[0]) && bookmark.verse_end <= getVerseNum(verses[lastV])) {
			const verseElement = verses.filter((v) => getVerseNum(v) === bookmark.verse_start)[0];
			const svg = xmlDoc.createElement('svg');
			const use = xmlDoc.createElement('use');
			// Can't set the event handlers here because this "dom" is removed
			use.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
			use.setAttribute('xlink:href', `${svgs}#bookmark_in_verse`);
			svg.setAttribute('class', 'icon bookmark-in-verse');
			svg.appendChild(use);
			// If there are errors in Edge or IE check that the pollyfill for prepend
			// is being loaded, I also default to append as a safe fallback
			verseElement.prepend ? verseElement.prepend(svg) : verseElement.appendChild(svg);
			// console.log('verseElement', verseElement);
			// console.log('svg', svg);
			// console.log('svg', svg.onclick);
			// console.log('icon', icon);
		}
	});

	return serializer.serializeToString(xmlDoc);
};

function getVerseNum(verse) {
	const thirdClass = get(verse, ['attributes', 'class', 'value']);
	// console.log('verse.attributes', verse && verse.attributes.class.value);
	const num = thirdClass && thirdClass.split(' ')[2].split('-')[1];

	// console.log('num', num);
	return parseInt(num, 10);
}

export {
	applyNotes,
	applyBookmarks,
};
