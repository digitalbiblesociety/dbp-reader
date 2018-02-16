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
				this.openFootnote({ id: `footnote-${index}`, coords: { x: e.clientX, y: e.clientY } });
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
			text: plainT,
			userSettings,
			formattedSource,
		} = this.props;
		// Need to connect to the api and get the highlights object for this chapter
		const highlighted = true;
		// based on whether the highlights object has any data decide whether to run this function or not
		const text = highlighted ? this.highlightPlainText(plainT) : plainT;

		let textComponents;
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedText = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']);

		if (text.length === 0 && !formattedSource.main) {
			textComponents = (<h5>This resource does not currently have any text.</h5>);
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

		return textComponents;
	}

	handleMouseUp = (e) => {
		this.getLastVerse(e);
		if (e.button === 0 && this.state.footnoteState && e.target.className !== 'key') {
			this.closeFootnote();
		}
	}

	highlightPlainText = (plainText) => {
		// need to pass this function these values from the api
		// needs to run for each highlight object that the user has added
		const verseStart = 1;
		const highlightStart = 2;
		const highlightedWords = 40;
		let wordsLeftToHighlight = highlightedWords;

		const chapterText = plainText.map((v) => {
			const newVerse = [];
			const highlightedPortion = [];
			const plainPortion = [];
			const verseTextLength = v.verse_text.split(' ').length;
			const verseTextArray = v.verse_text.split(' ');

			if (v.verse_start === verseStart) {
				verseTextArray.forEach((word, index) => {
					if (index >= (highlightStart - 1)) {
						highlightedPortion.push(word);
					} else {
						plainPortion.push(word);
					}
				});

				wordsLeftToHighlight -= (verseTextLength - highlightStart);
				newVerse.push(plainPortion.join(' '));
				newVerse.push(' ');
				newVerse.push(<span className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
			} else if (wordsLeftToHighlight > 0 && v.verse_start > verseStart) {
				if (wordsLeftToHighlight - verseTextLength > 0) {
					newVerse.push(<span className={'text-highlighted'}>{v.verse_text}</span>);
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
					newVerse.push(<span className={'text-highlighted'}>{highlightedPortion.join(' ')}</span>);
					newVerse.push(' ');
					newVerse.push(plainPortion.join(' '));
				}
			}

			return { ...v, verse_text: newVerse.length ? newVerse : v.verse_text };
		});
		// console.log('chapter text in highlight function', chapterText);
		return chapterText;
	}

	addHighlight = () => {
		// needs to send an api request to the serve that adds a highlight for this passage
		if (this.state.selectedText && (this.main && !this.format)) {
			const spans = [...this.main.getElementsByTagName('span')];
			const firstWord = this.state.selectedText[0];
			const lastWord = this.state.selectedText[this.state.selectedText.length - 1];
			console.log('firstWord, lastWord', firstWord, lastWord);
			let firstVerse;
			let lastVerse;

			spans.forEach((span) => {
				const verseId = parseInt(span.attributes.verseid.value, 10);
				const firstVerseNumber = parseInt(this.state.firstVerse, 10);
				const lastVerseNumber = parseInt(this.state.lastVerse, 10);
				if (verseId === firstVerseNumber) {
					firstVerse = span;
				}
				if (verseId === lastVerseNumber) {
					lastVerse = span;
				}
				if (verseId >= firstVerseNumber && verseId <= lastVerseNumber) {
					span.classList.add('text-highlighted');
				}
			});
			console.log('firstVerse', firstVerse);
			console.log('lastVerse', lastVerse);
		}
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
		const x = e.clientX;
		const y = e.clientY;

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
		}, (res) => res); // console.log('response', res)); // eslint-disable-line no-console
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
			activeBookId,
			formattedSource,
			text,
			loadingNewChapterText,
		} = this.props;
		const {
			coords,
			contextMenuState,
			footnoteState,
			footnotePortal,
		} = this.state;

		if (loadingNewChapterText) {
			return <LoadingSpinner />;
		}
		return (
			<div className="text-container">
				{
					activeBookId === 'GEN' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main ref={this.setMainRef} onMouseDown={this.getFirstVerse} onMouseUp={this.handleMouseUp} className={formattedSource.main ? '' : 'chapter'}>
					{
						formattedSource.main || text.length === 0 ? null : (
							<h1 className="active-chapter-title">{activeChapter}</h1>
						)
					}
					{this.getTextComponents}
				</main>
				{
					activeBookId === 'REV' && activeChapter === 22 ? null : (
						<SvgWrapper onClick={nextChapter} className="next-arrow-svg" svgid="next-arrow" />
					)
				}
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
	userSettings: PropTypes.object,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	activeChapter: PropTypes.number,
	notesActive: PropTypes.bool,
	loadingNewChapterText: PropTypes.bool,
	formattedSource: PropTypes.object,
	setActiveNote: PropTypes.func,
	activeBookId: PropTypes.string,
	activeBookName: PropTypes.string,
	highlights: PropTypes.object,
};

export default Text;
