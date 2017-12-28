import { createSelector } from 'reselect';
// import bookNames from 'utils/listOfBooksInBible';

/**
 * Direct selector to the homepage state domain
 */
const selectHomePageDomain = (state) => state.get('homepage');

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
};
