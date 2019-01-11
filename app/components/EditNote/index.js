/**
 *
 * EditNote
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import PopupMessage from '../PopupMessage';
import SvgWrapper from '../SvgWrapper';

class EditNote extends React.PureComponent {
	// eslint-disable-line react/prefer-stateless-function
	constructor(props) {
		super(props);
		// TODO: Can get rid of the const statements below once the tags field is an object
		const hasTitle =
			this.props.note.get('tags') &&
			typeof this.props.note.get('tags').find === 'function' &&
			this.props.note.get('tags').find((t) => t.get('type') === 'title');
		const titleText =
			(hasTitle &&
				this.props.note
					.get('tags')
					.find((t) => t.get('type') === 'title')
					.get('value')) ||
			'';

		this.state = {
			textarea: this.props.note.get('notes') || '',
			savedNote: !!this.props.note.get('id'),
			selectedChapter: '',
			selectedBookName: '',
			selectedBookId: '',
			titleText,
			savingNote: false,
			readTheMessage: false,
			popupOpen: false,
			coords: { x: 0, y: 0 },
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.state.savingNote && nextProps.savedTheNote) {
			this.setState({ savingNote: false });
		}
	}

	getReference = (verseStart, verseEnd, chapter) =>
		`${this.props.activeBookName} ${chapter}:${
			verseStart === verseEnd || !verseEnd
				? verseStart
				: `${verseStart}-${verseEnd}`
		}`;

	getCurrentDate = () => {
		const date = new Date();
		const day = date.getDate();
		const year = date
			.getFullYear()
			.toFixed()
			.slice(2);
		const month = (date.getMonth() + 1).toFixed();

		return `${month.length === 1 ? `0${month}` : month}.${day}.${year}`;
	};

	get verseReference() {
		const { vernacularNamesObject, note } = this.props;
		if (
			note.get('tags') &&
			note.get('tags').find((tag) => tag.get('type') === 'reference')
		) {
			const ref = note
				.get('tags')
				.find((tag) => tag.get('type') === 'reference');
			return ref.get('value');
		}
		const book = note.get('book_id');
		const start = note.get('verse_start');
		const end = note.get('verse_end');
		const chapter = note.get('chapter');
		const verses = start === end || !end ? start : `${start}-${end}`;

		if (book && chapter && start) {
			return `${vernacularNamesObject[book]} ${chapter}:${verses}`;
		} else if (this.state.selectedBookName && this.state.selectedChapter) {
			return `${this.state.selectedBookName} ${this.state.selectedChapter}`;
		}
		return 'Please Add a Verse';
	}

	handleTextareaChange = (e) => {
		e.persist();
		if (
			!this.state.readTheMessage ||
			this.props.savedTheNote ||
			this.props.errorSavingNote
		) {
			this.props.readSavedMessage();
			this.props.clearNoteErrorMessage();
		}
		this.setState(
			(cs) =>
				cs.readTheMessage
					? { textarea: e.target.value }
					: { textarea: e.target.value, readTheMessage: true },
		);
	};

	handleNoteTitleChange = (e) => {
		e.persist();
		if (
			!this.state.readTheMessage ||
			this.props.savedTheNote ||
			this.props.errorSavingNote
		) {
			this.props.readSavedMessage();
			this.props.clearNoteErrorMessage();
		}
		this.setState(
			(cs) =>
				cs.readTheMessage
					? { titleText: e.target.value }
					: { titleText: e.target.value, readTheMessage: true },
		);
	};

	handleSave = (e) => {
		const { note, activeTextId, errorSavingNote } = this.props;
		const { titleText, textarea } = this.state;
		const chapter = note.get('chapter');
		const verseStart = note.get('verse_start');
		const verseEnd = note.get('verse_end');
		const bookId = note.get('book_id');
		const id = note.get('id');
		const hasTitle =
			this.props.note.get('tags') &&
			typeof this.props.note.get('tags').find === 'function' &&
			this.props.note.get('tags').find((t) => t.get('type') === 'title');
		const prevTitle =
			(hasTitle &&
				this.props.note
					.get('tags')
					.find((t) => t.get('type') === 'title')
					.get('value')) ||
			'';

		if (!textarea) {
			const rightEdge = window.innerWidth - 100;
			const bottomEdge = window.innerHeight - 115;
			const x = rightEdge < e.clientX ? rightEdge : e.clientX;
			const y = bottomEdge < e.clientY ? bottomEdge : e.clientY;

			this.setState({ popupOpen: true, coords: { x, y } });
			if (this.timer) {
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(() => {
				// There may be an issue with doing this here because of the 2500 ms delay
				if (errorSavingNote) {
					this.props.clearNoteErrorMessage();
				}
				this.setState({ popupOpen: false });
			}, 2500);
			return;
		}

		if (note.get('notes') === textarea && prevTitle === titleText) {
			// If the original text equals the current text then I don't have to do anything
			// Because the user has not updated their note
			this.setState({ savingNote: false });
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
				tags: `title::: ${titleText},reference::: ${this.getReference(
					verseStart,
					verseEnd,
					chapter,
				)}`,
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
				tags: `title::: ${titleText},reference::: ${this.getReference(
					verseStart,
					verseEnd,
					chapter,
				)}`,
			});
		}

		this.setState({ savingNote: true });
	};

	deleteNote = () => {
		if (this.props.note.get('id')) {
			this.props.deleteNote({ noteId: this.props.note.get('id') });
			this.props.setActiveChild('notes');
		}
	};

	render() {
		const {
			toggleVerseText,
			note,
			isVerseTextVisible,
			activeTextId,
			notePassage,
			savedTheNote,
			notesErrorMessage,
			errorSavingNote,
		} = this.props;
		const { savingNote, popupOpen, coords } = this.state;

		return (
			<section className="edit-notes">
				<div
					tabIndex={0}
					role={'button'}
					onClick={() => this.props.setActiveChild('notes')}
					className={'go-back'}
				>
					<SvgWrapper className={'icon'} svgid={'arrow_left'} />
					<span>View All Notes</span>
				</div>
				<div className="date-title">
					<input
						onChange={this.handleNoteTitleChange}
						placeholder="CLICK TO ADD TITLE"
						className="title"
						value={this.state.titleText}
					/>
					<span className="date">
						{note.get('date') || this.getCurrentDate()}
					</span>
				</div>
				<div className={`verse-dropdown${isVerseTextVisible ? ' open' : ''}`}>
					<SvgWrapper
						onClick={toggleVerseText}
						className={'icon'}
						svgid="arrow_right"
					/>
					<span className="text">{this.verseReference}</span>
					<span className="version-dropdown">{activeTextId}</span>
				</div>
				{isVerseTextVisible ? (
					<div className="verse-text">
						&quot;&nbsp;
						{notePassage}
						&nbsp;&quot;
					</div>
				) : null}
				<textarea
					onChange={this.handleTextareaChange}
					placeholder="CLICK TO ADD NOTE"
					value={this.state.textarea}
					className="note-text"
				/>
				<div className={'delete-note-section'}>
					<span
						className="delete-button"
						role="button"
						tabIndex={0}
						onClick={() => this.deleteNote()}
					>
						<SvgWrapper className={'icon'} svgid={'delete'} />
						Delete Note
					</span>
					{savedTheNote && !errorSavingNote ? (
						<span
							className="saved-note"
							role="button"
							tabIndex={0}
							onClick={this.handleSave}
						>
							Saved
						</span>
					) : (
						<span
							className={errorSavingNote ? 'save-button failed' : 'save-button'}
							role="button"
							tabIndex={0}
							onClick={this.handleSave}
						>
							{savingNote && !errorSavingNote
								? 'Updating...'
								: `${errorSavingNote ? 'Failed' : 'Save'}`}
						</span>
					)}
				</div>
				{popupOpen ? (
					<PopupMessage
						message={
							errorSavingNote && notesErrorMessage
								? notesErrorMessage
								: 'The notes field cannot be empty.'
						}
						x={coords.x}
						y={coords.y}
					/>
				) : null}
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
	note: PropTypes.object,
	vernacularNamesObject: PropTypes.object,
	isVerseTextVisible: PropTypes.bool,
	notePassage: PropTypes.string,
	activeTextId: PropTypes.string,
	savedTheNote: PropTypes.bool,
	activeBookName: PropTypes.string,
	notesErrorMessage: PropTypes.string,
	errorSavingNote: PropTypes.bool,
	clearNoteErrorMessage: PropTypes.func,
};

export default EditNote;
