import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
// import * as pages from 'utils/ENGKJV/list';
// import bookNames from 'utils/listOfBooksInBible';
/**
 * Direct selector to the homepage state domain
 * TODO: Fix selectors so that they don't receive objects because that negates the benefit of using memoized functions
 */
const selectHomePageDomain = (state) => state.get('homepage');
const selectProfilePageDomain = (state) => state.get('profile');
const selectFormattedTextSource = (state) => state.getIn(['homepage', 'formattedSource']);
const selectCrossReferenceState = (state) => state.getIn(['homepage', 'userSettings', 'toggleOptions', 'crossReferences', 'active']);

const selectUserId = () => createSelector(
	selectProfilePageDomain,
	(profile) => profile.get('userId')
);

const selectAuthenticationStatus = () => createSelector(
	selectProfilePageDomain,
	(profile) => profile.get('userAuthenticated')
);

const selectFormattedSource = () => createSelector(
	[selectFormattedTextSource, selectCrossReferenceState],
	(source, hasCrossReferences) => {
		// Pushing update with the formatted text working but not the footnotes
		// const source = substate.get('formattedSource');
		if (!source) {
			return { main: '', footnotes: {} };
		}
		const chapterStart = source.indexOf('<div class="chapter');
		const chapterEnd = source.indexOf('<div class="footnotes">', chapterStart);
		const footnotesStart = source.indexOf('<div class="footnotes">');
		const footnotesEnd = source.indexOf('<div class="footer">', footnotesStart);
		const main = source.slice(chapterStart, chapterEnd);

		if (!hasCrossReferences) {
			const mainWithoutCRs = main.replace(/<span class=['"]note['"](.*?)<\/span>/g, '');

			return { main: mainWithoutCRs, footnotes: {} };
		}

		const footnotes = source.slice(footnotesStart, footnotesEnd);
		const footnotesArray = footnotes.match(/<span class="ft">(.*?)<\/span>/g) || [];
		const crossReferenceArray = footnotes.match(/<span class="xt">(.*?)<\/span>/g) || [];
		const combinedArray = footnotesArray.concat(crossReferenceArray);
		const footnotesObject = Array.isArray(combinedArray) ? combinedArray.reduce((acc, note, i) => ({ ...acc, [`footnote-${i}`]: note.slice(17, -7) }), {}) : {};

		return { main, footnotes: footnotesObject };
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

		return books.filter((book) => book.get('book_id') === activeBookId).get(0);
	}
);

const selectNextBook = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');
		const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);

		return books.get(activeBookIndex + 1) || fromJS({});
	}
);

const selectPrevBook = () => createSelector(
		selectHomePageDomain,
		(substate) => {
			const books = substate.get('books');
			const activeBookId = substate.get('activeBookId');
			const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);

			return books.get(activeBookIndex - 1) || fromJS({});
		},
	);

const selectSettings = () => createSelector(
	selectHomePageDomain,
	(substate) => {
		const toggleOptions = substate.getIn(['userSettings', 'toggleOptions']);
		const filteredToggleOptions = toggleOptions.filter((option) => option.get('available'));

		return substate.get('userSettings').set('toggleOptions', filteredToggleOptions);
	}
);

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
	selectAuthenticationStatus,
	selectUserId,
};
