/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import ContextPortal from 'components/ContextPortal';
import FootnotePortal from 'components/FootnotePortal';
import LoadingSpinner from 'components/LoadingSpinner';
import IconsInText from 'components/IconsInText';
import PopupMessage from 'components/PopupMessage';
import {
	getFormattedParentVerseNumber,
	getPlainParentVerse,
	getFormattedParentVerse,
	getFormattedChildIndex,
	getFormattedElementVerseId,
} from 'utils/highlightingUtils';
// import differenceObject from 'utils/deepDifferenceObject';
import isEqual from 'lodash/isEqual';
// import some from 'lodash/some';
import createHighlights from './highlightPlainText';
import createFormattedHighlights from './highlightFormattedText';
import {
	applyNotes,
	applyBookmarks,
} from './formattedTextUtils';
// import { addClickToNotes } from './htmlToReact';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// Todo: Fix issue with this component being rendered so many times...
class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		contextMenuState: false,
		footnoteState: false,
		coords: {},
		selectedText: '',
		firstVerse: 0,
		lastVerse: 0,
		highlightActive: this.props.highlights || false,
		handlersAreSet: false,
	};

	componentDidMount() {
		// console.log('Component did mount with: ', this.format, ' and ', this.formatHighlight);
		if (this.format) {
			// console.log('setting event listeners on format');
			this.setEventHandlersForFootnotes(this.format);
			this.setEventHandlersForFormattedVerses(this.format);
		} else if (this.formatHighlight) {
			// console.log('setting event listeners on formatHighlight');
			this.setEventHandlersForFootnotes(this.formatHighlight);
			this.setEventHandlersForFormattedVerses(this.formatHighlight);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formattedSource.main !== this.props.formattedSource.main) {
			this.setState({ footnoteState: false });
		}
	}

	componentDidUpdate(prevProps) {
		// Todo: I think the issue with the page refresh is due to the initial values in redux
		// Todo: There is an issue with the event listeners being removed once a new note is added
		// console.log(this.format, this.formatHighlight);
		// if (Object.keys(differenceObject(this.state, prevState)).length || Object.keys(differenceObject(this.props, prevProps)).length) {
		// 	console.log('component did update props difference: \n', differenceObject(prevProps, this.props));
		// 	console.log('component did update state difference: \n', differenceObject(this.state, prevState));
		// }
		// Logic below ensures that the proper event handlers are set on each footnote
		if (this.props.formattedSource.main && prevProps.formattedSource.main !== this.props.formattedSource.main && (this.format || this.formatHighlight)) {
			if (this.format) {
				// console.log('setting event listeners on format first');
				this.setEventHandlersForFootnotes(this.format);
				this.setEventHandlersForFormattedVerses(this.format);
			} else if (this.formatHighlight) {
				// console.log('setting event listeners on formatHighlight first');
				this.setEventHandlersForFootnotes(this.formatHighlight);
				this.setEventHandlersForFormattedVerses(this.formatHighlight);
			}
		} else if (!isEqual(this.props.highlights, prevProps.highlights) && this.formatHighlight) {
			// console.log('setting event listeners on formatHighlight because highlights changed second');
			this.setEventHandlersForFootnotes(this.formatHighlight);
			this.setEventHandlersForFormattedVerses(this.formatHighlight);
		} else if (
			prevProps.userSettings.getIn(['toggleOptions', 'readersMode', 'active']) !== this.props.userSettings.getIn(['toggleOptions', 'readersMode', 'active']) &&
			!this.props.userSettings.getIn(['toggleOptions', 'readersMode', 'active']) &&
			(this.formatHighlight || this.format)
		) {
			// Need to set event handlers again here because they are removed once the plain text is rendered
			if (this.format) {
				// console.log('setting event listeners on format third');
				this.setEventHandlersForFootnotes(this.format);
				this.setEventHandlersForFormattedVerses(this.format);
			} else if (this.formatHighlight) {
				// console.log('setting event listeners on formatHighlight third');
				this.setEventHandlersForFootnotes(this.formatHighlight);
				this.setEventHandlersForFormattedVerses(this.formatHighlight);
			}
		}

		// This handles setting the events on a page refresh or navigation via url
		if (this.format && !this.state.handlersAreSet && !this.props.loadingNewChapterText) {
			// console.log('setting event listeners on format fourth');
			this.setEventHandlersForFootnotes(this.format);
			this.setEventHandlersForFormattedVerses(this.format);
			this.callSetStateNotInUpdate();
		} else if (this.formatHighlight && !this.state.handlersAreSet && !this.props.loadingNewChapterText) {
			// console.log('setting event listeners on formatHighlight fourth ');
			this.setEventHandlersForFootnotes(this.formatHighlight);
			this.setEventHandlersForFormattedVerses(this.formatHighlight);
			this.callSetStateNotInUpdate();
		}
	}

	setEventHandlersForFormattedVerses = (ref) => {
		try {
			const verses = [...ref.getElementsByClassName('v')];

			verses.forEach((verse) => {
				// console.log('setting events on this verse', verse);
				/* eslint-disable no-param-reassign, no-unused-expressions, jsx-a11y/no-static-element-interactions */
				verse.onmousedown = (e) => {
					e.stopPropagation();
					// console.log('mousedown event');
					this.getFirstVerse(e);
				};
				verse.onmouseup = (e) => {
					e.stopPropagation();
					// console.log('mouseup event');

					this.handleMouseUp(e);
				};
			});
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
			}
			// if Production then log error to service
		}

		try {
			const elements = [...ref.getElementsByClassName('bookmark-in-verse')];
			// It might not work 100% of the time to use i here, but I think it
			// will work most of the time
			elements.forEach((el, i) => {
				el.onclick = (e) => {
					e.stopPropagation();

					this.handleNoteClick(i, true);
				};
			});
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
			}
			// if Production then log error to service
		}

		try {
			const elements = [...ref.getElementsByClassName('note-in-verse')];

			// It might not work 100% of the time to use i here, but I think it
			// will work most of the time
			elements.forEach((el, i) => {
				el.onclick = (e) => {
					e.stopPropagation();

					this.handleNoteClick(i, true);
				};
			});
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.error('Error adding event handlers to formatted verses: ', err); // eslint-disable-line no-console
			}
			// if Production then log error to service
		}
	}

	setEventHandlersForFootnotes = (ref) => {
		const notes = [...ref.getElementsByClassName('note')];

		notes.forEach((note, index) => {
			// console.log('setting a click handler for: ', note);
			/* eslint-disable no-param-reassign */
			// May need to change this and change the regex if we do infinite scrolling
			if (note.childNodes && note.childNodes[0] && typeof note.childNodes[0].removeAttribute === 'function') {
				note.childNodes[0].removeAttribute('href');
			}

			note.onclick = (e) => {
				e.stopPropagation();
				// console.log('clicked note');
				const rightEdge = window.innerWidth - 300;
				const x = rightEdge < e.clientX ? rightEdge : e.clientX;

				this.openFootnote({ id: `footnote-${index}`, coords: { x, y: e.clientY } });
			};
		});
	}

	setFormattedRefHighlight = (el) => {
		this.formatHighlight = el;
	}

	setFormattedRef = (el) => {
		this.format = el;
	}

	setMainRef = (el) => {
		this.main = el;
	}
	// Use selected text only when marking highlights
	setActiveNote = ({ coords, existingNote, bookmark }) => {
		if (!this.props.userAuthenticated || !this.props.userId) {
			this.openPopup({ x: coords.x, y: coords.y });
			return;
		}
		const { firstVerse, lastVerse } = this.state;
		const { activeBookId, activeChapter } = this.props;
		const note = {
			verse_start: firstVerse,
			verse_end: lastVerse,
			book_id: activeBookId,
			chapter: activeChapter,
			bookmark: bookmark ? 1 : 0,
		};

		this.props.setActiveNote({ note: existingNote || note });
	}

	getFirstVerse = (e) => {
		e.stopPropagation();
		// console.log('getting first verse');
		const target = e.target;
		// const parent = e.target.parentElement;
		// console.log('Get first verse target', target);
		// console.log('Get first verse parent', parent);
		// console.log('Get first verse event', e);
		// console.log('Selection in first verse event', JSON.stringify(window.getSelection()));
		// Causes the component to update for every click
		// Thankfully React's diffing function is doing a good job and very little is actually re-rendered
		// console.log('e.target', e.target);
		// console.log('e.target.parent', e.target.parentElement);
		try {
			if (e.button === 0 && this.main.contains(target) && target.attributes.verseid) {
				this.setState({ firstVerse: target.attributes.verseid.value });
			} else if (e.button === 0 && this.main.contains(target) && target.attributes['data-id']) {
				this.setState({ firstVerse: target.attributes['data-id'].value.split('_')[1] });
			} else if (target.parentElement && target.parentElement.attributes.verseid) {
				this.setState({ firstVerse: target.parentElement.attributes.verseid.value });
			} else if (target.parentElement && target.parentElement.attributes['data-id']) {
				this.setState({ firstVerse: target.parentElement.attributes['data-id'].value.split('_')[1] });
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Error with getting last verse and opening menu', err); // eslint-disable-line no-console
			}
		}
	}

	getLastVerse = (e) => {
		const target = e.target;
		const parent = e.target.parentElement;
		// console.log('Get last verse target', target);
		// console.log('Get last verse parent', parent);
		// console.log('Get last verse event', e);
		// console.log('Selection in last verse event', window.getSelection());
		const primaryButton = e.button === 0;
		// console.log(window.getSelection());

		if (primaryButton && window.getSelection().toString() && this.main.contains(target) && target.attributes.verseid) {
			// Needed to persist the React Synthetic event
			typeof e.persist === 'function' && e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: target.attributes.verseid.value,
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
				anchorNode: window.getSelection().anchorNode,
				extentOffset: window.getSelection().extentOffset,
				extentText: window.getSelection().extentNode.data,
				extentNode: window.getSelection().extentNode,
				selectedText,
			}, () => {
				this.openContextMenu(e);
			});
		} else if (primaryButton && window.getSelection().toString() && this.main.contains(target) && target.attributes['data-id']) {
			typeof e.persist === 'function' && e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: target.attributes['data-id'].value.split('_')[1],
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
				anchorNode: window.getSelection().anchorNode,
				extentOffset: window.getSelection().extentOffset,
				extentText: window.getSelection().extentNode.data,
				extentNode: window.getSelection().extentNode,
				selectedText,
			}, () => {
				this.openContextMenu(e);
			});
			// Below checks for the parent elements since sometimes a word is wrapped in a tag for styling
		} else if (
				primaryButton &&
				window.getSelection().toString() &&
				parent &&
				this.main.contains(parent) &&
				parent.attributes.verseid
		) {
			typeof e.persist === 'function' && e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: parent.attributes.verseid.value,
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
				anchorNode: window.getSelection().anchorNode,
				extentOffset: window.getSelection().extentOffset,
				extentText: window.getSelection().extentNode.data,
				extentNode: window.getSelection().extentNode,
				selectedText,
			}, () => {
				this.openContextMenu(e);
			});
		} else if (
				primaryButton &&
				window.getSelection().toString() &&
				parent &&
				this.main.contains(parent) &&
				parent.attributes['data-id']
			) {
			typeof e.persist === 'function' && e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: parent.attributes['data-id'].value.split('_')[1],
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
				anchorNode: window.getSelection().anchorNode,
				extentOffset: window.getSelection().extentOffset,
				extentText: window.getSelection().extentNode.data,
				extentNode: window.getSelection().extentNode,
				selectedText,
			}, () => {
				this.openContextMenu(e);
			});
		} else {
			this.closeContextMenu();
		}
	}

	get getTextComponents() {
		const {
			text: initialText,
			userSettings,
			formattedSource: initialFormattedSource,
			highlights,
			activeChapter,
			verseNumber,
			userNotes,
			bookmarks,
			invalidBibleId,
		} = this.props;
		// Doing it like this may impact performance, but it is probably cleaner
		// than most other ways of doing it...
		const formattedSource = initialFormattedSource.main ? {
			...initialFormattedSource,
			main: [initialFormattedSource.main]
				.map((s) => applyNotes(s, userNotes, this.handleNoteClick))
				.map((s) => applyBookmarks(s, bookmarks, this.handleNoteClick))[0],
		} : initialFormattedSource;
		// console.log('new src', formattedSource);
		// console.log('diff', differenceObject(formattedSource, initialFormattedSource));
		// if (userNotes) {
		// 	// console.log('notes', userNotes);
		// 	// console.log('text', initialText);
		// 	// do something to display a svg
		// }
		// console.log(userNotes);
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedText = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']);
		// console.log(initialText);
		// todo figure out a way to memoize or cache the highlighted version of the text to improve performance
		// Need to connect to the api and get the highlights object for this chapter
		// based on whether the highlights object has any data decide whether to
		// run this function or not
		let plainText = [];
		let formattedText = [];

		if (highlights.length && (!oneVersePerLine && !readersMode && formattedSource.main)) {
			// Temporary fix for the fact that highlight_start is a string... ... ...
			const highlightsToPass = highlights.map((h) => ({ ...h, highlight_start: parseInt(h.highlight_start, 10) }));
			// Use function for highlighting the formatted formattedText
			formattedText = createFormattedHighlights(highlightsToPass, formattedSource.main);
		} else if (highlights.length && initialText.length) {
			// Temporary fix for the fact that highlight_start is a string... ... ...
			const highlightsToPass = highlights.map((h) => ({ ...h, highlight_start: parseInt(h.highlight_start, 10) }));
			// Use function for highlighting the plain plainText
			plainText = createHighlights(highlightsToPass, initialText);
		} else {
			plainText = initialText || [];
		}

		let textComponents;

		// Todo: Should handle each mode for formatted text and plain text in a separate component
		// Handle exception thrown when there isn't plain text but readers mode is selected
		/* eslint-disable react/no-danger */
		if (plainText.length === 0 && !formattedSource.main) {
			if (invalidBibleId) {
				textComponents = [<h5 key={'no_text'}>You have entered an invalid bible id, please select a bible from the list or type a different id into the url.</h5>];
			} else {
				textComponents = [<h5 key={'no_text'}>This resource does not currently have any text.</h5>];
			}
		} else if (readersMode) {
			textComponents = plainText.map((verse) =>
				verse.hasHighlight ?
					[<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />, <span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>&nbsp;</span>] :
					[<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>{verse.verse_text}</span>, <span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>&nbsp;</span>]
			);
		} else if (oneVersePerLine) {
			textComponents = plainText.map((verse) => (
				verse.hasHighlight ?
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<br /><IconsInText clickHandler={this.handleNoteClick} bookmarkData={{ hasBookmark: verse.hasBookmark, index: verse.bookmarkIndex }} noteData={{ hasNote: verse.hasNote, index: verse.noteIndex }} /><sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							<span verseid={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />
						</span>
					) :
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<br /><IconsInText clickHandler={this.handleNoteClick} bookmarkData={{ hasBookmark: verse.hasBookmark, index: verse.bookmarkIndex }} noteData={{ hasNote: verse.hasNote, index: verse.noteIndex }} /><sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							{verse.verse_text}
						</span>
					)
			));
		} else if (formattedSource.main) {
			// Need to run a function to highlight the formatted text if this option is selected
			if (!Array.isArray(formattedText)) {
				textComponents = (<div ref={this.setFormattedRefHighlight} className={justifiedText ? 'chapter justify' : 'chapter'} dangerouslySetInnerHTML={{ __html: formattedText }} />);
			} else {
				textComponents = (<div ref={this.setFormattedRef} className={justifiedText ? 'chapter justify' : 'chapter'} dangerouslySetInnerHTML={{ __html: formattedSource.main }} />);
			}
		} else {
			// console.log(text);
			textComponents = plainText.map((verse) => (
				verse.hasHighlight ?
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} className={'align-left'} verseid={verse.verse_start} key={verse.verse_start}>
							<IconsInText clickHandler={this.handleNoteClick} bookmarkData={{ hasBookmark: verse.hasBookmark, index: verse.bookmarkIndex }} noteData={{ hasNote: verse.hasNote, index: verse.noteIndex }} /><sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							<span verseid={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />
						</span>
					) :
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} className={'align-left'} verseid={verse.verse_start} key={verse.verse_start}>
							<IconsInText clickHandler={this.handleNoteClick} bookmarkData={{ hasBookmark: verse.hasBookmark, index: verse.bookmarkIndex }} noteData={{ hasNote: verse.hasNote, index: verse.noteIndex }} /><sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							{verse.verse_text}
						</span>
					)
			));
		}

		if (!formattedSource.main && !readersMode && Array.isArray(textComponents) && textComponents[0].key !== 'no_text') {
			textComponents.unshift(<span key={'chapterNumber'} className={'drop-caps'}>{activeChapter}</span>);
		}
		// console.log('text components that are about to be mounted', textComponents);
		if (verseNumber && Array.isArray(textComponents)) {
			return textComponents.filter((c) => c.key === (parseInt(verseNumber, 10) ? verseNumber : '1'));
		}

		return textComponents;
	}

	handleMouseUp = (e) => {
		e.stopPropagation();
		// console.log('handling mouseup');
		this.getLastVerse(e);
		if (e.button === 0 && this.state.footnoteState && e.target.className !== 'key') {
			this.closeFootnote();
		}
	}

	handleNoteClick = (noteIndex, clickedBookmark) => {
		const userNotes = this.props.userNotes;
		const existingNote = userNotes[noteIndex];
		// console.log('handling note click', noteIndex, clickedBookmark);

		if (!this.props.notesActive) {
			this.setActiveNote({ existingNote });
			if (clickedBookmark) {
				this.props.setActiveNotesView('bookmarks');
			} else {
				this.props.setActiveNotesView('edit');
			}
			this.closeContextMenu();
			this.props.toggleNotesModal();
		} else {
			this.setActiveNote({ existingNote });
			if (clickedBookmark) {
				this.props.setActiveNotesView('bookmarks');
			} else {
				this.props.setActiveNotesView('edit');
			}
			this.closeContextMenu();
		}
	}
	handleAddBookmark = () => {
		// console.log('Props available in bookmarks', this.props);
		// console.log('State available in bookmarks', this.state);
		const {
			activeBookId,
			userId,
			userAuthenticated,
			activeChapter,
			bibleId,
		} = this.props;
		const {
			firstVerse,
			lastVerse,
		} = this.state;
		// Need to make first verse and last verse integers for the < comparison
		const fv = parseInt(firstVerse, 10);
		const lv = parseInt(lastVerse, 10);
		// This takes into account RTL and LTR selections
		const verseStart = fv < lv ? fv : lv;
		const verseEnd = fv < lv ? lv : fv;

		// Only add the bookmark if there is a userId to add it too
		if (userAuthenticated && userId) {
			// console.log('Adding bookmark with: ', {
			// 	book_id: activeBookId,
			// 	chapter: activeChapter,
			// 	userId,
			// 	bible_id: bibleId,
			// 	notes: '',
			// 	title: '',
			// 	bookmark: 1,
			// 	verse_start: verseStart,
			// 	verse_end: verseEnd,
			// });
			this.props.addBookmark({
				book_id: activeBookId,
				chapter: activeChapter,
				user_id: userId,
				bible_id: bibleId,
				notes: '',
				title: '',
				bookmark: 1,
				verse_start: verseStart,
				verse_end: verseEnd,
			});
		}
	}

	callSetStateNotInUpdate = () => this.setState({ handlersAreSet: true })

	openPopup = (coords) => {
		this.setState({ popupOpen: true, popupCoords: coords });
		setTimeout(() => this.setState({ popupOpen: false }), 1500);
	}
	// has an issue with highlights in the same verse
	// This is likely going to be really slow...
	highlightPlainText = (props) => createHighlights(props)

	addHighlight = ({ color, popupCoords }) => {
		// User must be signed in for the highlight to be added
		if (!this.props.userAuthenticated || !this.props.userId) {
			this.openPopup({ x: popupCoords.x, y: popupCoords.y });
			return;
		}
		// needs to send an api request to the server that adds a highlight for this passage
		// Adds userId and bible in homepage container where action is dispatched
		// { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords }

		// Available data
			// text and node where highlight started,
			// text and node where highlight ended
			// verse number of highlight start
			// verse number of highlight end
			// text selected

		// formatted solution
			// get the dom node for the selection start
				// mark the index for selection start inside that dom node
			// go up the dom until I get the entire verse
			// This should accurately get the verse node no matter what node started on
		// split all the text nodes and join them into an array
		// find the index of the marked character
		// use that index as the highlight start
		// if the selected text starts at the end of the anchor node
		// else if the selected text starts at the end of the extent node
		try {
			// Globals*
			const first = parseInt(this.state.firstVerse, 10);
			const last = parseInt(this.state.lastVerse, 10);
			// Since a user can highlight "backwards" this makes sure the first verse is correct
			const firstVerse = (first < last ? first : last);
			const lastVerse = (last > first ? last : first);
			// console.log('first verse state', first);
			// console.log('last verse state', last);
			// console.log('first verse', firstVerse);
			// console.log('last verse', lastVerse);
			// Getting each offset to determine which is closest to the start of the passage
			const offset = this.state.anchorOffset;
			const extentOffset = this.state.extentOffset;
			const extentText = this.state.extentText;
			const aText = this.state.anchorText;
			const aNode = this.state.anchorNode;
			const eNode = this.state.extentNode;
			// console.log(offset)
			// console.log(extentOffset)
			// console.log(extentText)
			// console.log(aText)
			const selectedText = this.state.selectedText;
			// Setting my anchors with the data that is closest to the start of the passage
			let anchorOffset = offset < extentOffset ? offset : extentOffset;
			let anchorText = offset < extentOffset ? aText : extentText;
			// console.log('a text', anchorText);
			// console.log('a offset', anchorOffset);
			// console.log('first verse', firstVerse, 'last verse', lastVerse);
			// Todo: May need to also implement this for plain text...
			if (this.props.formattedSource.main) {
				if (aText !== extentText) {
					// if nodes are different
						// I have access to the parent node
					// if texts match
						// reverse order of anchor and extent
					// if texts dont match
						// find the parent of each that has a verse id
					const aParent = getFormattedParentVerse(aNode);
					const eParent = getFormattedParentVerse(eNode);
							// if the parents are different verses
					if (aParent.isSameNode(eParent)) {
						// It doesn't matter from this point which parent is used since they both reference the same object
						// take the offset that occurs first as a child of the verse
						// console.log('parent verse is the same for both elements');
						// console.log('child nodes for parent', aParent.childNodes);
						// console.log(aParent.childNodes[0].isSameNode(aNode));
						const aIndex = getFormattedChildIndex(aParent, aNode);
						const eIndex = getFormattedChildIndex(aParent, eNode);
						// console.log('a index', aIndex, 'e index', eIndex);

						// Use the text and offset of the node that was closest to the start of the verse
						if (aIndex < eIndex) {
							// console.log('aIndex is less than eIndex');
							anchorText = aText;
							anchorOffset = offset;
						} else {
							anchorText = extentText;
							anchorOffset = extentOffset;
						}
						// (could potentially use next/prev sibling for this)
					} else {
						// take the offset that matches the first(lowest) verse between the two
						// console.log('parent verse is not the same for both elements');
						const aVerseNumber = getFormattedElementVerseId(aParent);
						const eVerseNumber = getFormattedElementVerseId(eParent);

						// Use the text and offset of the first verse
						if (aVerseNumber < eVerseNumber) {
							// console.log('aVerseNumber is less than eVerseNumber');
							anchorText = aText;
							anchorOffset = offset;
						} else {
							anchorText = extentText;
							anchorOffset = extentOffset;
						}
					}
				}
				// console.log('atext', aText);
				// console.log('extentText', extentText);
				// console.log('this.state.selectedText', this.state.selectedText);
				// console.log('index of atext in else', selectedText.indexOf(aText));
				// console.log('index of extentText in else', selectedText.indexOf(extentText));
				// if () {
				// 	anchorOffset = offset;
				// 	anchorText = aText;
				// } else {
				// 	anchorOffset = extentOffset;
				// 	anchorText = extentText;
				// }
			}
			// Solve's for formatted text
			let node = offset < extentOffset ? aNode : eNode;
			let highlightStart = 0;
			// The parent with the id should never be more than 10 levels up MAX
			// I use this counter to prevent the edge case where an infinite loop
			// Could be caused, this keeps the browser from crashing on accident

			let highlightedWords = 0;
			const dist = this.calcDist(lastVerse, firstVerse, !!this.props.formattedSource.main);
			// Also need to check for class="v" to ensure that this was the first verse
			if (this.props.formattedSource.main && !this.props.userSettings.getIn(['toggleOptions', 'readersMode', 'active'])) {
				node = getFormattedParentVerseNumber(node, firstVerse);
				// At this point "node" is the first verse
				// console.log(node.textContent);
				// console.log(anchorOffset);
				// console.log(anchorText);
				// console.log(node.textContent.indexOf(anchorText));
				// Need to subtract by 1 since the anchor offset isn't 0 based
				highlightStart = (node.textContent.indexOf(anchorText) + anchorOffset);

				// I think this can stay the same as formatted, it could be made shorter potentially
				// need to remove all line breaks and note characters
				highlightedWords = selectedText.replace(/[\n*✝]/g, '').length - dist;
			} else {
				node = getPlainParentVerse(node, firstVerse);
				// taking off the first 2 spaces and the verse number from the string
				// This should only be the case for the first highlight within that verse
				// todo First highlight is fine
					// Second if before the first is off by 1
					// Second if after the first is off by verse number + 2
					// Third if between is off by verse number + 2
				const newText = node.textContent.slice(firstVerse.toFixed(0).length + 2);

				// console.log('plain text node.textContent', node.textContent);
				// console.log('plain text anchorOffset', anchorOffset);
				// console.log('plain text anchorText', anchorText);
				// console.log('plain text node.textContent.indexOf(anchorText)', node.textContent.indexOf(anchorText));
				// console.log('plain text newText.indexOf(anchorText)', newText.indexOf(anchorText));
				// console.log('plain text node.textContent.slice(firstVerse.toFixed(0).length + 2)', node.textContent.slice(firstVerse.toFixed(0).length + 2));

				if (this.props.userSettings.getIn(['toggleOptions', 'readersMode', 'active'])) {
					highlightStart = (node.textContent.indexOf(anchorText) + anchorOffset);
					highlightedWords = selectedText.replace(/\n/g, '').length;
				} else {
					highlightStart = (newText.indexOf(anchorText) + anchorOffset);
					highlightedWords = selectedText.replace(/\n/g, '').length - dist;
				}
			}
			// console.log('whole verse node text content', node.textContent);
			// console.log('calc', node.textContent.indexOf(anchorText) + anchorOffset);
			// plain text 乁(✿ ͡° ͜ʖ ͡°)و
			// console.log('dist', dist);
			// console.log('length of text without n', this.state.selectedText.replace(/\n/g, '').length);
			// console.log('length of text with n and no split', this.state.selectedText.length);
			// console.log('length of text with n and a split', this.state.selectedText.split('').length);
			// console.log('calc highlighted words', highlightedWords);
			// console.log('window selection length', this.state.selectedText.split('').length);
			if (this.props.userId && this.props.userAuthenticated) {
				// console.log('highlight being added - not sending to db atm', {
				// 	book: this.props.activeBookId,
				// 	chapter: this.props.activeChapter,
				// 	verseStart: firstVerse,
				// 	color,
				// 	highlightStart,
				// 	highlightedWords,
				// });
				this.props.addHighlight({
					book: this.props.activeBookId,
					chapter: this.props.activeChapter,
					verseStart: firstVerse,
					color,
					highlightStart,
					highlightedWords,
				});
			}
		} catch (err) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Error adding highlight', err); // eslint-disable-line no-console
			}
			// dispatch action to log error and also show an error message
			this.closeContextMenu();
		}

		this.closeContextMenu();
	}
	// Because the system captures the verse numbers this needs to be used
	calcDist = (l, f, p) => {
		if (l === f) return 0;
		let stringDiff = '';

		for (let i = f + 1; i <= l; i += 1) {
			// Adds the length of each verse number
			stringDiff += i.toFixed(0);
			// Adds 1 character for formatted and 2 for plain text to account for spaces in verse numbers
			stringDiff += p ? '1' : '11';
			// console.log(i);
		}
		// console.log('string diff', stringDiff);
		return stringDiff.length;
		// return l - f;
	}

	addFacebookLike = () => {
	// 	console.log('testing adding a like');
		const fb = window.FB;
	// 	fb.ui({
	// 		method: 'share_open_graph',
	// 		action_type: 'og.likes',
	// 		action_properties: JSON.stringify({
	// 			object: 'http://is.bible.build/',
	// 		}),
	// 	}, (res) => console.log('like res', res));

		fb.api(`${process.env.FB_APP_ID}?metadata=1`, {
			access_token: process.env.FB_ACCESS,
		}, (res) => res); // console.log('bible is object res', res));
		this.closeContextMenu();
	}

	openFootnote = ({ id, coords }) => {
		this.setState({
			footnoteState: true,
			footnotePortal: {
				message: this.props.formattedSource.footnotes[id],
				closeFootnote: this.closeFootnote,
				coords,
			},
		});
	}

	openContextMenu = (e) => {
		const rightEdge = window.innerWidth - 250;
		const bottomEdge = window.innerHeight - 297;
		const x = rightEdge < e.clientX ? rightEdge : e.clientX;
		const y = bottomEdge < e.clientY ? bottomEdge : e.clientY;

		this.setState({
			coords: { x, y },
			contextMenuState: true,
		});
	}

	closeFootnote = () => this.setState({ footnoteState: false })

	closeContextMenu = () => this.setState({ contextMenuState: false })

	shareHighlightToFacebook = () => {
		const FB = window.FB;
		const { activeBookName: book, activeChapter: chapter } = this.props;
		const {
			firstVerse: v1,
			lastVerse: v2,
			selectedText: sl,
		} = this.state;
		const verseRange = v1 === v2 ? `${book} ${chapter}:${v1}\n${sl}` : `${book} ${chapter}:${v1}-${v2}\n"${sl}"`;

		FB.ui({
			method: 'share',
			quote: verseRange,
			href: 'http://is.bible.build/',
		}, (res) => res);
		this.closeContextMenu();
	}

	render() {
		const {
			nextChapter,
			prevChapter,
			activeChapter,
			toggleNotesModal,
			notesActive,
			setActiveNotesView,
			formattedSource,
			text,
			loadingNewChapterText,
			userSettings,
			verseNumber,
			goToFullChapter,
			toggleInformationModal,
			informationActive,
		} = this.props;
		const {
			coords,
			contextMenuState,
			footnoteState,
			footnotePortal,
		} = this.state;
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedClass = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']) ? 'justify' : '';

		if (loadingNewChapterText) {
			return <LoadingSpinner />;
		}

		return (
			<div className="text-container">
				<SvgWrapper className={'icon info-button'} svgid={'info'} onClick={() => !informationActive && toggleInformationModal()} />
				<div onClick={prevChapter} className={'arrow-wrapper'}>
					<SvgWrapper className="prev-arrow-svg" svgid="arrow_left" />
				</div>
				<main ref={this.setMainRef} className={formattedSource.main && !readersMode && !oneVersePerLine ? '' : `chapter ${justifiedClass}`}>
					{
						((formattedSource.main && !readersMode && !oneVersePerLine) || text.length === 0 || (!readersMode && !oneVersePerLine)) ? null : (
							<h1 className="active-chapter-title">{activeChapter}</h1>
						)
					}
					{this.getTextComponents}
					{
						verseNumber ? (
							<div className={'read-chapter-container'}>
								<button onClick={goToFullChapter} className={'read-chapter'}>Read Full Chapter</button>
							</div>
						) : null
					}
				</main>
				<div onClick={nextChapter} className={'arrow-wrapper'}>
					<SvgWrapper className="next-arrow-svg" svgid="arrow_right" />
				</div>
				{
					contextMenuState ? (
						<ContextPortal handleAddBookmark={this.handleAddBookmark} addHighlight={this.addHighlight} addFacebookLike={this.addFacebookLike} shareHighlightToFacebook={this.shareHighlightToFacebook} setActiveNote={this.setActiveNote} setActiveNotesView={setActiveNotesView} closeContextMenu={this.closeContextMenu} toggleNotesModal={toggleNotesModal} notesActive={notesActive} parentNode={this.main} coordinates={coords} />
					) : null
				}
				{
					footnoteState ? (
						<FootnotePortal {...footnotePortal} />
					) : null
				}
				{
					this.state.popupOpen ? <PopupMessage message={'You must be signed in to use this feature'} x={this.state.popupCoords.x} y={this.state.popupCoords.y} /> : null
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	userNotes: PropTypes.array,
	bookmarks: PropTypes.array,
	highlights: PropTypes.array,
	userSettings: PropTypes.object,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	addBookmark: PropTypes.func,
	addHighlight: PropTypes.func,
	goToFullChapter: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	toggleInformationModal: PropTypes.func,
	activeChapter: PropTypes.number,
	notesActive: PropTypes.bool,
	invalidBibleId: PropTypes.bool,
	informationActive: PropTypes.bool,
	userAuthenticated: PropTypes.bool,
	loadingNewChapterText: PropTypes.bool,
	formattedSource: PropTypes.object,
	setActiveNote: PropTypes.func,
	userId: PropTypes.string,
	bibleId: PropTypes.string,
	verseNumber: PropTypes.string,
	activeBookId: PropTypes.string,
	activeBookName: PropTypes.string,
};

export default Text;
