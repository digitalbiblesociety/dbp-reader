import { createSelector } from 'reselect';
// import * as pages from 'utils/ENGKJV/list';
// import bookNames from 'utils/listOfBooksInBible';

/**
 * Direct selector to the homepage state domain
 */
const selectHomePageDomain = (state) => state.get('homepage');

const selectFormattedSource = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		// Pushing update with the formatted text working but not the footnotes
		const source = substate.get('formattedSource');
		const chapterStart = source.indexOf('<div class="chapter');
		const chapterEnd = source.indexOf('<div class="footnotes">', chapterStart);
		// const footnotesStart = source.indexOf('<div class="footnotes">');
		// const footnotesEnd = source.indexOf('<div class="footer">', footnotesStart);

		const main = source.slice(chapterStart, chapterEnd);
		// const footnotes = source.slice(footnotesStart, footnotesEnd);
		// console.log('the footnotes', footnotes);
		// const newSource = { main, footnotes };
		// console.log('new source', newSource);
		// const reactJsx = main.replace(/class="/g, 'className="')

		return main;
	}
);

/**
 * Other specific selectors
 */
const selectActiveBook = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');
		const activeBook = books.filter((book) => book.get('book_id') === activeBookId).get(0);

		return activeBook;
	}
);

const selectNextBook = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');
		const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);
		const nextBook = books.get(activeBookIndex + 1);

		return nextBook;
	}
);

const selectPrevBook = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');
		const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);
		const previousBook = books.get(activeBookIndex - 1);
		return previousBook;
	}
);

const selectSettings = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const toggleOptions = substate.getIn(['userSettings', 'toggleOptions']);
		const filteredToggleOptions = toggleOptions.filter((option) => option.get('available'));
		const userSettings = substate.get('userSettings').set('toggleOptions', filteredToggleOptions);
		return userSettings;
	}
);

// Below code is needed in selectActiveAudio if we decide to request all audio resources at once
// const audioObjects = substate.get('audioObjects');
// const activeChapter = substate.get('activeChapter');
// const activeBook = substate.get('activeBookId');
// const audioSource = audioObjects.filter((obj) => obj.get('bookId') === activeBook && obj.get('chapterStart') === activeChapter);
//
// return audioSource.getIn([0, 'path']);

// Most of function needed to determine which books are available for the selected text
// const selectAvailableBookNames = () => createSelector(
//   selectHomePageDomain,
//   (substate) => {
// 	const books = substate.get('books').filter((book) => bookNames[book.get('book_id')]);
// 	const bookList = books.map((book) => book.get('book_id'));
//
// 	return bookList;
// }
// );

/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () => createSelector(
  selectHomePageDomain,
  (substate) => substate.toJS()
);

export default makeSelectHomePage;
export {
  selectHomePageDomain,
  selectActiveBook,
	selectNextBook,
	selectPrevBook,
	selectSettings,
	selectFormattedSource,
};
