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
// import { addClickToNotes } from './htmlToReact';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// TODO: Need to consider removing the active text once the version is changed, this way a user has a clear indicator of when the new version has loaded
class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		contextMenuState: false,
		footnoteState: false,
		coords: {},
		selectedText: '',
		firstVerse: 0,
		lastVerse: 0,
		highlightActive: this.props.highlights || false,
	};

	componentDidMount() {
		if (this.format) {
			this.setEventHandlersForFootnotes();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.formattedSource.main !== this.props.formattedSource.main) {
			this.setState({ footnoteState: false });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.formattedSource.main && prevProps.formattedSource.main !== this.props.formattedSource.main && this.format) {
			this.setEventHandlersForFootnotes();
		}
	}

	setEventHandlersForFootnotes = () => {
		const notes = [...this.format.getElementsByClassName('note')];

		notes.forEach((note, index) => {
			/* eslint-disable no-param-reassign */
			// May need to change this and change the regex if we do infinite scrolling
			if (note.childNodes && note.childNodes[0]) {
				note.childNodes[0].removeAttribute('href');
			}

			note.onclick = (e) => {
				e.stopPropagation();
				const rightEdge = window.innerWidth - 300;
				const x = rightEdge < e.clientX ? rightEdge : e.clientX;

				this.openFootnote({ id: `footnote-${index}`, coords: { x, y: e.clientY } });
			};
		});
	}

	setFormattedRef = (el) => {
		this.format = el;
	}

	setMainRef = (el) => {
		this.main = el;
	}
	// Use selected text only when marking highlights
	setActiveNote = () => {
		const { firstVerse, lastVerse } = this.state;
		const { activeBookId, activeChapter } = this.props;
		const note = {
			verse_start: firstVerse,
			verse_end: lastVerse,
			book_id: activeBookId,
			chapter: activeChapter,
		};

		this.props.setActiveNote({ note });
	}

	getFirstVerse = (e) => {
		const target = e.target;

		if (e.button === 0 && this.main.contains(target) && target.attributes.verseid) {
			this.setState({ firstVerse: target.attributes.verseid.value });
		} else if (e.button === 0 && this.main.contains(target) && target.attributes['data-id']) {
			this.setState({ firstVerse: target.attributes['data-id'].value.split('_')[1] });
		}
	}

	getLastVerse = (e) => {
		if (e.button === 0 && window.getSelection().toString() && this.main.contains(e.target) && e.target.attributes.verseid) {
			// Needed to persist the React Synthetic event
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({ lastVerse: e.target.attributes.verseid.value, selectedText }, () => {
				this.openContextMenu(e);
			});
		} else if (e.button === 0 && window.getSelection().toString() && this.main.contains(e.target) && e.target.attributes['data-id']) {
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({ lastVerse: e.target.attributes['data-id'].value.split('_')[1], selectedText }, () => {
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
			formattedSource,
			highlights,
			activeChapter,
			verseNumber,
			invalidBibleId,
		} = this.props;
		// Need to connect to the api and get the highlights object for this chapter
		// based on whether the highlights object has any data decide whether to run this function or not
		let text = [];
		if (highlights.length) {
			text = highlights.reduce((highlightedText, highlight) => {
				if (highlight.chapter === activeChapter) {
					const { verse_start, highlight_start, highlighted_words } = highlight;
					// console.log('text passed to highlight', highlightedText);
					return this.highlightPlainText({ plainText: highlightedText, verseStart: verse_start, highlightStart: highlight_start, highlightedWords: highlighted_words });
				}
				return highlightedText;
			}, initialText);
		} else {
			text = initialText;
		}

		let textComponents;

		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedText = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']);
		// TODO: Should move each of these settings into their own HOC
		// Each HOC would take the source and update it based on if it was toggled
		// Each of the HOC could be wrapped in a formatTextBasedOnOptions function
		// the function would apply each of the HOCs in order
		if (text.length === 0 && !formattedSource.main) {
			if (invalidBibleId) {
				textComponents = [<h5 key={'no_text'}>You have entered an invalid bible id, please select a bible from the list or type a different id into the url.</h5>];
			} else {
				textComponents = [<h5 key={'no_text'}>This resource does not currently have any text.</h5>];
			}
		} else if (readersMode) {
			textComponents = text.map((verse) => (
				<span verseid={verse.verse_start} key={verse.verse_start}>{verse.verse_text}&nbsp;&nbsp;</span>
			));
		} else if (formattedSource.main) {
			// Need to run a function to highlight the formatted text if this option is selected
			/* eslint-disable react/no-danger */
			textComponents = (<div ref={this.setFormattedRef} className={'chapter'} dangerouslySetInnerHTML={{ __html: formattedSource.main }} />);
		} else if (oneVersePerLine) {
			textComponents = text.map((verse) => (
				<span verseid={verse.verse_start} key={verse.verse_start}><br />&nbsp;<sup verseid={verse.verse_start}>{verse.verse_start_alt || verse.verse_start}</sup>&nbsp;<br />{verse.verse_text}</span>
			));
		} else if (justifiedText) {
			textComponents = text.map((verse) => (
				<span verseid={verse.verse_start} key={verse.verse_start}>&nbsp;<sup verseid={verse.verse_start}>{verse.verse_start_alt || verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
			));
		} else {
			textComponents = text.map((verse) => (
				<span className={'align-left'} verseid={verse.verse_start} key={verse.verse_start}>&nbsp;<sup verseid={verse.verse_start}>{verse.verse_start_alt || verse.verse_start}</sup>&nbsp;{verse.verse_text}</span>
			));
		}

		if (!formattedSource.main && !readersMode && Array.isArray(textComponents) && textComponents[0].key !== 'no_text') {
			textComponents.unshift(<span key={'chapterNumber'} className={'drop-caps'}>{activeChapter}</span>);
		}
		// console.log('text components that are about to be mounted', textComponents);
		if (verseNumber && Array.isArray(textComponents)) {
			return textComponents.filter((c) => c.key === verseNumber);
		}

		return textComponents;
	}

	handleMouseUp = (e) => {
		this.getLastVerse(e);
		if (e.button === 0 && this.state.footnoteState && e.target.className !== 'key') {
			this.closeFootnote();
		}
	}
	// has an issue with highlights in the same verse
	// This is likely going to be really slow...
	highlightPlainText = ({ plainText, verseStart, highlightStart: originalHighlightStart, highlightedWords }) => {
		// console.log(`text array for verse ${verseStart} and highlight ${originalHighlightStart}`, plainText);
		// console.log('highlight verse start', verseStart);
		// console.log('highlight highlight start', originalHighlightStart);
		// console.log('highlight highlighted words', highlightedWords);
		// need to pass this function these values from the api
		// needs to run for each highlight object that the user has added
		let wordsLeftToHighlight = highlightedWords;
		// This has to be done because arrays have a 0 based index but the api is using a 1 based index
		const highlightStart = parseInt(originalHighlightStart, 10) - 1;
		// Add highlightedTextStart, highlightedTextEnd and highlightedText to each verse object
		// Each time a highlight is going to be applied check the following conditions
			// If v.verse_start === verseStart
			// Is the inclusive difference between highlightedTextEnd equal to the length of the verse
				// If it is then subtract the length from wordsLeftToHighlight and move on
			// If wordsLeftToHighlight is now 0 or < 0
				// End the function
			// Is the highlightStart before highlightedTextStart
				// If it is
		try {
			return plainText.map((v) => {
				const newVerse = [];
				// let highlightedTextEnd = v.highlightedTextEnd || null;
				// let highlightedTextStart = v.highlightedTextStart || null;
				// let highlightedText = v.highlightedText || [];
				const highlightedPortion = [];
				const plainPortion = [];
				// If the verse text is already an array that means there is already a highlight
				// Since there is already a highlight we need to do a different set of operations on the text
				// if (Array.isArray(v.verse_text)) {
					// console.log('verse already has a highlight from', v.highlightedTextStart, ' to ', highlightedTextEnd);
					// If v.verse_start === verseStart
					// Is the inclusive difference between highlightedTextEnd equal to the length of the verse
					// If it is then subtract the length from wordsLeftToHighlight and move on
					// If wordsLeftToHighlight is now 0 or < 0
					// End the function
					// Is the highlightStart before highlightedTextStart
				// }
				// The conditional is to prevent the code trying to split a verse after it has become an array
				// This is an issue because of a flaw in the program, I will need to stop iterating over each index
				const verseTextLength = (v.verse_text.split && v.verse_text.split(' ').length);
				const verseTextArray = (v.verse_text.split && v.verse_text.split(' '));
				// If the verse start of the current verse is the same as the starting verse of the highlight
				if (v.verse_start === verseStart) {
					const before = [];
					const after = [];
					// Iterates over each word in that verse's text
					verseTextArray.forEach((word, index) => {
						// if the index is past the start of the highlight
						// and the index minus the starting index is less than the total number of words to highlight
						if (index >= (highlightStart) && (index - highlightStart < wordsLeftToHighlight)) {
							highlightedPortion.push(word);
							// if the index is greater than the highlight start
							// and the index minus the starting index is great than the number of words to highlight
							// then the word must come after the end of the highlight
						} else if (index > (highlightStart) && index - highlightStart >= wordsLeftToHighlight) {
							after.push(word);
							// if the index is less than the starting index
						} else {
							// If the word wasn't in the range to be highlighted or after that range then it must come before it
							before.push(word);
						}
					});

					wordsLeftToHighlight -= (verseTextLength - highlightStart);
					newVerse.push(before.join(' '));
					newVerse.push(' ');
					// Join the highlighted words together inside a react element - might consider
					// doing the react part later on and just leaving the array as is
					// this would probably help with the issue of highlights overlapping
					newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
					newVerse.push(' ');
					newVerse.push(after.join(' '));
					// if there are still more words left to highlight after the first verse was finished
					// and this verse is past the highlights starting verse
				} else if (wordsLeftToHighlight > 0 && v.verse_start > verseStart) {
					if (wordsLeftToHighlight - verseTextLength > 0) {
						newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{v.verse_text}</span>);
						wordsLeftToHighlight -= verseTextLength;
					} else {
						verseTextArray.forEach((word, index) => {
							// may need to do <=
							if (index < (wordsLeftToHighlight)) {
								highlightedPortion.push(word);
							} else {
								plainPortion.push(word);
							}
						});
						wordsLeftToHighlight -= verseTextLength;
						newVerse.push(<span key={v.verse_start} verseid={v.verse_start} className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
						newVerse.push(' ');
						newVerse.push(plainPortion.join(' '));
					}
				}

				return { ...v, verse_text: newVerse.length ? newVerse : v.verse_text };
			});
		} catch (error) {
			if (process.env.NODE_ENV === 'development') {
				console.warn('Error in parsing highlights', error); // eslint-disable-line no-console
			}
			// If there was an error just return the text without highlights
			return plainText;
		}
	}

	addHighlight = () => {
		// needs to send an api request to the server that adds a highlight for this passage
		// Adds userId and bible in homepage container where action is dispatched
		// { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords }
		const firstVerse = parseInt(this.state.firstVerse, 10);
		const firstVerseObj = this.props.text.filter((v) => v.verse_start === firstVerse)[0];
		const highlightStart = firstVerseObj && firstVerseObj.verse_text.split && firstVerseObj.verse_text.split(' ').indexOf(this.state.selectedText.split(' ')[0]);

		this.props.addHighlight({
			book: this.props.activeBookId,
			chapter: this.props.activeChapter,
			verseStart: this.state.firstVerse,
			highlightStart,
			highlightedWords: this.state.selectedText.split(' ').length,
		});
		// take first word in selected text
		// find its index in the page of words
		// take verse id of the start and find the index of the first word within that verse
		this.closeContextMenu();
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
	}

	openFootnote = ({ id, coords }) => {
		this.setState({
			footnoteState: true,
			footnotePortal: {
				parentNode: this.format,
				message: this.props.formattedSource.footnotes[id],
				closeFootnote: this.closeFootnote,
				coords,
			},
		});
	}

	openContextMenu = (e) => {
		const rightEdge = window.innerWidth - 160;
		const bottomEdge = window.innerHeight - 136;
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
		} = this.props;
		const {
			coords,
			contextMenuState,
			footnoteState,
			footnotePortal,
		} = this.state;
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);

		if (loadingNewChapterText) {
			return <LoadingSpinner />;
		}
		return (
			<div className="text-container">
				<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
				<main ref={this.setMainRef} onMouseDown={this.getFirstVerse} onMouseUp={this.handleMouseUp} className={formattedSource.main && !readersMode ? '' : 'chapter'}>
					{
						(formattedSource.main || text.length === 0 || !readersMode) ? null : (
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
				<SvgWrapper onClick={nextChapter} className="next-arrow-svg" svgid="next-arrow" />
				{
					contextMenuState ? (
						<ContextPortal addHighlight={this.addHighlight} addFacebookLike={this.addFacebookLike} shareHighlightToFacebook={this.shareHighlightToFacebook} setActiveNote={this.setActiveNote} setActiveNotesView={setActiveNotesView} closeContextMenu={this.closeContextMenu} toggleNotesModal={toggleNotesModal} notesActive={notesActive} parentNode={this.main} coordinates={coords} />
					) : null
				}
				{
					footnoteState ? (
						<FootnotePortal {...footnotePortal} />
					) : null
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	highlights: PropTypes.array,
	userSettings: PropTypes.object,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	addHighlight: PropTypes.func,
	goToFullChapter: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	activeChapter: PropTypes.number,
	notesActive: PropTypes.bool,
	invalidBibleId: PropTypes.bool,
	loadingNewChapterText: PropTypes.bool,
	formattedSource: PropTypes.object,
	setActiveNote: PropTypes.func,
	verseNumber: PropTypes.string,
	activeBookId: PropTypes.string,
	activeBookName: PropTypes.string,
};

export default Text;
