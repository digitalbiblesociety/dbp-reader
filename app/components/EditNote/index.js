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
	constructor(props) {
		super(props);
		// Todo: Can get rid of the const statements below once the tags field is an object
		const hasTitle = (
			this.props.note.get('tags') &&
			typeof this.props.note.get('tags').find === 'function' &&
			this.props.note.get('tags').find((t) => t.get('type') === 'title')
		);
		const titleText = (hasTitle && this.props.note.get('tags').find((t) => t.get('type') === 'title').get('value')) || '';

		this.state = {
			textarea: this.props.note.get('notes') || '',
			savedNote: !!this.props.note.get('id'),
			selectedChapter: '',
			selectedBookName: '',
			selectedBookId: '',
			titleText,
			savingNote: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.savingNote && nextProps.savedTheNote) {
			this.setState({ savingNote: false });
		}
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

	// Use this to suggest to the user that they may want to save thier note
	setTimer = () => {
		// const titleText = this.state.titleText;
		// const textArea = this.state.textarea;
		// // Clears the timeout so that at most there will only be one request per 2.5 seconds
		// if (this.timer) {
		// 	clearTimeout(this.timer);
		// }
		// // Don't have to bind 'this' bc of the arrow function
		// this.timer = setTimeout(() => {
		// 	// Don't save if there isn't a value
		// 	if (!textArea || !titleText) {
		// 		return;
		// 	}
		// 	// Make a function to alert the user that their work is not saved
		// 	this.handleSave();
		// }, 5000);
	}

	handleTextareaChange = (e) => {
		this.setState({ textarea: e.target.value }, () => {
			this.props.readSavedMessage();
			this.setTimer();
		});
	}

	handleNoteTitleChange = (e) => {
		this.setState({ titleText: e.target.value }, () => {
			this.props.readSavedMessage();
			this.setTimer();
		});
	}

	handleSave = () => {
		const { note, activeTextId } = this.props;
		const { titleText, textarea } = this.state;
		const chapter = note.get('chapter');
		const verseStart = note.get('verse_start');
		const verseEnd = note.get('verse_end');
		const bookId = note.get('book_id');
		const id = note.get('id');
		const hasTitle = (
			this.props.note.get('tags') &&
			typeof this.props.note.get('tags').find === 'function' &&
			this.props.note.get('tags').find((t) => t.get('type') === 'title')
		);
		const prevTitle = (hasTitle && this.props.note.get('tags').find((t) => t.get('type') === 'title').get('value')) || '';

		if (note.get('notes') === textarea && prevTitle === titleText) {
			// If the original text equals the current text then I don't have to do anything
			// Because the user has not updated their note
			return;
		} else if (this.state.savedNote) {
			this.props.updateNote({
				bible_id: activeTextId,
				notes: textarea,
				book_id: bookId,
				bookmark: 0,
				verse_start: verseStart,
				verse_end: verseEnd,
				chapter,
				tags: `title&#58; ${titleText}`,
				id,
			});
		} else {
			this.props.addNote({
				bible_id: activeTextId,
				notes: textarea,
				book_id: bookId,
				bookmark: 0,
				verse_start: verseStart,
				verse_end: verseEnd,
				chapter,
				tags: `title&#58; ${titleText}`,
			});
		}

		this.setState({ savingNote: true });
		this.props.setActiveChild('notes');
	}

	deleteNote = () => this.props.deleteNote({ noteId: this.props.note.get('id') }); // console.log('send api call to delete the note')

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
			savedTheNote,
		} = this.props;
		const {
			savingNote,
		} = this.state;
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
					<span className="delete-button" role="button" tabIndex={0} onClick={() => this.deleteNote()}>Delete Note</span>
					{
						savedTheNote ?
							<span className="saved-note" role="button" tabIndex={0} onClick={() => this.handleSave()}>Saved</span> :
							<span className="save-button" role="button" tabIndex={0} onClick={() => this.handleSave()}>{savingNote ? 'Updating...' : 'Save'}</span>
					}
				</div>
			</section>
		);
	}
}

EditNote.propTypes = {
	addNote: PropTypes.func,
	updateNote: PropTypes.func,
	deleteNote: PropTypes.func,
	setActiveChild: PropTypes.func,
	toggleVerseText: PropTypes.func,
	readSavedMessage: PropTypes.func,
	// toggleAddVerseMenu: PropTypes.func,
	note: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	// isAddVerseExpanded: PropTypes.bool,
	isVerseTextVisible: PropTypes.bool,
	notePassage: PropTypes.string,
	activeTextId: PropTypes.string,
	savedTheNote: PropTypes.bool,
};

export default EditNote;
