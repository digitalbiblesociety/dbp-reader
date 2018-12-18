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

const selectActiveBookName = () =>
	createSelector(selectHomepageDomain, (home) => home.get('activeBookName'));

const selectUserId = () =>
	createSelector(
		selectProfileDomain,
		(substate) => (substate ? substate.get('userId') : ''),
	);

const selectUserAuthenticationStatus = () =>
	createSelector(
		selectProfileDomain,
		(substate) => (substate ? substate.get('userAuthenticated') : false),
	);

const selectHighlightedText = () =>
	createSelector(
		(state) => state.get('homepage'),
		(homepage) => homepage.get('selectedText'),
	);

const selectBooks = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('books').toJS(),
	);

const selectActiveTextId = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('activeTextId'),
	);

const selectActiveNote = () =>
	createSelector(selectHomepageDomain, (substate) => substate.get('note'));

const selectNotePassage = () =>
	createSelector([selectHomepageDomain, selectNotesDomain], (home, notes) => {
		if (notes.get('chapterForNote').size) {
			return notes
				.get('chapterForNote')
				.reduce(
					(passageText, verse) => passageText.concat(verse.get('verse_text')),
					'',
				);
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

		const verses = text.filter(
			(verse) =>
				chapterNumber === verse.get('chapter') &&
				(verseStart <= verse.get('verse_start') &&
					verseEnd >= verse.get('verse_end')),
		);
		const passage = verses.reduce(
			(passageText, verse) => passageText.concat(verse.get('verse_text')),
			'',
		);

		if (!passage) {
			return notes
				.get('chapterForNote')
				.reduce(
					(passageText, verse) => passageText.concat(verse.verse_text),
					'',
				);
		}

		return passage;
	});

const vernacularBookNameObject = () =>
	createSelector(selectBooks(), (books) =>
		books.reduce(
			(names, book) => ({
				...names,
				[book.book_id]: [book.name] || [book.name_short],
			}),
			{},
		),
	);

/**
 * Default selector used by Notes
 */

const makeSelectNotes = () =>
	createSelector(selectNotesDomain, (substate) => substate.toJS());

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
	selectActiveBookName,
};
