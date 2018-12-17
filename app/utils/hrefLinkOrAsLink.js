export default ({ textId, bookId, chapter, nextVerse, isHref }) => {
	const baseUrl = isHref ? '/app?' : '/bible';

	if (isHref) {
		if (nextVerse) {
			return `${baseUrl}bibleId=${textId}&bookId=${bookId}&chapter=${chapter}&verse=${nextVerse}`;
		}
		return `${baseUrl}bibleId=${textId}&bookId=${bookId}&chapter=${chapter}`;
	}
	if (nextVerse) {
		return `${baseUrl}/${textId}/${bookId}/${chapter}/${nextVerse}`;
	}
	return `${baseUrl}/${textId}/${bookId}/${chapter}`;
};
