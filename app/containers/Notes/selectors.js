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

const selectActiveBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeBookName')
);

const selectActiveChapter = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeChapter')
);

const selectActiveTextId = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeTextId')
);

const selectActiveFilesets = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('activeFilesets')
);

const selectSelectedBookName = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('selectedBookName')
);

const selectActiveNote = () => createSelector(
	selectHomepageDomain,
	(substate) => substate.get('note')
);

const selectNotePassage = () => createSelector(
	selectHomepageDomain,
	(substate) => {
		const text = substate.get('chapterText');
		const referenceId = substate.getIn(['note', 'referenceId']);
		if (!referenceId) {
			return '';
		}
		const idPieces = referenceId.split('_');
		const verseId = (idPieces[2].indexOf('-') ? idPieces[2].split('-') : idPieces[2]).map(Number);
		const verses = text.filter((chapter) => verseId.length > 1 ? chapter.get('verse_start') >= verseId[0] && chapter.get('verse_start') <= verseId[1] : chapter.get('verse_start') === verseId[0]);
		const passage = verses.reduce((passageText, verse) => passageText.concat(verse.get('verse_text')), '');

		return passage;
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
	selectActiveChapter,
	selectActiveBookName,
	selectActiveFilesets,
	selectHighlightedText,
	selectSelectedBookName,
	selectUserAuthenticationStatus,
};
