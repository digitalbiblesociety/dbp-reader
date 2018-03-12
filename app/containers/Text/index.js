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
import createHighlights from './highlightTextFunction';
// import { addClickToNotes } from './htmlToReact';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
		const primaryButton = e.button === 0;
		console.log(window.getSelection());

		if (primaryButton && window.getSelection().toString() && this.main.contains(target) && target.attributes.verseid) {
			// Needed to persist the React Synthetic event
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: target.attributes.verseid.value,
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
				selectedText,
			}, () => {
				this.openContextMenu(e);
			});
		} else if (primaryButton && window.getSelection().toString() && this.main.contains(target) && target.attributes['data-id']) {
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: target.attributes['data-id'].value.split('_')[1],
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
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
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: parent.attributes.verseid.value,
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
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
			e.persist();
			const selectedText = window.getSelection().toString();

			this.setState({
				lastVerse: parent.attributes['data-id'].value.split('_')[1],
				anchorOffset: window.getSelection().anchorOffset,
				anchorText: window.getSelection().anchorNode.data,
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
			formattedSource,
			highlights,
			activeChapter,
			verseNumber,
			invalidBibleId,
		} = this.props;
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedText = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']);
		// console.log(initialText);
		// Need to connect to the api and get the highlights object for this chapter
		// based on whether the highlights object has any data decide whether to run this function or not
		let text = [];
		if (highlights.length && (initialText.length || formattedSource.main)) {
			text = highlights.reduce((highlightedText, highlight) => {
				if (highlight.chapter === activeChapter) {
					const { verse_start, highlight_start, highlighted_words } = highlight;
					// console.log('text passed to highlight', highlightedText);
					return this.highlightPlainText({
						readersMode,
						formattedText: highlightedText,
						plainText: highlightedText,
						verseStart: verse_start,
						highlightStart: highlight_start,
						highlightedWords: highlighted_words,
					});
				}
				return highlightedText;
			}, formattedSource.main || initialText);
			// console.log('text got set to', text);
			// if (!text.main && !text.length) {
			// 	text = [];
			// }
		} else {
			text = initialText || [];
		}

		let textComponents;

		// TODO: Should move each of these settings into their own HOC
		// Each HOC would take the source and update it based on if it was toggled
		// Each of the HOC could be wrapped in a formatTextBasedOnOptions function
		// the function would apply each of the HOCs in order

		// TODO: Handle exception thrown when there isn't plain text but readers mode is selected
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
			if (!Array.isArray(text)) {
				textComponents = (<div ref={this.setFormattedRef} className={'chapter'} dangerouslySetInnerHTML={{ __html: text }} />);
			} else {
				textComponents = (<div ref={this.setFormattedRef} className={'chapter'} dangerouslySetInnerHTML={{ __html: formattedSource.main }} />);
			}
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
	highlightPlainText = (props) => createHighlights(props)

	addHighlight = () => {
		// needs to send an api request to the server that adds a highlight for this passage
		// Adds userId and bible in homepage container where action is dispatched
		// { bible, book, chapter, userId, verseStart, highlightStart, highlightedWords }
		const firstVerse = parseInt(this.state.firstVerse, 10);
		const firstVerseObj = this.props.text.filter((v) => v.verse_start === firstVerse)[0];
		const anchorOffset = this.state.anchorOffset;
		let anchorText = this.state.anchorText;
		let anchorTextIndex = firstVerseObj.verse_text.indexOf(anchorText);

		while (anchorTextIndex === -1 && anchorText.length) {
			anchorText = anchorText.slice(0, -2);
			anchorTextIndex = firstVerseObj.verse_text.indexOf(anchorText);
		}

		const searchStartIndex = anchorTextIndex + anchorOffset;
		// console.log('anchor text index in verse', anchorTextIndex);
		// console.log('verse text', firstVerseObj.verse_text);
		// console.log('selected text', this.state.selectedText);
		// console.log('anchor text', anchorText);
		// console.log('anchor offset', anchorOffset);
		// console.log('search start', searchStartIndex);
		// Need to figure out a way to get the index of the first letter
		const highlightStart = firstVerseObj && (
			firstVerseObj.verse_text.indexOf(this.state.selectedText, searchStartIndex) !== -1 ?
			firstVerseObj.verse_text.indexOf(this.state.selectedText, searchStartIndex) :
			firstVerseObj.verse_text.indexOf(this.state.selectedText.split(' ')[0], searchStartIndex));
		// const highlightStart = firstVerseObj && firstVerseObj.verse_text.split && firstVerseObj.verse_text.split(' ').indexOf(this.state.selectedText.split(' ')[0]);
		// console.log('highlight letter start', firstVerseObj.verse_text.indexOf(this.state.selectedText));
		console.log('highlight word start', highlightStart);

		this.props.addHighlight({
			book: this.props.activeBookId,
			chapter: this.props.activeChapter,
			verseStart: this.state.firstVerse,
			highlightStart,
			highlightedWords: this.state.selectedText.split('').length,
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
