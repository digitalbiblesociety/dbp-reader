import { createSelectorCreator, defaultMemoize } from 'reselect';
import { fromJS, is } from 'immutable';
// import * as pages from 'utils/ENGKJV/list';
// import bookNames from 'utils/listOfBooksInBible';
/**
 * Direct selector to the homepage state domain
 * TODO: Fix selectors so that they don't receive objects because that negates the benefit of using memoized functions
 */

// TODO: If there seems to be some state missing check to make sure the equality check isn't failing
// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(
	defaultMemoize,
	is
);

const selectHomePageDomain = (state) => state.get('homepage');
const selectProfilePageDomain = (state) => state.get('profile');
const selectFormattedTextSource = (state, props) => ({ source: state.getIn(['homepage', 'formattedSource']), props });
const selectCrossReferenceState = (state) => state.getIn(['homepage', 'userSettings', 'toggleOptions', 'crossReferences', 'active']);
const getHighlights = (state) => state.getIn(['homepage', 'highlights']);
// This function assumes that I am getting the verses per chapter
// It will need to be updated if/when we enable infinite scrolling
const selectHighlights = () => createDeepEqualSelector(
	getHighlights,
	(highlights) => highlights // {
		// optimize later, naive solution first
		// let objectOfVerses;
		// let newHighlights;

		// try {
		// 	// Not keeping the ids of the highlights separate, may want to do this so that I can update the database and combine all of the highlights
		// 	objectOfVerses = highlights.reduce((a, c) => {
		// 		const currentVerseStart = c.verse_start;
		// 		if (a[currentVerseStart]) { // If the accumulated object already has this verse then do the following steps
		// 			return {
		// 				...a, // Keeps all the previous objects
		// 				[currentVerseStart]: { // Adds to the verse object for the current verse
		// 					...a[currentVerseStart], // Keeps all properties of the old verse
		// 					verse_start: [
		// 						...a[currentVerseStart].verse_start, // Spreads the previous version of the verse start array
		// 						currentVerseStart, // Adds the next verse start value to the array
		// 					],
		// 					highlight_start: [
		// 						...a[currentVerseStart].highlight_start,
		// 						c.highlight_start,
		// 					],
		// 					highlighted_words: [
		// 						...a[currentVerseStart].highlighted_words,
		// 						c.highlighted_words,
		// 					],
		// 				},
		// 			};
		// 		}
		// 		return {
		// 			...a,
		// 			[currentVerseStart]: {
		// 				...c,
		// 				verse_start: [
		// 					currentVerseStart,
		// 				],
		// 				highlight_start: [
		// 					c.highlight_start,
		// 				],
		// 				highlighted_words: [
		// 					c.highlighted_words,
		// 				],
		// 			},
		// 		};
		// 	}, {});
		// 	// console.log('reduced highlights', objectOfVerses);
		// } catch (err) {
		// 	if (process.env.NODE_ENV === 'development') {
		// 		console.warn('select highlights failed', err); // eslint-disable-line no-console
		// 	}
		// }

		// try {
		// 	console.log('New highlights', newHighlights);
		// 	// if there are any collisions between the start array and the
		// } catch (err) {
		// 	if (process.env.NODE_ENV === 'development') {
		// 		console.warn('select highlights failed', err); // eslint-disable-line no-console
		// 	}
		// }
		// const listReduced = highlights.reduce((highlightsMap, highlight) => {
		// 	// if the current highlight has the same start verse as another highlight
		// 	// do stuff
		// 	// otherwise just add the highlight to the map
		// 	console.log(highlightsMap.find((high) => high.verse_start === highlight.verse_start));
		//
		// 	if (highlightsMap.find((high) => high.verse_start === highlight.verse_start)) {
		// 		return highlightsMap.setIn([highlight.verse_start, ''])
		// 	}
		// }, fromJS({}));
		// return highlights;
	// }
);

const selectUserId = () => createDeepEqualSelector(
	selectProfilePageDomain,
	(profile) => profile.get('userId')
);

const selectAuthenticationStatus = () => createDeepEqualSelector(
	selectProfilePageDomain,
	(profile) => profile.get('userAuthenticated')
);

const selectFormattedSource = () => createDeepEqualSelector(
	[selectFormattedTextSource, selectCrossReferenceState],
	({ source, props }, hasCrossReferences) => {
		// Pushing update with the formatted text working but not the footnotes
		// const source = substate.get('formattedSource');
		if (!source) {
			return { main: '', footnotes: {} };
		}
		// Getting the verse for when user selected 1 verse
			// start <span class="verse${verseNumber}
			// get span after data-id="${bookId}${chapter}_${verseNumber}"
			// end </span>
		if (props.match.params.verse) {
			const { verse, bookId, chapter } = props.match.params;
			const start = source.indexOf(`<span class="verse${verse}`);
			const getAfter = source.indexOf(`data-id="${bookId}${chapter}_${verse}"`, start);
			const end = source.indexOf('</span>', getAfter);

			return { main: source.slice(start, end), footnotes: {} };
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
const selectActiveBook = () => createDeepEqualSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');

		return books.filter((book) => book.get('book_id') === activeBookId).get(0);
	}
);

const selectNextBook = () => createDeepEqualSelector(
	selectHomePageDomain,
	(substate) => {
		const books = substate.get('books');
		const activeBookId = substate.get('activeBookId');
		const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);

		return books.get(activeBookIndex + 1) || fromJS({});
	}
);

const selectPrevBook = () => createDeepEqualSelector(
		selectHomePageDomain,
		(substate) => {
			const books = substate.get('books');
			const activeBookId = substate.get('activeBookId');
			const activeBookIndex = books.findIndex((book) => book.get('book_id') === activeBookId);

			return books.get(activeBookIndex - 1) || fromJS({});
		},
	);

const selectSettings = () => createDeepEqualSelector(
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

const makeSelectHomePage = () => createDeepEqualSelector(
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
	selectHighlights,
};
