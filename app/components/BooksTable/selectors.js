import { createSelector } from 'reselect';
import { fromJS } from 'immutable';

const selectHomepageDomain = (state) => state.get('homepage');

// TODO: Refactor from using toJS() to using immutable maps
const selectBooks = () =>
	createSelector(selectHomepageDomain, (substate) => {
		const splitBooks = {};
		const books = substate.get('books');
		const testamentMap = substate.get('testaments').toJS
			? substate.get('testaments').toJS()
			: substate.get('testaments');
		// console.log('testamentMap', testamentMap);
		books.forEach((book) => {
			if (splitBooks[testamentMap[book.get('book_id')]]) {
				splitBooks[testamentMap[book.get('book_id')]].push(book);
			} else {
				splitBooks[testamentMap[book.get('book_id')]] = [book];
			}
		});

		// console.log('books', books);
		// console.log('testamentMap', testamentMap);
		// console.log('splitBooks', fromJS(splitBooks));
		// console.log('ot', fromJS(splitBooks).get('OT'));

		if (Object.keys(splitBooks).length) {
			return fromJS(splitBooks);
		}
		// Fallback to try and prevent app from breaking
		return books;
	});

const selectActiveTextId = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('activeTextId'),
	);

const selectActiveBookName = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('activeBookName'),
	);

const selectActiveChapter = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('activeChapter'),
	);

const selectAudioObjects = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('audioObjects').toJS(),
	);

const selectHasTextInDatabase = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('hasTextInDatabase'),
	);

const selectFilesetTypes = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('filesetTypes').toJS(),
	);

const selectLoadingBookStatus = () =>
	createSelector(selectHomepageDomain, (substate) =>
		substate.get('loadingBooks'),
	);

export {
	selectActiveTextId,
	selectBooks,
	selectActiveBookName,
	selectActiveChapter,
	selectAudioObjects,
	selectHasTextInDatabase,
	selectFilesetTypes,
	selectLoadingBookStatus,
};
