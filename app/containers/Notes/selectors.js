import { createSelector } from 'reselect';

/**
 * Direct selector to the notes state domain
 */
const selectNotesDomain = (state) => state.get('notes');
const selectProfileDomain = (state) => state.get('profile');
const selectHomepageDomain = (state) => state.get('homepage');

/**
 * Other specific selectors
 */
const selectHighlights = () => createSelector(
	selectHomepageDomain,
	(homepage) => homepage.get('highlights').toJS()
);

const selectUserId = () => createSelector(
	selectProfileDomain,
	(substate) => substate ? substate.get('userId') : ''
);

const selectUserAuthenticationStatus = () => createSelector(
	selectProfileDomain,
	(substate) => substate ? substate.get('userAuthenticated') : false
);

const selectHighlightedText = () => createSelector(
	(state) => state.get('homepage'),
	(homepage) => homepage.get('selectedText')
);

const selectBooks = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('books').toJS()
);

const selectActiveTextId = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeTextId')
);

const selectActiveNote = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('note')
);

const selectNotePassage = () => createSelector(
	[selectHomepageDomain, selectNotesDomain],
	(home, notes) => {
		if (notes.get('chapterForNote').size) {
			// console.log('verse text', notes.get('chapterForNote').reduce((passageText, verse) => passageText.concat(verse.get('verse_text')), ''));
			return notes.get('chapterForNote').reduce((passageText, verse) => passageText.concat(verse.get('verse_text')), '');
		}
		const text = home.get('chapterText');
		const note = home.get('note');
		const chapterNumber = note.get('chapter');
		const verseStart = note.get('verse_start');
		const verseEnd = note.get('verse_end');
		const bookId = note.get('book_id');

		if (!bookId || !chapterNumber || !verseStart) {
			return '';
		}

		const verses = text.filter((verse) => chapterNumber === verse.get('chapter') && (verseStart <= verse.get('verse_start') && verseEnd >= verse.get('verse_end')));
		const passage = verses.reduce((passageText, verse) => passageText.concat(verse.get('verse_text')), '');

		if (!passage) {
			// console.log('verse text', notes.get('chapterForNote').reduce((passageText, verse) => passageText.concat(verse.verse_text), ''));
			return notes.get('chapterForNote').reduce((passageText, verse) => passageText.concat(verse.verse_text), '');
		}

		return passage;
	}
);

const vernacularBookNameObject = () => createSelector(
	selectBooks(),
	(books) => books.reduce((names, book) => ({ ...names, [book.book_id]: [book.name] || [book.name_short] }), {})
);

const selectListData = () => createSelector(
	selectNotesDomain,
	(notes) => {
		const child = notes.get('activeChild');
		// console.log('active child', child);
		// console.log('has notes', notes.get('listData').filter((n) => {
		// 	console.log(n.bookmark === 1);
		// 	return n.bookmark === 1;
		// }));
		// console.log('has bookmarks', notes.get('listData').filter((n) => n.bookmark));
		// notes.get('listData').filter((n) => {
		// 	if (n.bookmark === 1) {
		// 		for (let i = 0; i < n.notes.length; i++) {
		// 			console.log(n.notes[i]);
		// 		}
		// 	}
		// 	// console.log(n.notes == '', n.notes == "", n.notes == false);
		// 	return !!n.notes;
		// });
		if (child === 'bookmarks') {
			return notes.get('listData').filter((n) => n.bookmark);
		}
		// Need to check for the strings because the api is returning string literal quotes
		return notes.get('listData').filter((n) => n.notes && n.notes !== '""' && n.notes !== '\'\'');
	}
);

/**
 * Default selector used by Notes
 */

const makeSelectNotes = () => createSelector(
	selectNotesDomain,
	(substate) => substate.toJS()
);

export default makeSelectNotes;
export {
	selectBooks,
	selectUserId,
	selectActiveNote,
	selectNotesDomain,
	selectNotePassage,
	selectActiveTextId,
	selectHighlightedText,
	selectUserAuthenticationStatus,
	vernacularBookNameObject,
	selectHighlights,
	selectListData,
};
