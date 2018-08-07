import { createSelectorCreator, defaultMemoize } from 'reselect';
import { is } from 'immutable';
// import * as pages from 'utils/ENGKJV/list';
// import bookNames from 'utils/listOfBooksInBible';

// TODO: If there seems to be some state missing check to make sure the equality check isn't failing
// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, is);

// Remove this function and selector once all of the highlights in the database have been converted
// const calcRgba = (hex) => {
// 	const r = parseInt(hex.slice(1, 2).repeat(2), 16);
// 	const g = parseInt(hex.slice(2, 3).repeat(2), 16);
// 	const b = parseInt(hex.slice(3, 4).repeat(2), 16);
//
// 	return `${r},${g},${b},0.25`;
// };

const selectHomePageDomain = (state) => state.get('homepage');
const selectHomepageText = (state) => state.getIn(['homepage', 'chapterText']);
const selectProfilePageDomain = (state) => state.get('profile');
const selectServerState = (state) => state.getIn(['homepage', 'isFromServer']);
const selectFormattedTextSource = (state) =>
	state.getIn(['homepage', 'formattedSource']);
const selectRouteParams = (state) =>
	state.getIn(['homepage', 'match', 'params']);
const selectCrossReferenceState = (state) =>
	state.getIn([
		'homepage',
		'userSettings',
		'toggleOptions',
		'crossReferences',
		'active',
	]);
const selectNotes = (state) => state.get('notes');

// const selectHighlights = () => createDeepEqualSelector(
// 	selectHomePageDomain,
// 	(home) => home.get('highlights').map((h) => {
// 		if (h.get('highlighted_color').length === 4) {
// 			return h.set('highlighted_color', calcRgba(h.get('highlighted_color')));
// 		}
// 		return h;
// 	}).toJS()
// );

const selectUserNotes = () =>
	createDeepEqualSelector(
		[selectNotes, selectHomePageDomain, selectProfilePageDomain],
		(notes, home, profile) => {
			// const bibleId = home.get('activeTextId');
			const bookId = home.get('activeBookId');
			const chapter = home.get('activeChapter');
			const text = home.get('chapterText');
			const authd = home.get('userAuthenticated');
			const userId = home.get('userId');
			const profAuth = profile.get('userAuthenticated');
			const profUser = profile.get('userId');
			// console.log(bookId);
			// console.log(chapter);
			// May not need to filter because I am requesting only the notes/bookmarks for this chapter
			const filteredNotes = notes
				.get('userNotes')
				.filter(
					(note) =>
						note.get('book_id') === bookId && note.get('chapter') === chapter,
				);
			const filteredBookmarks = notes
				.get('chapterBookmarks')
				.filter(
					(note) =>
						note.get('book_id') === bookId && note.get('chapter') === chapter,
				);
			const bookmarks = filteredBookmarks.toJS
				? filteredBookmarks.toJS()
				: filteredBookmarks;
			const userNotes = filteredNotes.toJS
				? filteredNotes.toJS()
				: filteredNotes;
			// console.log('filteredBookmarks', filteredBookmarks);
			// console.log('filteredNotes', filteredNotes);
			// console.log(home);
			if (
				!text ||
				(home.get('formattedSource') &&
					!home.getIn([
						'userSettings',
						'toggleOptions',
						'readersMode',
						'active',
					]) &&
					!home.getIn([
						'userSettings',
						'toggleOptions',
						'oneVersePerLine',
						'active',
					]))
			) {
				return {
					text: [],
					userNotes,
					bookmarks,
				};
			}
			// If the user isn't authorized then there will not be any notes or bookmarks and I can just end the function here
			if ((!authd && !userId) || (!profAuth && !profUser)) {
				// console.log('no user');
				return {
					text: text.toJS(),
					userNotes,
					bookmarks,
				};
			}
			// console.log('list data', notes.get('listData'));
			let newText = [];
			const versesWithNotes = {};

			filteredNotes.forEach((n, ni) => {
				let iToSet = 0;
				const verse = text.find((t, i) => {
					// console.log('t',t);
					// console.log('n',n);
					if (parseInt(t.get('verse_start'), 10) === n.get('verse_start')) {
						iToSet = i;
					}
					return parseInt(t.get('verse_start'), 10) === n.get('verse_start');
				});
				// console.log(verse);
				// console.log('note', n);
				// console.log(iToSet);
				if (verse) {
					// Need to change this since the notes will be allowed to be null
					// Eventually there will be two separate calls so I can have two piece of state
					if (n.get('notes') && !versesWithNotes[verse.get('verse_start')]) {
						newText = newText.size
							? newText.setIn([iToSet, 'hasNote'], true)
							: text.setIn([iToSet, 'hasNote'], true);
						newText = newText.size
							? newText.setIn([iToSet, 'noteIndex'], ni)
							: text.setIn([iToSet, 'noteIndex'], ni);
						// console.log(versesWithNotes);
						versesWithNotes[verse.get('verse_start')] = true;
					}
				}
			});
			filteredBookmarks.forEach((n, ni) => {
				// console.log('Top level for each for bookmarks');
				let iToSet = 0;
				// console.log('text,n', text,n);

				const verse = text.find((t, i) => {
					// console.log('t',t);
					// console.log('n',n);

					if (parseInt(t.get('verse_start'), 10) === n.get('verse_start')) {
						iToSet = i;
					}
					return parseInt(t.get('verse_start'), 10) === n.get('verse_start');
				});
				// console.log(iToSet);
				if (verse) {
					// console.log('bookmark verse', verse);
					newText = newText.size
						? newText.setIn([iToSet, 'hasBookmark'], true)
						: text.setIn([iToSet, 'hasBookmark'], true);
					newText = newText.size
						? newText.setIn([iToSet, 'bookmarkIndex'], ni)
						: text.setIn([iToSet, 'bookmarkIndex'], ni);
				}
			});
			// console.log('filteredBookmarks', filteredBookmarks);
			// console.log('filteredNotes', filteredNotes);

			// console.log(filteredNotes);
			// console.log('newText', newText);
			// console.log(text);
			return {
				text: newText.size ? newText.toJS() : text.toJS(),
				userNotes,
				bookmarks,
			};
		},
	);

