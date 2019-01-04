// Takes two separate book lists and finds the first book/chapter
// combination that matches in both lists
const firstMatchingChapter = (textObj, audioObj) => {
	const text = Object.values(textObj)[0].reduce(
		(reducedBooks, book) => ({
			...reducedBooks,
			[book.book_id]: book.chapters,
		}),
		{},
	);
	const audio = Object.values(audioObj)[0].reduce(
		(reducedBooks, book) => ({
			...reducedBooks,
			[book.book_id]: book.chapters,
		}),
		{},
	);
	let firstLocation;

	/* eslint-disable */
	// Look into why going for-in here is recommended against
	for (const key in text) {
		if (firstLocation) break;
		if (audio[key]) {
			for (let i = 0; i < text[key].length; i++) {
				if (firstLocation) break;
				if (audio[key].includes(text[key][i])) {
					firstLocation = `${key}/${text[key][i]}`;
				}
			}
		}
	}
	/* eslint-enable */

	return firstLocation;
};

export default firstMatchingChapter;
