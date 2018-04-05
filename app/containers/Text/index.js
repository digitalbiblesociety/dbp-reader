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
// import differenceObject from 'utils/deepDifferenceObject';
import isEqual from 'lodash/isEqual';
import createHighlights from './highlightPlainText';
import createFormattedHighlights from './highlightFormattedText';
// import { addClickToNotes } from './htmlToReact';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// todo handle cases where user starts on the chapter number or the section headers
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
			// console.log('setting event listeners on format');
			this.setEventHandlersForFootnotes(this.format);
			this.setEventHandlersForFormattedVerses(this.format);
		} else if (this.formatHighlight) {
			// console.log('setting event listeners on formatHighlight')
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
		// console.log('component did update');
		if (this.props.formattedSource.main && prevProps.formattedSource.main !== this.props.formattedSource.main && this.format) {
			// console.log('setting event listeners on format');
			this.setEventHandlersForFootnotes(this.format);
			this.setEventHandlersForFormattedVerses(this.format);
		} else if (this.props.formattedSource.main && prevProps.formattedSource.main !== this.props.formattedSource.main && this.formatHighlight) {
			// console.log('setting event listeners on formatHighlight')
			this.setEventHandlersForFootnotes(this.formatHighlight);
			this.setEventHandlersForFormattedVerses(this.formatHighlight);
		} else if (!isEqual(this.props.highlights, prevProps.highlights) && this.formatHighlight) {
			// console.log('setting event listeners on formatHighlight because highlights changed');
			this.setEventHandlersForFootnotes(this.formatHighlight);
			this.setEventHandlersForFormattedVerses(this.formatHighlight);
		}
		// console.log('Difference between old state and new state', differenceObject(this.state, prevState));
	}

	setEventHandlersForFormattedVerses = (ref) => {
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
	}

	setEventHandlersForFootnotes = (ref) => {
		const notes = [...ref.getElementsByClassName('note')];

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
		// console.log(initialText);fasdfas
		// todo figure out a way to memoize or cache the highlighted version of the text to improve performance
		// Need to connect to the api and get the highlights object for this chapter
		// based on whether the highlights object has any data decide whether to run this function or not
		let text = [];
		if (highlights.length && (!readersMode && formattedSource.main)) {
			// Temporary fix for the fact that highlight_start is a string... ... ...
			const highlightsToPass = highlights.map((h) => ({ ...h, highlight_start: parseInt(h.highlight_start, 10) }));
			// Use function for highlighting the formatted text
			text = createFormattedHighlights(highlightsToPass, formattedSource.main);
		} else if (highlights.length && initialText.length) {
			// Temporary fix for the fact that highlight_start is a string... ... ...
			const highlightsToPass = highlights.map((h) => ({ ...h, highlight_start: parseInt(h.highlight_start, 10) }));
			// Use function for highlighting the plain text
			text = createHighlights(highlightsToPass, initialText);
		} else {
			text = initialText || [];
		}

		let textComponents;

		// TODO: Should move each of these settings into their own HOC
		// Each HOC would take the source and update it based on if it was toggled
		// Each of the HOC could be wrapped in a formatTextBasedOnOptions function
		// the function would apply each of the HOCs in order

		// TODO: Handle exception thrown when there isn't plain text but readers mode is selected
		/* eslint-disable react/no-danger */
		if (text.length === 0 && !formattedSource.main) {
			if (invalidBibleId) {
				textComponents = [<h5 key={'no_text'}>You have entered an invalid bible id, please select a bible from the list or type a different id into the url.</h5>];
			} else {
				textComponents = [<h5 key={'no_text'}>This resource does not currently have any text.</h5>];
			}
		} else if (readersMode) {
			// console.log('text', text);
			textComponents = text.map((verse) =>
				verse.hasHighlight ?
					[<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />, <span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>&nbsp;</span>] :
					[<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>{verse.verse_text}</span>, <span key={`${verse.verse_end}spaces`} className={'readers-spaces'}>&nbsp;</span>]
			);
		} else if (formattedSource.main) {
			// Need to run a function to highlight the formatted text if this option is selected
			if (!Array.isArray(text)) {
				textComponents = (<div ref={this.setFormattedRefHighlight} className={'chapter'} dangerouslySetInnerHTML={{ __html: text }} />);
			} else {
				textComponents = (<div ref={this.setFormattedRef} className={'chapter'} dangerouslySetInnerHTML={{ __html: formattedSource.main }} />);
			}
		} else if (oneVersePerLine) {
			textComponents = text.map((verse) => (
				verse.hasHighlight ?
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<br /><sup verseid={verse.verse_start}>
								{verse.verse_start_alt || verse.verse_start}
							</sup><br />
							<span verseid={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />
						</span>
					) :
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<br /><sup verseid={verse.verse_start}>
								{verse.verse_start_alt || verse.verse_start}
							</sup><br />
							{verse.verse_text}
						</span>
					)
			));
		} else if (justifiedText) {
			textComponents = text.map((verse) => (
				verse.hasHighlight ?
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							<span verseid={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />
						</span>
					) :
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} verseid={verse.verse_start} key={verse.verse_start}>
							<sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							{verse.verse_text}
						</span>
					)
			));
		} else {
			textComponents = text.map((verse) => (
				verse.hasHighlight ?
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} className={'align-left'} verseid={verse.verse_start} key={verse.verse_start}>
							<sup verseid={verse.verse_start}>
								&nbsp;{verse.verse_start_alt || verse.verse_start}&nbsp;
							</sup>
							<span verseid={verse.verse_start} dangerouslySetInnerHTML={{ __html: verse.verse_text }} />
						</span>
					) :
					(
						<span onMouseUp={this.handleMouseUp} onMouseDown={this.getFirstVerse} className={'align-left'} verseid={verse.verse_start} key={verse.verse_start}>
							<sup verseid={verse.verse_start}>
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
	// has an issue with highlights in the same verse
	// This is likely going to be really slow...
	highlightPlainText = (props) => createHighlights(props)

	addHighlight = (color) => {
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
		try {
			// Globals*
			const firstVerse = parseInt(this.state.firstVerse, 10);
			const lastVerse = parseInt(this.state.lastVerse, 10);
			const anchorOffset = this.state.anchorOffset;
			const anchorText = this.state.anchorText;
			// console.log('a text', anchorText);
			// console.log('a offset', anchorOffset);
			// console.log('first verse', firstVerse, 'last verse', lastVerse);
			// Solve's for formatted text
			let node = this.state.anchorNode;
			let highlightStart = 0;
			// The parent with the id should never be more than 10 levels up
			// I use this counter to prevent the edge case where an infinite loop
			// Could be caused, this keeps the browser from crashing on accident
			let counter = 0;
			// Also need to check for class="v" to ensure that this was the first verse
			if (this.props.formattedSource.main && !this.props.userSettings.getIn(['toggleOptions', 'readersMode', 'active'])) {
				while (!(node.attributes && node.attributes['data-id'] && node.attributes['data-id'].value.split('_')[1] !== firstVerse)) {
					node = node.parentNode;
					if (counter >= 10) break;
					counter += 1;
					// console.log('condition to be checked', !(node.attributes && node.attributes['data-id'] && node.attributes['data-id'].value.split('_')[1] !== firstVerse));
				}
				// Need to subtract by 1 since the anchor offset isn't 0 based
				highlightStart = (node.textContent.indexOf(anchorText) + anchorOffset);
			} else {
				while (!(node.attributes && node.attributes.verseid && node.attributes.verseid.value !== firstVerse)) {
					// console.log('node', node);
					node = node.parentNode;
					if (counter >= 10) break;
					counter += 1;
				}
				// Need to subtract by one for the plain text
				highlightStart = (node.textContent.indexOf(anchorText) + anchorOffset);
			}
			// console.log('whole verse node text content', node.textContent);
			// console.log('calc', node.textContent.indexOf(anchorText) + anchorOffset);
			// plain text
			// I think this can stay the same as formatted, it could be made shorter potentially
			const dist = this.calcDist(lastVerse, firstVerse);
			// console.log('dist', dist);
			const highlightedWords = this.state.selectedText.replace(/\n/g, '').length - dist;
			// console.log('length of text without n', this.state.selectedText.replace(/\n/g, '').length);
			// console.log('length of text with n and no split', this.state.selectedText.length);
			// console.log('length of text with n and a split', this.state.selectedText.split('').length);
			// console.log('calc highlighted words', highlightedWords);
			// console.log('window selection length', this.state.selectedText.split('').length);
			if (this.props.userId && this.props.userAuthenticated) {
				// console.log('highlight being added - not sending to db atm', {
				// 	book: this.props.activeBookId,
				// 	chapter: this.props.activeChapter,
				// 	verseStart: this.state.firstVerse,
				// 	color,
				// 	highlightStart,
				// 	highlightedWords,
				// });
				this.props.addHighlight({
					book: this.props.activeBookId,
					chapter: this.props.activeChapter,
					verseStart: this.state.firstVerse,
					color,
					highlightStart,
					highlightedWords,
				});
			} else {
				// TODO Add a message bubble for the user so they know they need to log in
				// alert('Please create an account!!! 乁(✿ ͡° ͜ʖ ͡°)و');
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
	// Because the systems captures the verse numbers this needs to be used
	calcDist = (l, f) => {
		if (l === f) return 0;
		let stringDiff = '';

		for (let i = f + 1; i <= l; i += 1) {
			// Adds the length of each verse number
			stringDiff += i.toFixed(0);
			// Adds an additional character for the extra space
			stringDiff += '1';
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
				parentNode: this.format,
				message: this.props.formattedSource.footnotes[id],
				closeFootnote: this.closeFootnote,
				coords,
			},
		});
	}

	openContextMenu = (e) => {
		const rightEdge = window.innerWidth - 250;
		const bottomEdge = window.innerHeight - 293;
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

		if (loadingNewChapterText) {
			return <LoadingSpinner />;
		}

		return (
			<div className="text-container">
				<SvgWrapper className={'icon info-button'} svgid={'info'} onClick={() => !informationActive && toggleInformationModal()} />
				<div onClick={prevChapter} className={'arrow-wrapper'}>
					<SvgWrapper className="prev-arrow-svg" svgid="arrow_left" />
				</div>
				<main ref={this.setMainRef} className={formattedSource.main && !readersMode ? '' : 'chapter'}>
					{
						((formattedSource.main && !readersMode) || text.length === 0 || !readersMode) ? null : (
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
	verseNumber: PropTypes.string,
	activeBookId: PropTypes.string,
	activeBookName: PropTypes.string,
};

export default Text;
