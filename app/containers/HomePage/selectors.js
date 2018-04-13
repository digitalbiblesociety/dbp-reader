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
const selectHomepageText = (state) => state.getIn(['homepage', 'chapterText']);
const selectProfilePageDomain = (state) => state.get('profile');
const selectFormattedTextSource = (state, props) => ({ source: state.getIn(['homepage', 'formattedSource']), props });
const selectCrossReferenceState = (state) => state.getIn(['homepage', 'userSettings', 'toggleOptions', 'crossReferences', 'active']);
const selectNotes = (state) => state.get('notes');

const selectUserNotes = () => createDeepEqualSelector(
	[selectNotes, selectHomePageDomain],
	(notes, home) => {
		const bibleId = home.get('activeTextId');
		const bookId = home.get('activeBookId');
		const chapter = home.get('activeChapter');
		// console.log(bibleId, bookId, chapter);
		// console.log(notes.get('listData'));
		return notes.get('listData').filter((n) => n.bible_id === bibleId && n.book_id === bookId && n.chapter === chapter);
	}
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
			const parser = new DOMParser();
			const serializer = new XMLSerializer();
			const xmlDoc = parser.parseFromString(source, 'text/xml');
			const verseClassName = `${bookId.toUpperCase()}${chapter}_${verse}`;
			// console.log('verseClassName', verseClassName);
			// console.log('xmlDoc', xmlDoc);
			const verseNumber = xmlDoc.getElementsByClassName(`verse${verse}`)[0];
			// console.log(verseNumber);
			const verseString = xmlDoc.getElementsByClassName(verseClassName)[0];
			// console.log('verse string', verseString);
			const newXML = xmlDoc.createElement('div');
			if (verseNumber && verseString) {
				newXML.appendChild(verseNumber);
				newXML.appendChild(verseString);
			}

			return { main: newXML ? serializer.serializeToString(newXML) : 'This book does not have a verse matching the url', footnotes: {} };
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
// TODO: May need to remove toJS if the application is showing signs of slowness
// I dont remember why I was doing this.......... ... .. ... ... -_-
const selectChapterText = () => createDeepEqualSelector(
	selectHomepageText,
	(text) => text.map((verse) => verse.set('verse_text', `${verse.get('verse_text')}`)).toJS()
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
	selectChapterText,
	selectUserNotes,
};
