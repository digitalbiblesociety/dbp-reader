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
			note.href = '';
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
		if (e.button === 0 && this.main.contains(e.target) && e.target.attributes.verseid) {
			this.setState({ firstVerse: e.target.attributes.verseid.value });
		}
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
		} else if (formattedSource.main) {
			// TODO: find way of providing the html without using dangerouslySetInnerHTML
			/* eslint-disable react/no-danger */
			// console.log('formatted source in text component', formattedSource)
			// textComponents = [addClickToNotes({ html: formattedSource.main, action: this.openFootnote })];
			// console.log(textComponents);
			textComponents = (<div ref={this.setFormattedRef} style={{ all: 'inherit' }} dangerouslySetInnerHTML={{ __html: formattedSource.main }} />);
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
		// console.log('text components', textComponents);
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

	handleMainClick = (e) => {
		if (e.button === 0 && this.state.footnoteState && e.target.className !== 'key') {
			this.closeFootnote();
		} else if (e.button === 0 && this.state.contextMenuState) {
			this.closeContextMenu();
		}
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
			footnoteState,
			footnotePortal,
		} = this.state;

		return (
			<div className="text-container">
				{
					activeBookId === 'GEN' && activeChapter === 1 ? null : (
						<SvgWrapper onClick={prevChapter} className="prev-arrow-svg" svgid="prev-arrow" />
					)
				}
				<main ref={this.setMainRef} onClick={this.handleMainClick} onMouseDown={this.getFirstVerse} onMouseUp={this.handleMouseUp} className="chapter" onContextMenu={this.handleContext}>
					{
						formattedSource.main ? null : (
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
	formattedSource: PropTypes.object,
	setActiveNote: PropTypes.func,
	activeBookId: PropTypes.string,
};

export default Text;