const selectMenuOpenState = () =>
	createDeepEqualSelector(
		selectHomePageDomain,
		(home) =>
			home.get('isChapterSelectionActive') ||
			home.get('isProfileActive') ||
			home.get('isSettingsModalActive') ||
			home.get('isNotesModalActive') ||
			home.get('isSearchModalActive') ||
			home.get('isVersionSelectionActive'),
	);

const selectUserId = () =>
	createDeepEqualSelector(selectProfilePageDomain, (profile) =>
		profile.get('userId'),
	);

const selectAuthenticationStatus = () =>
	createDeepEqualSelector(selectProfilePageDomain, (profile) =>
		profile.get('userAuthenticated'),
	);
// TODO: Reduce the number of times the below function is called
// I will likely want to put all manipulations to the formatted text into this selector
const selectFormattedSource = () =>
	createDeepEqualSelector(
		[
			selectFormattedTextSource,
			selectCrossReferenceState,
			selectRouteParams,
			selectServerState,
		],
		(source, hasCrossReferences, params, isFromServer) => {
			// Todo: Get rid of all dom manipulation in this selector because it is really gross
			// Todo: run all of the parsing in this function once the source is obtained
			// Todo: Keep the selection of the single verse and the footnotes here
			// Pushing update with the formatted text working but not the footnotes
			// const source = substate.get('formattedSource');
			if (!source) {
				return { main: '', footnotes: {} };
			}
			const { verse, bookId, chapter } = params;

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
			// console.log('source matched in selector', source.match(/[\n\r]/g, ''));
			// Todo: Refactor to either not use DOMParser and XMLSerializer or don't load the formatted text in the source
			const sourceWithoutNewlines = source.replace(/[\n\r]/g, '');
			let footnotes = {};
			if (!isFromServer) {
				const parser = new DOMParser();
				const xmlDoc = parser.parseFromString(
					sourceWithoutNewlines,
					'text/xml',
				);
				footnotes = hasCrossReferences
					? [...xmlDoc.querySelectorAll('.ft, .xt')].reduce(
							(a, n) => ({
								...a,
								[n.parentElement.parentElement.attributes.id.value.slice(
									4,
								)]: n.textContent,
							}),
							{},
					  )
					: {};
				if (params.verse) {
					// const parser = new DOMParser();
					const serializer = new XMLSerializer();
					// const xmlDoc = parser.parseFromString(sourceWithoutNewlines, 'text/xml');
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

					return {
						main: newXML
							? serializer.serializeToString(newXML)
							: 'This chapter does not have a verse matching the url',
						footnotes,
					};
				}
			}

			const chapterStart = sourceWithoutNewlines.indexOf('<div class="chapter');
			const chapterEnd = sourceWithoutNewlines.indexOf(
				'<div class="footnotes">',
				chapterStart,
			);
			// const footnotesStart = sourceWithoutNewlines.indexOf('<div class="footnotes">');
			// const footnotesEnd = sourceWithoutNewlines.indexOf('<div class="footer">', footnotesStart);
			const main = sourceWithoutNewlines
				.slice(chapterStart, chapterEnd)
				.replace(/v-num v-[0-9]+">/g, '$&&#160;');
			// console.log(main);
			if (!hasCrossReferences) {
				const mainWithoutCRs = main.replace(
					/<span class=['"]note['"](.*?)<\/span>/g,
					'',
				);

				return { main: mainWithoutCRs, footnotes };
			}
			// const mappedNotes = footnotes.map((n) => {
			// 	console.log(n.parentElement.parentElement.attributes);
			// 	return ({ [n.parentElement.parentElement.attributes.id.value]: n.textContent });
			// });
			// console.log('footnotes', footnotes);
			return { main, footnotes };
		},
	);

/**
 * Other specific selectors
 */

const selectSettings = () =>
	createDeepEqualSelector(
		selectHomePageDomain,
		(substate) => substate.get('userSettings'),
		// {
		// 	const toggleOptions = substate.getIn(['userSettings', 'toggleOptions']);
		// 	const filteredToggleOptions = toggleOptions.filter((option) => option.get('available'));
		//
		// 	return substate.get('userSettings').set('toggleOptions', filteredToggleOptions);
		// }
	);
// TODO: May need to remove toJS if the application is showing signs of slowness
// I dont remember why I was doing this.......... ... .. ... ... -_-
const selectChapterText = () =>
	createDeepEqualSelector(selectHomepageText, (text) =>
		text
			.map((verse) => verse.set('verse_text', `${verse.get('verse_text')}`))
			.toJS(),
	);

/**
 * Default selector used by HomePage
 */

const makeSelectHomePage = () =>
	createDeepEqualSelector(selectHomePageDomain, (substate) => substate.toJS());

export default makeSelectHomePage;
export {
	selectHomePageDomain,
	// selectActiveBook,
	// selectNextBook,
	// selectPrevBook,
	selectSettings,
	selectFormattedSource,
	selectMenuOpenState,
	selectAuthenticationStatus,
	selectUserId,
	selectChapterText,
	selectUserNotes,
	// selectHighlights,
};
