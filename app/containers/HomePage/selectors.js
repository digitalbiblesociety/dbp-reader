import { createSelectorCreator, defaultMemoize } from 'reselect';
import { fromJS, is } from 'immutable';
// import * as pages from 'utils/ENGKJV/list';
// import bookNames from 'utils/listOfBooksInBible';

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
		// console.log('list data', notes.get('listData'));
		const bibleId = home.get('activeTextId');
		const bookId = home.get('activeBookId');
		const chapter = home.get('activeChapter');
		const text = home.get('chapterText');
		const filteredNotes = notes.get('listData').filter((n) => n.bible_id === bibleId && n.book_id === bookId && n.chapter === chapter);
		const bookmarks = filteredNotes.toJS ? filteredNotes.filter((n) => n.bookmark === 1).toJS() : filteredNotes.filter((n) => n.bookmark === 1);
		const userNotes = filteredNotes.toJS ? filteredNotes.filter((n) => n.bookmark === 0).toJS() : filteredNotes.filter((n) => n.bookmark === 0);
		let newText = [];

		filteredNotes.forEach((n, ni) => {
			let iToSet = 0;
			const verse = text.find((t, i) => {
				// console.log('t',t);
				// console.log('n',n);
				if (parseInt(t.get('verse_start'), 10) === n.verse_start) {
					iToSet = i;
				}
				return parseInt(t.get('verse_start'), 10) === n.verse_start;
			});
			// console.log(verse);
			// console.log(iToSet);
			if (verse) {
				if (n.bookmark) {
					newText = newText.size ? newText.setIn([iToSet, 'hasBookmark'], true) : text.setIn([iToSet, 'hasBookmark'], true);
					newText = newText.size ? newText.setIn([iToSet, 'bookmarkIndex'], ni) : text.setIn([iToSet, 'bookmarkIndex'], ni);
				}

				// Need to change this since the notes will be allowed to be null
				// Eventually there will be two separate calls so I can have two piece of state
				if (n.notes && n.notes !== '""' && n.notes !== '\'\'') {
					newText = newText.size ? newText.setIn([iToSet, 'hasNote'], true) : text.setIn([iToSet, 'hasNote'], true);
					newText = newText.size ? newText.setIn([iToSet, 'noteIndex'], ni) : text.setIn([iToSet, 'noteIndex'], ni);
				}
			}
		});
		// console.log(filteredNotes);
		// console.log(newText);
		return {
			text: newText.size ? newText.toJS() : text.toJS(),
			userNotes,
			bookmarks,
		};
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
// TODO: Reduce the number of times the below function is called
// I will likely want to put all manipulations to the formatted text into this selector
const selectFormattedSource = () => createDeepEqualSelector(
	[selectFormattedTextSource, selectCrossReferenceState],
	({ source, props }, hasCrossReferences) => {
		// Todo: Get rid of all dom manipulation in this selector because it is really gross
		// Pushing update with the formatted text working but not the footnotes
		// const source = substate.get('formattedSource');
		if (!source) {
			return { main: '', footnotes: {} };
		}
		const { verse, bookId, chapter } = props.match.params;

		// Getting the verse for when user selected 1 verse
			// start <span class="verse${verseNumber}
			// get span after data-id="${bookId}${chapter}_${verseNumber}"
			// end </span>
		// Check for user being auth'd
		// const userNotes = notes.get('listData');
		// console.log('get user notes', userNotes);
		// const userNotes = getUserNotes();
		// const withNotes = '';
		// console.log(userNotes);

		// If there were notes they then use withNotes otherwise use the original string
		// const updatedSource = withNotes || source;
		// console.log('Updated source: ', updatedSource);

		if (props.match.params.verse) {
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
	(substate) => substate.get('userSettings')
	// {
	// 	const toggleOptions = substate.getIn(['userSettings', 'toggleOptions']);
	// 	const filteredToggleOptions = toggleOptions.filter((option) => option.get('available'));
	//
	// 	return substate.get('userSettings').set('toggleOptions', filteredToggleOptions);
	// }
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
