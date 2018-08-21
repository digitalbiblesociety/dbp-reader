export default ({ textId, bookId, chapter, nextVerse, isHref }) => {
	const baseUrl = isHref ? '/app?' : '/bible';
	// console.log('Next verse in hreflink', nextVerse);

	if (isHref) {
		if (nextVerse) {
			// console.log('Next href has verse');
			return `${baseUrl}&bibleId=${textId}&bookId=${bookId}&chapter=${chapter}&verse=${nextVerse}`;
		}
		return `${baseUrl}&bibleId=${textId}&bookId=${bookId}&chapter=${chapter}`;
	}
	if (nextVerse) {
		// console.log('Next link has verse');
		return `${baseUrl}/${textId}/${bookId}/${chapter}/${nextVerse}`;
	}
	return `${baseUrl}/${textId}/${bookId}/${chapter}`;
};
