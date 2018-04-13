/**
*
* EditNote
*
*/

import React from 'react';
import PropTypes from 'prop-types';
// import BooksTable from 'components/BooksTable';
import SvgWrapper from 'components/SvgWrapper';
// import styled from 'styled-components';

class EditNote extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
	state = {
		textarea: this.props.note.get('notes') || '',
		titleText: this.props.note.get('title') || '',
		savedNote: !!this.props.note.get('id'),
		selectedChapter: '',
		selectedBookName: '',
		selectedBookId: '',
	}

	componentWillUnmount() {
		// Dispatch api call to save the user note and hope nothing hiccups
		// This will not fire if the user closes the tab or the browser
		if (this.state.textarea) {
			this.handleSave();
		}
	}

	getCurrentDate = () => {
		const date = new Date();
		const day = date.getDate();
		const year = date.getFullYear().toFixed().slice(2);
		const month = (date.getMonth() + 1).toFixed();

		return `${month.length === 1 ? `0${month}` : month}.${day}.${year}`;
	}

	setSelectedChapter = (chapter) => {
		this.setState({ selectedChapter: chapter });
	}

	setSelectedBookName = ({ book, id }) => {
		this.setState({ selectedBookName: book, selectedBookId: id });
	}

	// I think This could easily cause performance issues...
	// But I don't know how to save the note another way if there
	// Isn't a "save" button... ...
	handleTextareaChange = (e) => {
		const val = e.target.value;
		this.setState({ textarea: val });
		// Clears the timeout so that at most there will only be one request per 2.5 seconds
		if (this.timer) {
			clearTimeout(this.timer);
		}
		// Don't have to bind 'this' bc of the arrow function
		this.timer = setTimeout(() => {
			// Don't save if there isn't a value
			if (!val) {
				return;
			}
			this.handleSave();
		}, 2500);
	}

	handleNoteTitleChange = (e) => {
		const val = e.target.value;
		const textArea = this.state.textarea;
		this.setState({ titleText: e.target.value });
		// Clears the timeout so that at most there will only be one request per 2.5 seconds
		if (this.timer) {
			clearTimeout(this.timer);
		}
		// Don't have to bind 'this' bc of the arrow function
		this.timer = setTimeout(() => {
			// Don't save if there isn't a value
			if (!val || !textArea) {
				return;
			}
			this.handleSave();
		}, 2500);
	}

	handleSave = () => {
		const { note, activeTextId } = this.props;
		const { titleText, textarea } = this.state;
		const chapter = note.get('chapter');
		const verseStart = note.get('verse_start');
		const verseEnd = note.get('verse_end');
		const bookId = note.get('book_id');

		if (this.state.savedNote) {
			this.props.updateNote({
				bible_id: activeTextId,
				title: titleText,
				notes: textarea,
				book_id: bookId,
				bookmark: 0,
				verse_start: verseStart,
				verse_end: verseEnd,
				chapter,
			});
		} else {
			this.props.addNote({
				bible_id: activeTextId,
				title: titleText,
				notes: textarea,
				book_id: bookId,
				bookmark: 0,
				verse_start: verseStart,
				verse_end: verseEnd,
				chapter,
			});
		}

		this.setState({ savedNote: true });
	}

	deleteNote = () => this.setState({ deleteNote: true }); // console.log('send api call to delete the note')

	get verseReference() {
		const { vernacularNamesObject, note } = this.props;
		const book = note.get('book_id');
		const start = note.get('verse_start');
		const end = note.get('verse_end');
		const chapter = note.get('chapter');
		const verses = (start === end || !end) ? start : `${start}-${end}`;

		if (book && chapter && start) {
			return `${vernacularNamesObject[book]} ${chapter}:${verses}`;
		} else if (this.state.selectedBookName && this.state.selectedChapter) {
			return `${this.state.selectedBookName} ${this.state.selectedChapter}`;
		}
		return 'Please Add a Verse';
	}

	render() {
		const {
			toggleVerseText,
			// toggleAddVerseMenu,
			note,
			// isAddVerseExpanded,
			isVerseTextVisible,
			activeTextId,
			notePassage,
		} = this.props;
		// const {
		// 	selectedBookName,
		// 	selectedChapter,
		// } = this.state;

		return (
			<section className="edit-notes">
				<div className="date-title">
					<input onChange={this.handleNoteTitleChange} placeholder="CLICK TO ADD TITLE" className="title" value={this.state.titleText} />
					<span className="date">{note.get('date') || this.getCurrentDate()}</span>
				</div>
				<div className={`verse-dropdown${isVerseTextVisible ? ' open' : ''}`}>
					<SvgWrapper onClick={toggleVerseText} className={'icon'} svgid="arrow_right" />
					<span className="text">{this.verseReference}</span>
					<span className="version-dropdown">{activeTextId}</span>
				</div>
				{
					isVerseTextVisible ? (
						<div className="verse-text">
							&quot;&nbsp;{notePassage}&nbsp;&quot;
						</div>
					) : null
				}
				<textarea onChange={this.handleTextareaChange} placeholder="CLICK TO ADD NOTE" value={this.state.textarea} className="note-text" />
				<div className={'delete-note-section'}>
					<SvgWrapper className={'icon'} svgid={'delete'} />
					<span className="save-button" role="button" tabIndex={0} onClick={() => this.deleteNote()}>Delete Note</span>
				</div>
			</section>
		);
	}
}

EditNote.propTypes = {
	addNote: PropTypes.func,
	updateNote: PropTypes.func,
	toggleVerseText: PropTypes.func,
	// toggleAddVerseMenu: PropTypes.func,
	note: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	// isAddVerseExpanded: PropTypes.bool,
	isVerseTextVisible: PropTypes.bool,
	notePassage: PropTypes.string,
	activeTextId: PropTypes.string,
};

export default EditNote;
