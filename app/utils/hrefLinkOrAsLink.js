export default ({ textId, bookId, chapter, nextVerse, isHref, audioType }) => {
	const baseUrl = isHref ? '/app?' : '/bible';
	const params = audioType
		? `${isHref ? '&' : '?'}audio_type=${audioType}`
		: '';

	if (isHref) {
		if (nextVerse) {
			return `${baseUrl}bibleId=${textId}&bookId=${bookId}&chapter=${chapter}&verse=${nextVerse}${params}`;
		}
		return `${baseUrl}bibleId=${textId}&bookId=${bookId}&chapter=${chapter}${params}`;
	}
	if (nextVerse) {
		return `${baseUrl}/${textId}/${bookId}/${chapter}/${nextVerse}${params}`;
	}
	return `${baseUrl}/${textId}/${bookId}/${chapter}${params}`;
};
