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
	};

	setMainRef = (el) => {
		this.main = el;
	}

	getFirstVerse = (e) => {
		if (this.main.contains(e.target) && e.target.attributes.verseid) {
			console.log('verse id', e.target.attributes.verseid);
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
		if (window.getSelection().toString() && this.main.contains(e.target)) {
			console.log(e.target.attributes.verseid);
			const s = window.getSelection();
			const selection = {};

			selection.firstOffset = s.anchorOffset;
			selection.lastOffset = s.focusOffset;
			selection.text = s.toString();
			console.log(selection);
		}
		// Below code gets the highlighted text
		// window.getSelection().toString();
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
			text,
			nextChapter,
			prevChapter,
			activeBookName,
			activeChapter,
			toggleNotesModal,
			notesActive,
			setActiveNotesView,
			readersMode,
			oneVersePerLine,
			formattedText,
			formattedTextActive,
		} = this.props;
		let textComponents;

		if (readersMode) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}>{verse.verse_text}</span>
			));
		} else if (oneVersePerLine) {
			textComponents = text.map((verse) => (
				<span key={verse.verse_start}><br />&nbsp;<sup>{verse.verse_start_vernacular}</sup>&nbsp;{verse.verse_text}<br /></span>
			));
		} else if (formattedTextActive) {
			// TODO: find way of providing the html without using dangerouslySetInnerHTML
			// eslint-disable react/no-danger
			textComponents = (
				<div dangerouslySetInnerHTML={{ __html: formattedText }}></div>
			);
		} else {
			textComponents = text.map((verse) => (
				<span verseid={verse.verse_start} key={verse.verse_start}>&nbsp;<sup verseid={verse.verse_start}>{verse.verse_start_vernacular}</sup>&nbsp;{verse.verse_text}</span>
			));
		}
		return (
			<div className="text-container">
				{
					activeBookName === 'Genesis' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main ref={this.setMainRef} onClick={(e) => e.button === 0 && this.closeContextMenu()} onMouseDown={this.getFirstVerse} onMouseUp={this.handleMouseUp} className="chapter" onContextMenu={this.handleContext}>
					{
						readersMode || formattedTextActive ? null : (
							<h1 className="active-chapter-title">{activeChapter}</h1>
						)
					}
					{textComponents}
				</main>
				{
					activeBookName === 'Revelation' && activeChapter === 22 ? null : (
						<SvgWrapper onClick={nextChapter} className="next-arrow-svg" svgid="next-arrow" />
					)
				}
				{
					this.state.contextMenuState ? (
						<ContextPortal setActiveNotesView={setActiveNotesView} closeContextMenu={this.closeContextMenu} toggleNotesModal={toggleNotesModal} notesActive={notesActive} parentNode={this.main} coordinates={this.state.coords} />
					) : null
				}
			</div>
		);
	}
}

Text.propTypes = {
	text: PropTypes.array,
	nextChapter: PropTypes.func,
	prevChapter: PropTypes.func,
	toggleNotesModal: PropTypes.func,
	setActiveNotesView: PropTypes.func,
	activeBookName: PropTypes.string,
	formattedText: PropTypes.string,
	activeChapter: PropTypes.number,
	notesActive: PropTypes.bool,
	readersMode: PropTypes.bool,
	oneVersePerLine: PropTypes.bool,
	formattedTextActive: PropTypes.bool,
};

export default Text;
