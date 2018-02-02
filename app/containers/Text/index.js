/**
*
* Text
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import SvgWrapper from 'components/SvgWrapper';
import ContextPortal from 'components/ContextPortal';
/* Disabling the jsx-a11y linting because we need to capture the selected text
	 and the most straight forward way of doing so is with the onMouseUp event */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
class Text extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		contextMenuState: false,
		coords: {},
		selectedText: '',
		firstVerse: 0,
		lastVerse: 0,
	};

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
		if (e.button === 0 && this.main.contains(e.target) && e.target.attributes.verseid) {
			this.setState({ firstVerse: e.target.attributes.verseid.value });
		}
		// else if (this.main.contains(e.target)) {
		// 	let node = e.target;
		// 	let counter = 5;
		// 	while (!node.attributes.verseid) {
		// 		node = node.parentNode;
		// 		if (counter === 0) {
		// 			break;
		// 		}
		// 		counter--;
		// 	}
		// 	console.log('verse id when child is clicked', node.attributes.verseid);
		// }

		// On mousedown get the first verse number / dom node
		// On mouseup
		// check if the mouse up was in the text dom node
		// if it was then get the last verse number / dom node and get
		// the selected text on the window object
		// if the numbers are the same then the selected text is in
		// one verse
		// if the selection spans multiple verses match the beginning
		// of the selected text
		// with the first verse to find where the selection starts
		// then match the ending of the selected text with the last verse
		// to find its end

		// if the user chooses to create a note
		// take the start and end verse and use them as the reference

		// if the user creates a highlight, mark the index of the beginning
		// word in the first verse and the ending word in the last verse
		// as well as recording the version
	}

	getLastVerse = (e) => {
		if (e.button === 0 && window.getSelection().toString() && this.main.contains(e.target) && e.target.attributes.verseid) {
			// console.log(e.target.attributes.verseid);
			const selectedText = window.getSelection().toString();
			// const selection = {};

			// selection.firstOffset = s.anchorOffset;
			// selection.lastOffset = s.focusOffset;
			// selection.text = s.toString();
			// console.log(selection);
			this.setState({ lastVerse: e.target.attributes.verseid.value, selectedText });
		}
		// Below code gets the highlighted text
		// window.getSelection().toString();
	}

	get getTextComponents() {
		const {
			text,
			userSettings,
			formattedSource,
		} = this.props;
		let textComponents;
		const readersMode = userSettings.getIn(['toggleOptions', 'readersMode', 'active']);
		const oneVersePerLine = userSettings.getIn(['toggleOptions', 'oneVersePerLine', 'active']);
		const justifiedText = userSettings.getIn(['toggleOptions', 'justifiedText', 'active']);

		if (readersMode) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}>{verse.verse_text}&nbsp;&nbsp;</span>
			));
		} else if (formattedSource) {
			// TODO: find way of providing the html without using dangerouslySetInnerHTML
			/* eslint-disable react/no-danger */
			// console.log('formatted source in text component', formattedSource)
			textComponents = (
				<div dangerouslySetInnerHTML={{ __html: formattedSource }}></div>
			);
		} else if (oneVersePerLine) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}><br />&nbsp;<sup>{verse.verse_start_vernacular}</sup>&nbsp;{verse.verse_text}<br /></span>
			));
		} else if (justifiedText) {
			textComponents = text.map((verse) => (
				<span verseid={verse.verse_start} key={verse.verse_start}>&nbsp;<sup verseid={verse.verse_start}>{verse.verse_start_vernacular}</sup>&nbsp;{verse.verse_text}</span>
			));
		} else {
			textComponents = (<h5>Please select a mode for displaying text by using the options in the Settings menu locatated near the bottom left of the screen!</h5>);
		}

		return textComponents;
	}

	// Allows use of the right mouse button to toggle menu's or perform different actions
	handleContext = (e) => e.preventDefault()

	handleMouseUp = (e) => {
		if (e.button === 2) {
			this.openContextMenu(e);
		} else {
			this.getLastVerse(e);
		}
	}

	openContextMenu = (e) => {
		const x = e.clientX;
		const y = e.clientY;

		this.setState({
			coords: { x, y },
			contextMenuState: true,
		});
	}

	closeContextMenu = () => this.setState({ contextMenuState: false })

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
		} = this.props;
		const {
			coords,
			contextMenuState,
		} = this.state;

		return (
			<div className="text-container">
				{
					activeBookId === 'GEN' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main ref={this.setMainRef} onClick={(e) => e.button === 0 && this.closeContextMenu()} onMouseDown={this.getFirstVerse} onMouseUp={this.handleMouseUp} className="chapter" onContextMenu={this.handleContext}>
					{
						formattedSource ? null : (
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
						<ContextPortal setActiveNote={this.setActiveNote} setActiveNotesView={setActiveNotesView} closeContextMenu={this.closeContextMenu} toggleNotesModal={toggleNotesModal} notesActive={notesActive} parentNode={this.main} coordinates={coords} />
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
	formattedSource: PropTypes.string,
	setActiveNote: PropTypes.func,
	activeBookId: PropTypes.string,
};

export default Text;
